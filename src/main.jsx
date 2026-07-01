
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import App from './App.jsx'
import './index.css'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const clerkAppearance = {
  variables: {
    colorPrimary: '#F84565',
    colorBackground: '#08080a',
    colorInputBackground: '#111114',
    colorInputText: '#ffffff',
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255,255,255,0.68)',
    borderRadius: '10px',
    fontFamily: 'Outfit, sans-serif',
  },
  elements: {
    modalBackdrop: 'backdrop-blur-sm bg-black/75',
    cardBox: 'bg-[#08080a] border border-white/10 shadow-2xl shadow-black/70',
    card: 'bg-[#08080a]',
    headerTitle: 'text-white',
    headerSubtitle: 'text-white/60',
    socialButtonsBlockButton: 'bg-white/5 border-white/10 text-white hover:bg-white/10',
    formFieldInput: 'bg-[#111114] border-white/10 text-white focus:border-[#F84565]',
    formButtonPrimary: 'bg-[#F84565] hover:bg-[#D63854] text-white',
    footerActionLink: 'text-[#F84565] hover:text-[#ff6d86]',
    dividerLine: 'bg-white/10',
    dividerText: 'text-white/40',
    identityPreviewText: 'text-white',
    formFieldLabel: 'text-white/70',
  },
}

createRoot(document.getElementById('root')).render(
  clerkPublishableKey ? (
    <ClerkProvider publishableKey={clerkPublishableKey} appearance={clerkAppearance}>
      <BrowserRouter>
        <App hasClerkAuth />
      </BrowserRouter>
    </ClerkProvider>
  ) : (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
)
