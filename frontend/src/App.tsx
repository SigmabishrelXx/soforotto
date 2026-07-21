import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Landing } from './pages/Landing'
import { Wall } from './pages/Wall'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { Weather } from './pages/Weather'
import { BuiltWith } from './pages/BuiltWith'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'
import { NotFound } from './pages/NotFound'

// The floating nav follows every public page; admin screens keep the space.
function Chrome() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return null
  return <Navbar />
}

function App() {
  return (
    <BrowserRouter>
      <Chrome />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/wall" element={<Wall />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/built-with" element={<BuiltWith />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
