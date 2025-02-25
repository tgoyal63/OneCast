import React, { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function isUserExists(email) {
    try {
      const response = await axios.get(`http://localhost:5000/user/${email}`);
      return response.data.success;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      const userExists = await isUserExists(emailRef.current.value);
      if (userExists) {
        await signup(emailRef.current.value, passwordRef.current.value);
        navigate('/dashboard');
      } else {
        setError("You aren't authorized to create an account!");
      }
    } catch {
      setError('Failed to create an account');
    }
    setLoading(false);
  }

  return (
    <div className='centered'>
      <div className='border p-8' style={{ width: '300px' }}>
        {error && (
          <div
            className='bg-red-500 signUp-font text-white p-2 text-sm flex justify-center mb-4 rounded-sm'
            style={{ textAlign: 'center' }}
          >
            {error}
          </div>
        )}
        <form className='max-w-sm' onSubmit={handleSubmit}>
          <div className='mb-4' id='email'>
            <label
              className='block text-gray-600 text-sm font-bold mb-2 signUp-font'
              htmlFor='password'
            >
              Email
            </label>
            <input
              className='appearance-none border border-rounded h-12 w-full py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline signUp-font'
              type='email'
              required
              ref={emailRef}
              placeholder='email'
            />
          </div>
          <div className='mb-4' id='password'>
            <label
              className='block text-gray-600 text-sm font-bold mb-2 signUp-font'
              htmlFor='password'
            >
              Password
            </label>
            <input
              className='appearance-none border border-rounded w-full h-12 py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline'
              type='password'
              ref={passwordRef}
              placeholder='*************'
            />
          </div>
          <div className='mb-4' id='password-confirm'>
            <label
              className='block text-gray-600 text-sm font-bold mb-2 signUp-font'
              htmlFor='password'
            >
              Password Confirmation
            </label>
            <input
              className='appearance-none border border-rounded w-full h-12 py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline'
              type='password'
              ref={passwordConfirmRef}
              placeholder='*************'
            />
          </div>
          <div className='flex items-center justify-between'>
            <button
              disabled={loading}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold w-full h-12 py-2 px-4  rounded focus:outline-none focus:shadow-outline signUp-font'
              type='submit'
            >
              Sign Up
            </button>
          </div>
        </form>
        <div
          className='flex justify-center mt-4 text-gray-800 signUp-font'
          style={{ fontSize: '13px' }}
        >
          Already have an account?{' '}
          <Link
            className='font-bold text-blue-500 hover:text-blue-800'
            to='/login'
          >
            &nbsp;Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
