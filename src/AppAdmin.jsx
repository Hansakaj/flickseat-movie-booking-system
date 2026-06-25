import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './pages/admin/Layout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import AddShows from './pages/admin/addshows.jsx'
import ListShows from './pages/admin/Listshow.jsx'
import ListBookings from './pages/admin/Listbooking.jsx'
import SeatOrder from './pages/admin/SeatOrder.jsx'
import AdminConsole from './pages/admin/AdminConsole.jsx'

const AppAdmin = ({ hasClerkAuth = false }) => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="addshows" element={<AddShows />} />
          <Route path="console" element={<AdminConsole />} />
          <Route path="seatorder" element={<SeatOrder />} />
          <Route path="Addshows" element={<Navigate to="../addshows" replace />} />
          <Route path="listshows" element={<ListShows />} />
          <Route path="Listshows" element={<Navigate to="../listshows" replace />} />
          <Route path="listbookings" element={<ListBookings />} />
          <Route path="Listbookings" element={<Navigate to="../listbookings" replace />} />
        </Route>

        {/* Redirect root page or any other unknown page to the admin dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </>
  )
}

export default AppAdmin
