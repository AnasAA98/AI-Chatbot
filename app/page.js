// app/page.js (New Landing Page)
"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      <h1>Welcome to the Chatbot</h1>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
