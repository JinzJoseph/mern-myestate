import axios from 'axios';
import React, { useState } from 'react'
import {useDispatch, useSelector} from "react-redux"

import {signInFailure,signInSuccess ,signInStart} from "../../redux/user/userSlice"
import { Link ,useNavigate} from "react-router-dom";
import OAuth from '../Components/OAuth';
const Signin = () => {
 
const { loading,error}=useSelector(state=>state.user)
  const [email,SetEmail]=useState("")
  const[password,SetPassword]=useState("")
  const navigate=useNavigate()
const dispatch=useDispatch()
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // SetLoading(true);
    dispatch(signInStart());
    try {
      const data = await axios.post(
        "/api/auth/signin",
        {
        email,password
        }, // Corrected variable name
        {
          headers: {
            "Content-Type": "application/json", // Corrected header name
          },
        }
      );
      
      if (data.succes == false) {
        dispatch(signInFailure(data.message))
    
        return;
      }
  
     dispatch(signInSuccess(data.data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };

  return (
    <>
    
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign in</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
       
        <input
          onChange={(e)=>{SetEmail(e.target.value)}}
          className="border p-3 rounded-lg"
          id="email"
          type="email"

          placeholder="email"
        />
        <input
           onChange={(e)=>{SetPassword(e.target.value)}}
          className="border p-3 rounded-lg"
          id="password"
          type="password"
          placeholder="password"
        />
        <button disabled ={loading} className="bg-slate-700 text-white p-3 rounded-;g uppercase hover:opacity-95 disabled:opacity-80">
          {
            loading  ? 'Loading....' :"signin"
          }
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5 ">
        <p>Dont an account?</p>
        <Link to="/signup">
          <span className="text-blue-700">sign up</span>
        </Link>
      </div>
     
    </div>
    
    </>
  )
}

export default Signin
