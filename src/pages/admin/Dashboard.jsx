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
        <p style={{ marginTop: '6px', color: '#a0a8bc' }}>Admin shell is live. Use the sidebar to open the HTML-based console and seat order pages.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <div style={cardStyle}><div style={{ color: '#a0a8bc', fontSize: '11px' }}>Revenue Today</div><div style={{ fontSize: '28px', color: '#e63b60', marginTop: '8px' }}>LKR —</div></div>
        <div style={cardStyle}><div style={{ color: '#a0a8bc', fontSize: '11px' }}>Tickets Sold</div><div style={{ fontSize: '28px', color: '#f4f4f8', marginTop: '8px' }}>—</div></div>
        <div style={cardStyle}><div style={{ color: '#a0a8bc', fontSize: '11px' }}>Active Shows</div><div style={{ fontSize: '28px', color: '#f4f4f8', marginTop: '8px' }}>—</div></div>
        <div style={cardStyle}><div style={{ color: '#a0a8bc', fontSize: '11px' }}>Total Users</div><div style={{ fontSize: '28px', color: '#f4f4f8', marginTop: '8px' }}>—</div></div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a0a8bc', marginBottom: '10px' }}>Next Actions</div>
        <ul style={{ margin: 0, paddingLeft: '18px', color: '#f4f4f8', lineHeight: 1.8 }}>
          <li>Open <span style={{ color: '#e63b60' }}>Admin Console</span> for the HTML dashboard.</li>
          <li>Open <span style={{ color: '#e63b60' }}>Seat Orders</span> for the delivery UI.</li>
          <li>Keep the public site on port 5173 and admin on 4173.</li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
