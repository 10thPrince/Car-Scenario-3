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

      {userInfo ? (
        <Link to={'/dashboard'} className='btn btn-outline mt-4'>
          Go back Bro! <ArrowRight />
        </Link>
      ) : (
        <Link to={'/login'} className='btn btn-outline mt-4'>
          Please Log In <ArrowRight />
        </Link>
      )}
    </div>
    </>
  )
}

export default NotFound
