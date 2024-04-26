import axios from 'axios';
import React, { useState } from 'react'

import { Link ,useNavigate} from "react-router-dom";
const Signin = () => {
  const [fromData, SetFormData] = useState({});
  const [error, SetError] = useState("");
  const [loading, SetLoading] = useState(false);
  const [email,SetEmail]=useState("")
  const[password,SetPassword]=useState("")
  const navigate=useNavigate()
  // const handleChange = (e) => {
  //   SetFormData({
  //     ...fromData,
  //     [e.target.id]: e.target.value,
  //   });
  // };
  console.log(fromData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    SetLoading(true);
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
        SetLoading(false);
        SetError(data.message);
        return;
      }
      SetLoading(false);
      console.log(data);
      SetError(null)
      navigate('/')
    } catch (error) {
      SetLoading(false);
      SetError(error.message);
      console.log(error);
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
      </form>
      <div className="flex gap-2 mt-5 ">
        <p>Dont an account?</p>
        <Link to="/signup">
          <span className="text-blue-700">sign up</span>
        </Link>
      </div>
      {
        error && <p className="text-red-500 mt-5">{error}</p>
      }
    </div>
    
    </>
  )
}

export default Signin
