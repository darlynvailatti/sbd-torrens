import Home from './components/Home'
import Login from './components/Login'
import { BrowserRouter as Router } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute'
import CssBaseline from '@mui/material/CssBaseline'

function App() {


  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute >
                <Home />
              </PrivateRoute>}
          />
          <Route path="/login" element={<Login />} />
        </Routes>

      </Router>
    </>
  )
}

export default App