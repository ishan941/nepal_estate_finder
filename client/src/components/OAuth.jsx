import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handelGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        dispatch(signInFailure("failed"));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.error("Could not sign in with Google:", error);
      dispatch(signInFailure("Google sign-in failed"));
    }
  };
  return (
    <button
      onClick={handelGoogleClick}
      type="button"
      className="bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-yellow-500 hover:to-red-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
    >
      Continue with Google
    </button>
  );
}
