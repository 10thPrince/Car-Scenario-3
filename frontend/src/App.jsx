import { Route, Routes } from 'react-router-dom'
import LogIn from './components/LogIn'
import NotFound from './components/NotFound'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './components/Dashboard'
import Register from './components/Register'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  

  return (
    <>
      <Routes>
        <Route index element={<Register />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='' element={<PrivateRoute />} >
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
        <ToastContainer position='top-right'  autoClose={3000}/>
    </>
  )
}

export default App
