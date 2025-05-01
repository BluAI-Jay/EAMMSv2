// components/AdminProtectedRoute.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminProtectedRoute = ({ children }) => {
  const navigation = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const tokenA = localStorage.getItem("tokenA");
    if (!tokenA) {
        navigation.push("/admin-login"); // redirect to admin login if no tokenA
    } else {
        setIsLoading(false); // Mark as loaded if authenticated
      }
  }, [navigation]);

  if (isLoading) {
    return null; // Or replace with a loading spinner
  }

  return children;
};

export default AdminProtectedRoute;
