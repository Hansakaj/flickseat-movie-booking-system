import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './pages/admin/Layout.jsx'
import SeatOrder from './pages/admin/SeatOrder.jsx'
import AdminConsole from './pages/admin/AdminConsole.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import AddShows from './pages/admin/addshows.jsx'
import ListShows from './pages/admin/Listshow.jsx'
import ListBookings from './pages/admin/Listbooking.jsx'

const AppAdmin = ({ hasClerkAuth = false }) => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* AdminConsole has its own built-in sidebar/navbar (static html), so it must NOT be wrapped in Layout */}
        <Route path="/admin/console" element={<AdminConsole />} />

        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="console" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="addshows" element={<AddShows />} />
          <Route path="listshows" element={<ListShows />} />
          <Route path="listbookings" element={<ListBookings />} />
          <Route path="seatorder" element={<SeatOrder />} />
        </Route>

        {/* Redirect root page or any other unknown page to the admin dashboard */}
        <Route path="/" element={<Navigate to="/admin/console" replace />} />
        <Route path="*" element={<Navigate to="/admin/console" replace />} />
      </Routes>
    </>
  )
}

export default AppAdmin
