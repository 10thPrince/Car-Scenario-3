import { LogOut, Menu } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../redux/slices/authApiSlice';
import { removeCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';


const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {userInfo} = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation()


  useEffect(() => {
    if(userInfo){
      navigate('/dashboard');
    }
  }, [navigate, userInfo])


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

  <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <span className="text-xl font-semibold">Car Manager</span>
    </div>


    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-6">
        <a
          href="/car"
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition"
        >
          Car
        </a>
        <a
          href="/car"
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition"
        >
          Car
        </a>
    </div>


    {/* Actions */}
    <div className="hidden md:flex">
      <button onClick={handleLogout} className="flex gap-2 text-white px-6 hover:cursor-pointer py-2 rounded items-center font-semibold bg-black">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>


    {/* Mobile */}
    <button onClick={() => setOpen(!open)} className="md:hidden">
      <Menu />
    </button>


    {open && (
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
    )}
  </nav>
)
}

export default Navbar