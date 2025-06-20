import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

const Home = () => {
  const {userData,serverUrl}=useContext(UserDataContext)
  const handleLogout =async ()=>{
    try {
      const res=axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <div className='min-h-screen w-full bg-gradient-to-t from-black to-[#0400bc] overflow-y-auto flex justify-center items-center py-10 px-4 flex-col relative'>
        <button className='bg-white rounded-full mb-4 px-4 py-2 absolute right-5 top-10' 
        onClick={handleLogout}>Log Out</button>
        <button className='bg-white rounded-full mb-4 px-4 py-2 absolute right-5 top-25'>Customize your Assistant</button>
       {userData?.assistantImage &&  <img src={userData.assistantImage} alt="" className='w-[300px] h-[400px] rounded-2xl shadow-xl shadow-blue-600'/>}
       <h1 className='text-white mt-6 text-2xl'>I'm {userData?.assistantName}</h1>
      </div>
    </div>
  )
}

export default Home