"use client"
import CheckoutPage from "@/components/CheckoutPage";
import FuturisticBackground from "@/components/FuturisticBackground";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function Home() {
  const amount = 9.99;
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16">
      <FuturisticBackground />
      
      {/* Main container with pulsing border effect and prominent outline */}
      <div className="relative max-w-3xl w-full mx-auto z-10">
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
          <div className="absolute bottom-40 left-10 w-24 h-24 rounded-full bg-purple-600/10 blur-2xl"></div>
          
          {/* Content area */}
          <div className="relative p-10 z-20">
            {/* Header section with futuristic elements */}
            <div className="text-center mb-12 relative">
              {/* Tech circles decoration */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2 opacity-70">
                <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <div className="w-1 h-1 rounded-full bg-blue-400"></div>
              </div>
              
              {/* Premium label */}
              <div className="inline-block mx-auto mb-3 px-4 py-1 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-full border border-white/10">
                <span className="text-xs font-medium tracking-widest text-blue-300 uppercase">Premium Access</span>
              </div>
              
              {/* Main title with animated gradient */}
              <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 animate-text-gradient">
                Voxa Premium
              </h1>
              {/* Decorative line */}
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto my-6 mb-4"></div>
              
              {/* Description with subtle glow */}
              <h2 className="text-3xl font-light text-white/90 mb-2">
                Get unlimited interviews for a one-time purchase!
              </h2>
              
              <p className="text-white/70 text-lg max-w-xl mx-auto">
                Ace your interviews with constructive generative AI feedback in real-time.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 mt-8">
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mb-2"></div>
                  <p className="text-blue-300 font-medium text-sm">Advanced Simulations</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mb-2"></div>
                  <p className="text-purple-300 font-medium text-sm">Personalized Feedback</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mb-2"></div>
                  <p className="text-indigo-300 font-medium text-sm">Career Insights</p>
                </div>
              </div>
            </div>
            
            {/* Checkout component in futuristic frame */}
            <div className="relative max-w-md mx-auto">
              {/* Futuristic container for Stripe */}
              <div className="relative">
                {/* Background glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl blur-md"></div>
                
                {/* Stripe container */}
                <div className="relative bg-black/50 p-6 rounded-xl border border-white/20">
                  {/* Corner accent lines */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-purple-400 rounded-br-lg"></div>
                  
                  {/* Tech dots */}
                  <div className="absolute top-3 right-3 flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                    <div className="w-1 h-1 rounded-full bg-purple-400"></div>
                  </div>
                  
                  <Elements
                    stripe={stripePromise}
                    options={{
                      mode: "payment",
                      amount: convertToSubcurrency(amount),
                      currency: "usd",
                    }}
                  >
                    <CheckoutPage amount={amount} />
                  </Elements>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add animation keyframes for gradient slide effect */}
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