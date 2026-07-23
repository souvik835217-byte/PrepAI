import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";


const Login = () => {

  const navigate = useNavigate();


  const handleGoogleLogin = async () => {

    try {

      await signInWithPopup(auth, googleProvider);

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

    }

  };


  return (

    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white p-6">


      <motion.div

        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.5 }}

        className="bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center border border-gray-800"

      >


        {/* Logo */}

        <div className="flex justify-center mb-6">

          <div className="bg-purple-600 p-5 rounded-full">

            <FaRobot className="text-4xl"/>

          </div>

        </div>



        <h1 className="text-4xl font-bold mb-3">

          PrepAI 🚀

        </h1>



        <p className="text-gray-400 mb-8">

          AI powered interview preparation platform

        </p>



        {/* Google Login Button */}

        <button

          onClick={handleGoogleLogin}

          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition duration-300"

        >

          <img

            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"

            alt="Google"

            className="w-6 h-6"

          />


          Continue with Google


        </button>



        <p className="text-gray-500 text-sm mt-6">

          Resume Analysis • AI Interview • Performance Report

        </p>



      </motion.div>


    </div>

  );

};


export default Login;
