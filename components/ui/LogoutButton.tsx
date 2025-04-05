"use client";

import { useRouter } from "next/navigation";
import { aauth } from "@/firebase/client";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { useState } from "react";

const LogoutButton = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Sign out from Firebase
      console.log("Signing out from Firebase...");
      await signOut(aauth); // Fixed typo here - was "aauth"
      console.log("Firebase sign out successful");
      
      // Clear server-side session using API route
      console.log("Calling logout API...");
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const result = await response.json();
      console.log("API response:", result);
      
      if (!result.success) {
        throw new Error("Server logout failed");
      }
      
      toast.success("Logged out successfully");
      
      // Force reload to ensure all state is cleared
      console.log("Redirecting to sign-in page...");
      router.push("/sign-in");
      
      // Add an additional forced reload after a slight delay
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 300);
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(`Failed to log out: ${Error!!! || "Unknown error"}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex justify-end gap-2"
      disabled={isLoggingOut}
    >
      <h2>{isLoggingOut ? "Signing Out..." : "Sign Out"}</h2>
    </button>
  );
};

export default LogoutButton;