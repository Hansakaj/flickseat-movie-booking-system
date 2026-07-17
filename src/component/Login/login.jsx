import React, { useEffect, useRef, useState } from 'react'
import { SignIn, useClerk, useUser } from '@clerk/react'
import { Link } from 'react-router-dom'
import './login.css'

const Login = ({ hasClerkAuth = false }) => {
  if (!hasClerkAuth) {
    return (
      <button
        type='button'
        onClick={() => alert('Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file to enable login.')}
        className='login-button'
      >
        Login
      </button>
    )
  }

  return <ClerkLoginControls />
}

const ClerkLoginControls = () => {
  const { signOut } = useClerk()
  const { isSignedIn, user } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', closeMenu)
    return () => document.removeEventListener('mousedown', closeMenu)
  }, [])

  if (isSignedIn) {
    const displayName = user?.firstName || user?.username || 'Account'
    const email = user?.primaryEmailAddress?.emailAddress || 'Signed in'

    return (
      <div ref={menuRef} className='login-account'>
        <button
          type='button'
          onClick={() => setIsMenuOpen((current) => !current)}
          className='login-profile-button'
        >
          <img src={user?.imageUrl} alt='' className='login-avatar' />
          <span className='login-profile-name'>{displayName}</span>
        </button>

        {isMenuOpen ? (
          <div className='login-dropdown'>
            <div className='login-dropdown-header'>
              <img src={user?.imageUrl} alt='' className='login-dropdown-avatar' />
              <div>
                <p className='login-dropdown-name'>{displayName}</p>
                <p className='login-dropdown-email'>{email}</p>
              </div>
            </div>

            <Link
              to='/mybooking'
              onClick={() => setIsMenuOpen(false)}
              className='login-dropdown-link'
            >
              My Bookings
            </Link>

            <button
              type='button'
              onClick={() => signOut()}
              className='login-dropdown-logout'
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <>
      <button
        type='button'
        onClick={() => setIsLoginOpen(true)}
        className='login-button'
      >
        Login
      </button>
      {isLoginOpen ? <LoginModal onClose={() => setIsLoginOpen(false)} /> : null}
    </>
  )
}

const LoginModal = ({ onClose }) => {
  return (
    <div className='login-modal-backdrop'>
      <div className='login-modal'>
        <button type='button' onClick={onClose} className='login-modal-close'>
          x
        </button>

        <div className='login-modal-brand'>
          <p className='login-modal-eyebrow'>Movie Tickets</p>
          <h2>Welcome back</h2>
          <p>
            Login to book seats, manage your tickets, and complete secure online payments.
          </p>
          <div className='login-modal-points'>
            <span>Fast booking</span>
            <span>Secure payment</span>
            <span>Saved tickets</span>
          </div>
        </div>

        <div className='login-modal-form'>
          <SignIn
            routing='hash'
            appearance={{
              elements: {
                rootBox: 'login-clerk-root',
                cardBox: 'login-clerk-card-box',
                card: 'login-clerk-card',
                headerTitle: 'login-clerk-title',
                headerSubtitle: 'login-clerk-subtitle',
                socialButtonsBlockButton: 'login-clerk-social',
                formFieldInput: 'login-clerk-input',
                formButtonPrimary: 'login-clerk-primary',
                footerActionLink: 'login-clerk-link',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Login
