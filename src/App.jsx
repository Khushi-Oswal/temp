import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import PatientDetail from './pages/PatientDetail'
import AnalyzeResults from './pages/AnalyzeResults'
import PatientInput from './pages/PatientInput'
import { MobileBottomNav } from './components/Layout'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient/:id" element={<PatientDetail />} />
        <Route path="/analyze/:id" element={<AnalyzeResults />} />
        <Route path="/input" element={<PatientInput />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Mobile bottom nav: visible only on screens < 768px via CSS */}
      <MobileBottomNav />
    </BrowserRouter>
  )
}

export default App
