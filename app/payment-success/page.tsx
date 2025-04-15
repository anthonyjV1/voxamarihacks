"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import FuturisticBackground from "@/components/FuturisticBackground";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      // Call API endpoint to update plan
      const response = await fetch("/api/update-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to update plan");
      }
      // Redirect to homepage
      router.push("/");
    } catch (error) {
      console.error("Error updating plan:", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16">
      <FuturisticBackground />
      
      {/* Main container with pulsing border effect */}
      <div className="relative max-w-xl w-full mx-auto z-10">
        {/* Animated outline border with glow effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-white/30 shadow-[0_0_15px_rgba(167,139,250,0.3)] animate-pulse"></div>
        
        {/* Animated gradient light that slides across container */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className={`absolute -inset-full h-full w-full bg-gradient-to-r from-transparent via-blue-500/20 to-purple-500/20 transform ${isLoaded ? 'animate-gradient-slide' : ''}`}></div>
        </div>
        
        {/* Main content container with glassmorphism */}
        <div className="relative backdrop-blur-xl bg-black/30 rounded-2xl overflow-hidden border border-white/20 shadow-2xl z-10">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
          
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-400/70 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-400/70 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-400/70 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-purple-400/70 rounded-br-lg"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-blue-600/10 blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full bg-purple-600/10 blur-2xl"></div>
          
          {/* Content area */}
          <div className="relative p-10 z-20 text-center">
            
            {/* Success animation */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
              <div className="relative flex items-center justify-center w-full h-full rounded-full bg-black/30 border border-white/20">
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            
            {/* Main title with gradient */}
            <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 animate-text-gradient">
              Thank you!
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-2xl font-light text-white/90 mb-6">
              You successfully sent
            </h2>
            
            {/* Amount display */}
            <div className="relative mx-auto my-8 max-w-sm">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg blur-sm"></div>
              <div className="relative bg-black/40 p-6 rounded-lg border border-white/20">
                {/* Tech dots */}
                <div className="absolute top-3 right-3 flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                  <div className="w-1 h-1 rounded-full bg-purple-400"></div>
                </div>
                <div className="text-5xl font-bold text-white">
                  ${amount}
                </div>
              </div>
            </div>
            
            {/* Decorative line */}
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto my-6"></div>
            
            {/* Button with hover effect */}
            <Button
              onClick={handleContinue}
              disabled={isLoading}
              className="relative mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/0 via-white/20 to-blue-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative">
                {isLoading ? "Processing..." : "Continue to Premium Dashboard"}
              </span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes gradient-slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes text-gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-gradient-slide {
          animation: gradient-slide 5s ease-in-out infinite;
        }
        
        .animate-text-gradient {
          animation: text-gradient 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}