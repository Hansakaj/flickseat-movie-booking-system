import React from 'react'

export default function ListBookings() {
  return (
    <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '14px', padding: '20px' }}>
      <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#e63b60', marginBottom: '8px' }}>List Bookings</div>
      <h2 style={{ margin: 0, fontSize: '28px' }}>All Bookings</h2>
      <p style={{ color: '#a0a8bc', marginTop: '8px' }}>Booking list will appear here.</p>
    </div>
  )
}
