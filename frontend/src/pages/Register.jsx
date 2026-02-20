import { Eye, EyeClosed } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../redux/slices/authApiSlice';
import { toast } from 'react-toastify';
import { setCredentials } from '../redux/slices/authSlice';
import CircularProgress from '@mui/material/CircularProgress';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);
    const [register, { isLoading }] = useRegisterMutation();

    useEffect(() => {
        if (userInfo) {
            navigate('/dashboard', {replace: true});
        }
    }, [navigate, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPass) {
            toast.error('Password Do no match!');
            return
        } else {
            try {
                const res = await register({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));

                toast.success('Profile Created Successful!')
                navigate('/dashboard');
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }

    return (
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
            <div className="w-full max-w-sm border-2 border-yellow-500 bg-white p-8 shadow-lg shadow-yellow-200/70">
                <h2 className="text-2xl font-semibold text-black">
                    Create Account
                </h2>

                <p className="text-sm text-gray-700 mt-1 mb-6">
                    Register to access the system
                </p>

                <form className="space-y-4" onSubmit={submitHandler}>
                    <div>
                        <label className="block text-sm mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            name='name'
                            onChange={(e) => { setName(e.target.value) }}
                            placeholder="John Doe"
                            className="w-full border border-black px-3 py-2 outline-none focus:bg-yellow-50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            name='email'
                            required
                            onChange={(e) => { setEmail(e.target.value) }}
                            placeholder="you@example.com"
                            className="w-full border border-black px-3 py-2 outline-none focus:bg-yellow-50"
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
                                className="w-full  px-2 py-2 outline-none focus:bg-yellow-50"
                            />
                            {showPassword ? <EyeClosed size={20} onClick={() => {
                                setShowPassword(false)
                            }} /> : <Eye size={20} onClick={() => {
                                setShowPassword(true)
                            }} />}
                        </div>

                    </div>

                    <div>
                        <label className="block text-sm mb-1">Confirm Password</label>
                        <div className='flex border border-black items-center px-2'>
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                value={confirmPass}
                                name='confirmPass'
                                required
                                onChange={(e) => { setConfirmPass(e.target.value) }}
                                placeholder="••••••••"
                                className="w-full px-2 py-2 outline-none focus:bg-yellow-50"
                            />
                            {showConfirmPass ? <EyeClosed size={20} onClick={() => {
                                setShowConfirmPass(false)
                            }} /> : <Eye size={20} onClick={() => {
                                setShowConfirmPass(true)
                            }} />}
                        </div>

                    </div>

                    {isLoading ?
                        <CircularProgress /> :
                        <button className="btn btn-primary btn-full mt-2">
                            Register
                        </button>
                    }


                    <p className="text-sm text-center mt-4">
                        Already have an account?{" "}
                        <Link to={'/login'} className="font-semibold hover:underline hover:text-yellow-700 cursor-pointer">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register
