import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  console.log("Current User:", currentUser);

  if (!currentUser) {
    toast.error("You must log in to view this page.", { autoClose: 3000 });
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
