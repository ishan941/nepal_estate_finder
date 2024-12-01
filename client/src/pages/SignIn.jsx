import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(null); 

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        setError(`Error: ${res.status} ${res.statusText}`);
        setLoading(false); // Set loading to false after the request is finished
        return;
      }

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      }
      navigate("/");

      // If successful, clear the loading state
      setLoading(false);
    } catch (error) {
      setLoading(false); 
      console.error("Request failed:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-6 max-w-md w-full shadow-lg rounded-lg bg-white">
        <h1 className="text-2xl text-center font-bold mb-6">Sign In</h1>

        {/* Show error message if exists */}

        <form onSubmit={handelSubmit} className="flex flex-col gap-4">
         

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="email"
            onChange={handelChange}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="password"
            onChange={handelChange}
          />

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg font-semibold uppercase hover:bg-blue-700 transition-all"
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
        </form>

        {/* Sign In Redirect */}
        <div className="flex justify-center gap-2 mt-4 text-sm">
          <p>Don't have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-600 hover:underline">Sign In</span>
          </Link>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      </div>
    </div>
  );
};

export default SignIn;
