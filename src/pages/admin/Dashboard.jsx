import React from 'react'

const cardStyle = {
  background: 'rgba(255,255,255,.03)',
  border: '1px solid rgba(255,255,255,.08)',
  borderRadius: '14px',
  padding: '18px',
}

const Dashboard = () => {
  return (
    <div style={{ display: 'grid', gap: '18px' }}>
      <div>
        <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#e63b60', marginBottom: '6px' }}>Overview</div>
        <h1 style={{ fontSize: '32px', lineHeight: 1.1, margin: 0 }}>Command Center</h1>
        <p style={{ marginTop: '6px', color: '#a0a8bc' }}>Monitor bookings, showtimes, and seat orders from one admin dashboard.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <div style={cardStyle}><div style={{ color: '#a0a8bc', fontSize: '11px' }}>Revenue Today</div><div style={{ fontSize: '28px', color: '#e63b60', marginTop: '8px' }}>LKR 84,500</div></div>
        <div style={cardStyle}><div style={{ color: '#a0a8bc', fontSize: '11px' }}>Tickets Sold</div><div style={{ fontSize: '28px', color: '#f4f4f8', marginTop: '8px' }}>248</div></div>
        <div style={cardStyle}><div style={{ color: '#a0a8bc', fontSize: '11px' }}>Active Shows</div><div style={{ fontSize: '28px', color: '#f4f4f8', marginTop: '8px' }}>12</div></div>
        <div style={cardStyle}><div style={{ color: '#a0a8bc', fontSize: '11px' }}>Pending Orders</div><div style={{ fontSize: '28px', color: '#f4f4f8', marginTop: '8px' }}>7</div></div>
      </div>

      <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a0a8bc', marginBottom: '10px' }}>Upcoming Shows</div>
          <ul style={{ margin: 0, paddingLeft: '18px', color: '#f4f4f8', lineHeight: 1.8 }}>
            <li>Midnight in Paris — 7:30 PM</li>
            <li>Neon Skyline — 9:15 PM</li>
            <li>Silent Harbor — 11:00 PM</li>
          </ul>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a0a8bc', marginBottom: '10px' }}>Quick Actions</div>
          <ul style={{ margin: 0, paddingLeft: '18px', color: '#f4f4f8', lineHeight: 1.8 }}>
            <li>Add a new showtime</li>
            <li>Review seat orders</li>
            <li>Open the HTML console</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
