import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pageNames = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/console': 'Admin Console',
  '/admin/addshows': 'Add Shows',
  '/admin/listshows': 'List Shows',
  '/admin/listbookings': 'List Bookings',
  '/admin/seatorder': 'Seat Orders',
}

const AdminNavbar = () => {
  const { pathname } = useLocation()
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const pageName = pageNames[pathname] || 'Admin'

  return (
    <header style={{
      position: 'fixed',
      left: '58px',
      top: 0,
      right: 0,
      height: '58px',
      background: 'rgba(0,0,0,.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,.12)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: '12px',
      zIndex: 190,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Brand */}
      <span style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '20px',
        letterSpacing: '3px',
        color: '#f4f4f8',
        flexShrink: 0,
      }}>
        FLICK<span style={{ color: '#e63b60' }}>SEAT</span>
      </span>

      {/* Separator */}
      <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,.18)', flexShrink: 0 }} />

      {/* Page name */}
      <span style={{ fontSize: '13px', color: '#a0a8bc', flex: 1 }}>{pageName}</span>

      {/* Live pill */}
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 9px',
        borderRadius: '20px',
        fontSize: '10px',
        fontWeight: 500,
        letterSpacing: '.6px',
        textTransform: 'uppercase',
        background: 'rgba(230,59,96,.08)',
        color: '#e63b60',
        border: '1px solid rgba(230,59,96,.2)',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#e63b60',
          animation: 'sbPulse 2s ease-in-out infinite',
          display: 'inline-block',
        }} />
        Live
      </span>

      {/* Clock */}
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '11.5px',
        color: '#606880',
        flexShrink: 0,
      }}>{clock}</span>

      {/* Avatar */}
      <span style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        border: '1px solid #e63b60',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10.5px',
        fontWeight: 500,
        color: '#e63b60',
        background: 'rgba(230,59,96,.06)',
        flexShrink: 0,
      }}>FS</span>

      <style>{`@keyframes sbPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </header>
  )
}

export default AdminNavbar
