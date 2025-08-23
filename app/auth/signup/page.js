"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (!res.error) {
      router.push("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md bg-purple-700 shadow-lg rounded-xl p-8">
        <h1 className="text-2xl text-amber-300 font-semibold text-center mb-6">
          Login Existing User
        </h1>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border text-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="E-mail"
            className="w-full px-4 py-2 border rounded-lg text-amber-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* Password field with show/hide toggle */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg text-amber-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        {/* Google login */}
        <div className="mt-6">
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 border rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <FcGoogle size={24} />
            <span className="font-medium">Sign Up/Login with Google</span>
          </button>
        </div>

        {/* Signup link */}
        <p className="text-center text-sm mt-6">
          New User??{" "}
          <span
            className="text-amber-300 hover:underline cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}
