import Login from './components/Login'
import { BrowserRouter as Router } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute'
import CssBaseline from '@mui/material/CssBaseline'
import Paperbase from './components/Paperbase'
import { UserProvider } from './components/UserContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: 'light', // Enable dark mode
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  shape: {
    borderRadius: 20,
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={
              <PrivateRoute>
                <Paperbase />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App