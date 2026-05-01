import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import ChunksPage from './chunks.jsx'
import CicdPage from './cicd.jsx'
import DevopsPage from './devops.jsx'

function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>IntraNebula Docs</h1>
      <p>Welcome to your documentation site</p>


      <div style={{ marginTop: '30px', color: '#666' }}>
        <h3>Available Pages</h3>
        <ul>
          <li><Link to="/chunks" style={{ color: '#007bff', textDecoration: 'none' }}>JavaScript Chunks</Link></li>
          <li><Link to="/cicd" style={{ color: '#007bff', textDecoration: 'none' }}>CI/CD Pipeline</Link></li>
          <li><Link to="/devops" style={{ color: '#007bff', textDecoration: 'none' }}>DevOps Guide</Link></li>
        </ul>
      </div>
    </div>
  )
}

function App() {
  const location = useLocation()

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#071024',
    borderBottom: '1px solid #152236',
    padding: '10px 24px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }

  const navLinkStyle = (isActive) => ({
    marginRight: '0',
    textDecoration: 'none',
    color: isActive ? '#7dd3fc' : '#cbd5e1',
    fontWeight: isActive ? '700' : '500',
    padding: '8px 14px',
    borderRadius: '999px',
    backgroundColor: isActive ? '#0f172a' : 'transparent'
  })

  const contentStyle = {
    minHeight: '100vh',
    paddingTop: '60px',
    backgroundColor: '#030617'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030617' }}>
      <nav style={navStyle}>
        <Link to="/" style={navLinkStyle(location.pathname === '/')}>Home</Link>
        <Link to="/chunks" style={navLinkStyle(location.pathname === '/chunks')}>Chunks</Link>
        <Link to="/cicd" style={navLinkStyle(location.pathname === '/cicd')}>CI/CD</Link>
        <Link to="/devops" style={navLinkStyle(location.pathname === '/devops')}>DevOps</Link>
      </nav>

      <div style={contentStyle}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chunks" element={<ChunksPage />} />
          <Route path="/cicd" element={<CicdPage />} />
          <Route path="/devops" element={<DevopsPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
