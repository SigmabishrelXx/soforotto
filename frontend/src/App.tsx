import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Wall } from './pages/Wall'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { Weather } from './pages/Weather'
import { BuiltWith } from './pages/BuiltWith'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/wall" element={<Wall />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/built-with" element={<BuiltWith />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
