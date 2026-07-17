import React from 'react'

export default function AddShows() {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', padding: '20px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#e63b60', marginBottom: '8px' }}>Add Shows</div>
        <h2 style={{ margin: 0, fontSize: '28px' }}>Create a new showtime</h2>
        <p style={{ color: '#a0a8bc', marginTop: '8px' }}>Use this panel to add movies, dates, and screening times for the public booking page.</p>
      </div>

      <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a0a8bc', marginBottom: '10px' }}>Movie</div>
          <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(230,59,96,.08)', color: '#f4f4f8' }}>Midnight in Paris</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a0a8bc', marginBottom: '10px' }}>Date</div>
          <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(230,59,96,.08)', color: '#f4f4f8' }}>2026-06-26</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a0a8bc', marginBottom: '10px' }}>Time</div>
          <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(230,59,96,.08)', color: '#f4f4f8' }}>19:30</div>
        </div>
      </div>
    </div>
  )
}
