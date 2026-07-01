import React from 'react'

const shows = [
  { title: 'Midnight in Paris', date: '2026-06-26', time: '19:30', seats: '72/90' },
  { title: 'Neon Skyline', date: '2026-06-27', time: '21:15', seats: '58/90' },
  { title: 'Silent Harbor', date: '2026-06-28', time: '22:00', seats: '81/90' },
]

export default function ListShows() {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', padding: '20px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#e63b60', marginBottom: '8px' }}>List Shows</div>
        <h2 style={{ margin: 0, fontSize: '28px' }}>Showtime Management</h2>
        <p style={{ color: '#a0a8bc', marginTop: '8px' }}>A quick view of the upcoming screenings and seat availability.</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', padding: '14px 16px', background: 'rgba(255,255,255,.04)', color: '#a0a8bc', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          <span>Movie</span>
          <span>Date</span>
          <span>Time</span>
          <span>Seats</span>
        </div>
        {shows.map((show) => (
          <div key={show.title} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,.06)', color: '#f4f4f8' }}>
            <span>{show.title}</span>
            <span>{show.date}</span>
            <span>{show.time}</span>
            <span>{show.seats}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
