import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-6 max-w-md w-full shadow-lg rounded-lg bg-white">
        <h1 className="text-2xl text-center font-bold mb-6">Sign Up</h1>
        <form className="flex flex-col gap-4">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Sign Up Button */}
          <button className="bg-blue-600 text-white p-3 rounded-lg font-semibold uppercase hover:bg-blue-700 transition-all">
            Sign Up
          </button>
        </form>

        {/* Sign In Redirect */}
        <div className="flex justify-center gap-2 mt-4 text-sm">
          <p>Already have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-600 hover:underline">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
