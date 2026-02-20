import { Route, Routes } from 'react-router-dom'
import LogIn from './pages/LogIn'
import NotFound from './pages/NotFound'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './components/Dashboard'
import Register from './pages/Register'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Car from './pages/Car'
import Service from './pages/Service'
import ServiceDetails from './pages/ServiceDetails'
import InvoicePrint from './pages/InvoicePrint'
import Package from './pages/Package'

function App() {
  

  return (
    <>
      <Routes>
        <Route index element={<Register />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='' element={<PrivateRoute />} >
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='car' element={<Car />} />
          <Route path='packages' element={<Package />} />
          <Route path='services' element={<Service />} />
          <Route path='services/:id' element={<ServiceDetails />} />
          <Route path='invoice/:id' element={<InvoicePrint />} />
        </Route>
      </Routes>
        <ToastContainer position='top-right'  autoClose={3000}/>
    </>
  )
}

export default App
