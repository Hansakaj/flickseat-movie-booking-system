import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from '../../component/Admin/AdminNavbar.jsx'
import Adminsidebar from '../../component/Admin/Adminsidebar.jsx'

const Layout = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#f4f4f8',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '13px',
    }}>
      <Adminsidebar />
      <AdminNavbar />
      <main style={{
        position: 'fixed',
        left: '58px',
        top: '58px',
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        padding: '24px 24px 40px',
      }} className="admin-ws">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
