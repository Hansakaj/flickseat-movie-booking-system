import { NavLink, useLocation } from 'react-router-dom'
import {
  Monitor,
  ShoppingBag,
  LayoutDashboard,
  PlusCircle,
  Clapperboard,
  BookOpenCheck,
} from 'lucide-react'

const navLinks = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Admin Console', path: '/admin/console', icon: Monitor },
  { name: 'Add Shows', path: '/admin/addshows', icon: PlusCircle },
  { name: 'List Shows', path: '/admin/listshows', icon: Clapperboard },
  { name: 'List Bookings', path: '/admin/listbookings', icon: BookOpenCheck },
  { name: 'Seat Orders', path: '/admin/seatorder', icon: ShoppingBag },
]

const Adminsidebar = () => {
  const { pathname } = useLocation()

  const isActive = (path) =>
    pathname === path || pathname.startsWith(`${path}/`) || (path === '/admin/dashboard' && pathname === '/admin')

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: '58px',
      background: '#000000',
      borderRight: '1px solid rgba(255,255,255,.12)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0 18px',
      zIndex: 200,
      gap: '3px',
    }}>
      {/* Logo */}
      <NavLink to="/admin/console" style={{
        width: '32px',
        height: '32px',
        border: '1px solid #e63b60',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '22px',
        flexShrink: 0,
        cursor: 'pointer',
        textDecoration: 'none',
      }}>
        <span style={{
          position: 'absolute',
          inset: '3px',
          border: '1px solid rgba(230,59,96,.2)',
        }} />
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '14px',
          color: '#e63b60',
          letterSpacing: '.5px',
        }}>F</span>
      </NavLink>

      {/* Divider */}
      <div style={{ width: '22px', height: '1px', background: 'rgba(255,255,255,.1)', margin: '6px 0' }} />

      {/* Nav Items */}
      {navLinks.map((link) => {
        const active = isActive(link.path)
        const Icon = link.icon
        return (
          <NavLink
            key={link.path}
            to={link.path}
            title={link.name}
            style={{
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              cursor: 'pointer',
              color: active ? '#e63b60' : '#606880',
              background: active ? 'rgba(230,59,96,.08)' : 'transparent',
              position: 'relative',
              margin: '1px 0',
              fontSize: '17px',
              textDecoration: 'none',
              transition: 'all .18s',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.color = '#a0a8bc'
                e.currentTarget.style.background = '#1c2637'
              }
              const tooltip = e.currentTarget.querySelector('.sb-tooltip')
              if (tooltip) tooltip.style.opacity = '1'
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.color = '#606880'
                e.currentTarget.style.background = 'transparent'
              }
              const tooltip = e.currentTarget.querySelector('.sb-tooltip')
              if (tooltip) tooltip.style.opacity = '0'
            }}
          >
            {/* Active left indicator */}
            {active && (
              <span style={{
                position: 'absolute',
                left: '-1px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '2px',
                height: '20px',
                background: '#e63b60',
                borderRadius: '0 2px 2px 0',
              }} />
            )}
            <Icon size={17} strokeWidth={1.8} />
            {/* Tooltip */}
            <span className="sb-tooltip" style={{
              position: 'absolute',
              left: '50px',
              background: '#243044',
              border: '1px solid rgba(255,255,255,.18)',
              color: '#f4f4f8',
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity .12s',
              zIndex: 300,
            }}>{link.name}</span>
          </NavLink>
        )
      })}
    </aside>
  )
}

export default Adminsidebar
