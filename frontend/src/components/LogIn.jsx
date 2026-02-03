import React, { useEffect, useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../redux/slices/authApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import CircularProgress from '@mui/material/CircularProgress';

const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success(`Welcome ${res.name} `);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-sm border border-black p-8">
        <h2 className="text-2xl font-semibold text-black">
          Welcome Back
        </h2>

        <p className="text-sm text-gray-600 mt-1 mb-6">
          Log in to access the system
        </p>

        <form className="space-y-4" onSubmit={submitHandler}>


          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              name='email'
              required
              onChange={(e) => { setEmail(e.target.value) }}
              placeholder="you@example.com"
              className="w-full border border-black px-3 py-2 outline-none focus:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className='border flex border-black items-center px-2'>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name='password'
                required
                onChange={(e) => { setPassword(e.target.value) }}
                value={password}
                className="w-full  px-2 py-2 outline-none focus:bg-gray-100"
              />
              {showPassword ? <EyeClosed size={20} onClick={() => {
                setShowPassword(false)
              }} /> : <Eye size={20} onClick={() => {
                setShowPassword(true)
              }} />}
            </div>

          </div>

          {isLoading ?
            <div className='flex w-full justify-center py-2 mt-2 transition bg-primary border rounded'>
              <CircularProgress size={20} color='inherit' className='text-white' />
            </div> :
            <button type='submit' className="w-full rounded bg-black text-white py-2 mt-2 hover:bg-gray-900 transition">
              Login
            </button>

          }

          <p className="text-sm text-center mt-4">
            New Here?{" "}
            <Link to={'/'} className="font-semibold hover:underline hover:text-blue-500 cursor-pointer">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LogIn