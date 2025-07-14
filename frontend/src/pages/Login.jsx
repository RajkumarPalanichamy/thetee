import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name,setName] = useState('')
  const [password,setPasword] = useState('')
  const [email,setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false);

   
    // Scroll to top when component mounts
    useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, []);

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        if (currentState === 'Sign Up') {
          
          const response = await axios.post(backendUrl + '/api/user/register',{name,email,password})
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token',response.data.token)
            toast.success('Account created successfully!')
            navigate('/')
          } else {
            toast.error(response.data.message)
          }

        } else {

          const response = await axios.post(backendUrl + '/api/user/login', {email,password})
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token',response.data.token)
            toast.success('Logged in successfully!')
            navigate('/')
          } else {
            toast.error(response.data.message)
          }

        }


      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
  }

  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token, navigate])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-28 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className=' text-3xl'>{currentState}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {currentState === 'Login' ? '' : <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required/>}
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
        <div style={{position: 'relative', width: '100%'}}>
          <input 
            onChange={(e)=>setPasword(e.target.value)} 
            value={password} 
            type={showPassword ? 'text' : 'password'} 
            className='w-full px-3 py-2 border border-gray-800 pr-10' 
            placeholder='Password' 
            required
          />
          <span 
            onClick={() => setShowPassword((prev) => !prev)}
            style={{position: 'absolute', right: '2.5rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '1.3rem'}}
            tabIndex={0}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
           
            {
              currentState === 'Login' 
              ? <p onClick={()=>setCurrentState('Sign Up')} className=' hover:text-gray-700 text-black cursor-pointer'>Create account</p>
              : <p onClick={()=>setCurrentState('Login')} className='hover:text-gray-700 text-black cursor-pointer'>Login Here</p>
            }
        </div>
        <button className='bg-black text-white hover:bg-gray-800 font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login
