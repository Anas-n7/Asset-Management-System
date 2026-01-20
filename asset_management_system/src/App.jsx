import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Assets from './pages/Assets'
import Inventory from './pages/Inventory'
import Assignments from './pages/Assignments'
import Tickets from './pages/Tickets'
import Layout from './components/Layout'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        <Route element={<Layout setIsAuthenticated={setIsAuthenticated} />}>
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/assets" element={isAuthenticated ? <Assets /> : <Navigate to="/login" replace />} />
          <Route path="/inventory" element={isAuthenticated ? <Inventory /> : <Navigate to="/login" replace />} />
          <Route path="/assignments" element={isAuthenticated ? <Assignments /> : <Navigate to="/login" replace />} />
          <Route path="/tickets" element={isAuthenticated ? <Tickets /> : <Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
