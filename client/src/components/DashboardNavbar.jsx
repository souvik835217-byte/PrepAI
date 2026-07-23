import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";


const DashboardNavbar = () => {

const navigate = useNavigate();


const handleLogout = async()=>{

await signOut(auth);

navigate("/login");

}


return (

<nav className="flex justify-between items-center px-8 py-4 bg-gray-950 text-white border-b border-gray-800">


<h1 
className="text-2xl font-bold cursor-pointer"
onClick={()=>navigate("/dashboard")}
>
AI Interview 🚀
</h1>



<div className="flex items-center gap-6">

<button
onClick={()=>navigate("/dashboard")}
className="text-gray-300 hover:text-white"
>
Dashboard
</button>


<button
onClick={handleLogout}
className="bg-red-600 px-4 py-2 rounded-lg"
>
Logout
</button>

</div>


</nav>

)

}

export default DashboardNavbar;
