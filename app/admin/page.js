'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"
// import Link from "next/link"

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [user1, setuser1] = useState("SignIn")
  const router = useRouter();


  // console.log("Session Data:",session);

  useEffect(() => {
    if (status === 'loading') return;
    if (session?.user?.name) {
      setuser1(session.user.name);
    }
    if (!session) {
      
      router.push('/Profile'); // Redirect to login if no session
    } else if (session.user.role !== 'admin') {
      // console.log("User is not an admin")
      router.push('/Profile'); // Redirect non-admin users to their dashboard
    }
  }, [session, status]);

  if (status === 'loading') return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-black">Admin </h1>
      <p>Welcome, {user1}</p>
      
    </div>
  );
}