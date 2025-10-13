import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './header.jsx'
import Hero from './hero.jsx'
import Profile from './profile.jsx'
import Berita from './berita.jsx'
import Stakeholder from './stakeholder.jsx'
import Bisnis from './Bisnis.jsx'


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
