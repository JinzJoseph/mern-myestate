import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../Firebase/Firebase";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux"
import {signInSuccess } from "../../redux/user/userSlice"
import {  useNavigate} from "react-router-dom";
const OAuth = () => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    //const { loading,error}=useSelector(state=>state.user)
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await axios.post(
        "/api/auth/google",
        {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        },
        {
          headers: {
            "Content-Type": "application/json", // Corrected header name
          },
        }
      );
      
      dispatch(signInSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type=" submit
    "
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-80"
    >
      Countine With Google
    </button>
  );
};

export default OAuth;
