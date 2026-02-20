import { LogOut, Menu } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../redux/slices/authApiSlice';
import { removeCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';


const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [logout] = useLogoutMutation()

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "btn btn-primary text-lg"
      : "btn btn-outline text-lg";




  const handleLogout = async() => {
    try{
      await logout().unwrap();
    }catch(error){
      toast.error(error?.data?.message || error?.message)
    } finally {
      dispatch(removeCredentials());
      localStorage.removeItem('userInfo');
      toast.success('You have been logged Out!!');
      navigate('/login');
    }
  }

return (

  <nav className="w-full border-b-2 border-yellow-400 bg-white shadow-md px-6 py-3 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <span className="text-xl font-semibold">
        Car <span className="text-yellow-600">Manager</span>
      </span>
    </div>


    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-6">
        <NavLink
          to="/dashboard"
          className={navLinkClass}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/car"
          className={navLinkClass}
        >
          Car
        </NavLink>
        <NavLink
          to="/packages"
          className={navLinkClass}
        >
          Packages
        </NavLink>
        <NavLink
          to="/services"
          className={navLinkClass}
        >
          Services
        </NavLink>
        
    </div>


    {/* Actions */}
    <div className="hidden md:flex">
      <button onClick={handleLogout} className="btn btn-primary">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>


    {/* Mobile */}
    <button onClick={() => setOpen(!open)} className="btn btn-icon md:hidden">
      <Menu />
    </button>


    {/* {open && (
      <div className="absolute top-16 left-0 w-full bg-white shadow-lg p-4 flex flex-col gap-4 md:hidden">
        
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium"
          >
            Car
          </a>
        
        <button onClick={() => {handleLogout}}  className="flex gap-2 text-red px-6 hover:cursor-pointer py-3 bg-black">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    )} */}
  </nav>
)
}

export default Navbar
