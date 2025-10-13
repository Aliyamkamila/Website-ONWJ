import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './landingpage/header.jsx'
import Hero from './landingpage/hero.jsx'
import Profile from './landingpage/profile.jsx'
import Berita from './landingpage/berita.jsx'
import Stakeholder from './landingpage/stakeholder.jsx'
import Bisnis from './landingpage/Bisnis.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='relative w-screen min-h-screen overflow-x-hidden'>
      <Header />
      <Hero />
      <main className='relative bg-white'>
        <Profile />
        <Bisnis />
        <Berita />
        <Stakeholder />
      </main>
    </div>
  </StrictMode>,
)
