'use client'
 import { useRouter } from "next/router"

 export default function LandingPage() {
    const router = useRouter();
    
    const handleLogin = () => {
        router.push('/login')
    }
    const handleRegister = () => {
        router.push('/register')
    }



 return(
    <div>
        <h1>Welcome to the Landing Page</h1>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
    </div>
 )

}