import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const NotFound = () => {
  const {userInfo} = useSelector((state) => state.auth);
  return (

    <>
    {userInfo ? <Navbar /> : <></>}
    
    <div className='flex flex-col items-center min-h-screen justify-center'>
      <h1 className='text-4xl font-black'>404!</h1>
       
      <p className='text-2xl font-semibold'> Page Not Found</p>

      <button className='py-1 px-3 border border-black rounded mt-4 hover:cursor-pointer hover:bg-black hover:text-white'>
        {userInfo ? <Link to={'/dashboard'} className='flex gap-1'>Go back Bro! <ArrowRight /></Link> : <Link to={'/login'} className='flex gap-1'>Please Log In<ArrowRight /></Link>}
      </button>
    </div>
    </>
  )
}

export default NotFound