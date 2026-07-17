import React from 'react'

const bookings = [
  { customer: 'Kavindu', movie: 'Midnight in Paris', seats: '2', status: 'Confirmed' },
  { customer: 'Nimal', movie: 'Neon Skyline', seats: '4', status: 'Pending' },
  { customer: 'Sahan', movie: 'Silent Harbor', seats: '3', status: 'Confirmed' },
]

export default function ListBookings() {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', padding: '20px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#e63b60', marginBottom: '8px' }}>List Bookings</div>
        <h2 style={{ margin: 0, fontSize: '28px' }}>All Bookings</h2>
        <p style={{ color: '#a0a8bc', marginTop: '8px' }}>Review bookings and keep track of the latest ticket purchases.</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.7fr 1fr', gap: '12px', padding: '14px 16px', background: 'rgba(255,255,255,.04)', color: '#a0a8bc', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          <span>Customer</span>
          <span>Movie</span>
          <span>Seats</span>
          <span>Status</span>
        </div>
        {bookings.map((booking) => (
          <div key={booking.customer} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 0.7fr 1fr', gap: '12px', padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,.06)', color: '#f4f4f8' }}>
            <span>{booking.customer}</span>
            <span>{booking.movie}</span>
            <span>{booking.seats}</span>
            <span style={{ color: booking.status === 'Confirmed' ? '#4ade80' : '#fbbf24' }}>{booking.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
