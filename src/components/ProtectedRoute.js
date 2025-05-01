// components/ProtectedRoute.js
"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const navigation = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigation.push("/");
    } else {
      setIsLoading(false); // Mark as loaded if authenticated
    }
  }, [navigation]);

  if (isLoading) {
    return null; // Or replace with a loading spinner
  }

  return children;
};

export default ProtectedRoute;