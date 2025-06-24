import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import ResultPage from './components/ResultPage'
import AdminPage from './components/AdminPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<HomePage />} />
          <Route path="/result/:rollNumber" element={<ResultPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


