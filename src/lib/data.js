import { supabase } from './supabase'

/* ────────────────────────────────────────────────────────────
   ADAPTERS
   Admin's Supabase schema (movies/showtimes) is simpler than
   the TMDB-style shape the UI components were built around
   (genres[], casts[], poster_path, backdrop_path, vote_average,
   runtime, dateTime map keyed by date). These helpers translate
   one into the other so existing components keep working.
──────────────────────────────────────────────────────────── */

export const mapMovieRow = (row) => {
  if (!row) return null

  const genreNames = (row.genre || 'Drama')
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean)

  const castNames = (row.cast_ || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)

  return {
    id: row.id,
    _id: row.id,
    title: row.title,
    overview: row.description || '',
    tagline: '',
    poster_path: row.poster_url || '',
    backdrop_path: row.poster_url || '',
    genres: genreNames.map((name, idx) => ({ id: idx, name })),
    casts: castNames.map((name) => ({ name, profile_path: '' })),
    release_date: row.created_at ? row.created_at.slice(0, 10) : '',
    original_language: 'en',
    vote_average: Number(row.rating) || 0,
    vote_count: 0,
    runtime: Number(row.duration) || 0,
    trailer_url: row.trailer_url || '',
    is_active: row.is_active,
  }
}

// Builds an ISO-like timestamp string from a date + time-of-day
const toIsoDateTime = (showDate, showTime) => {
  // show_date: 'YYYY-MM-DD', show_time: 'HH:MM:SS'
  if (!showDate || !showTime) return null
  return `${showDate}T${showTime.slice(0, 8)}.000Z`
}

export const mapShowtimeRow = (row) => ({
  showId: row.id,
  movieId: row.movie_id,
  time: toIsoDateTime(row.show_date, row.show_time),
  showDate: row.show_date,
  showTime: row.show_time,
  screen: row.screen,
  totalSeats: row.total_seats,
  availableSeats: row.available_seats,
  price: Number(row.price) || 0,
  isActive: row.is_active,
})

/* ────────────────────────────────────────────────────────────
   MOVIES & SHOWTIMES
──────────────────────────────────────────────────────────── */

// All active movies, mapped to the UI shape
export const fetchMovies = async () => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapMovieRow)
}

// Single movie by id
export const fetchMovieById = async (id) => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return mapMovieRow(data)
}

// All active showtimes for a movie, mapped + grouped by date
// Returns: { '2026-06-20': [{ showId, time, ... }, ...], ... }
export const fetchDateTimeForMovie = async (movieId) => {
  const { data, error } = await supabase
    .from('showtimes')
    .select('*')
    .eq('movie_id', movieId)
    .eq('is_active', true)
    .order('show_date', { ascending: true })
    .order('show_time', { ascending: true })

  if (error) throw error

  const mapped = (data || []).map(mapShowtimeRow)

  return mapped.reduce((acc, item) => {
    const dateKey = item.showDate
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(item)
    return acc
  }, {})
}

// A single showtime row (raw), e.g. to read available_seats/price before booking
export const fetchShowtimeById = async (showId) => {
  const { data, error } = await supabase
    .from('showtimes')
    .select('*')
    .eq('id', showId)
    .single()

  if (error) return null
  return data
}

/* ────────────────────────────────────────────────────────────
   CUSTOMERS
──────────────────────────────────────────────────────────── */

// Find or create a customer record by email (admin schema keys
// customers by a unique `whatsapp`, which we don't collect via
// Clerk, so fall back to email-based lookup).
export const ensureCustomer = async ({ name, email }) => {
  if (!email) return null

  const { data: existing, error: findError } = await supabase
    .from('customers')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (!findError && existing) return existing

  const { data: created, error: createError } = await supabase
    .from('customers')
    .insert({ name: name || 'Guest', email })
    .select('*')
    .single()

  if (createError) return null
  return created
}

/* ────────────────────────────────────────────────────────────
   BOOKINGS
──────────────────────────────────────────────────────────── */

// Create a booking + booking_items, and decrement available_seats
// on the related showtime.
export const createBooking = async ({
  customer,
  showId,
  seats, // array of { id, type, price }
  ticketTotal,
  concessionTotal = 0,
  grandTotal,
}) => {
  const bookingRef = `BK${Date.now()}`

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      booking_ref: bookingRef,
      customer_id: customer?.id ?? null,
      showtime_id: showId,
      seats: seats.map((s) => s.id),
      seat_count: seats.length,
      ticket_total: ticketTotal,
      concession_total: concessionTotal,
      grand_total: grandTotal,
      status: 'confirmed',
    })
    .select('*')
    .single()

  if (bookingError) throw bookingError

  if (seats.length > 0) {
    const items = seats.map((s) => ({
      booking_id: booking.id,
      item_name: `Seat ${s.id} (${s.type})`,
      quantity: 1,
      unit_price: s.price,
      subtotal: s.price,
    }))

    const { error: itemsError } = await supabase.from('booking_items').insert(items)
    if (itemsError) throw itemsError
  }

  // Best-effort: decrement available seats on the showtime
  const showtime = await fetchShowtimeById(showId)
  if (showtime) {
    const newAvailable = Math.max(0, (showtime.available_seats ?? 0) - seats.length)
    await supabase.from('showtimes').update({ available_seats: newAvailable }).eq('id', showId)
  }

  return booking
}

// Fetch a customer's bookings (with joined showtime + movie info)
export const fetchBookingsForCustomer = async (customerId) => {
  if (!customerId) return []

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      showtimes:showtime_id (
        *,
        movies:movie_id (*)
      )
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
