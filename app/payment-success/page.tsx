"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>
        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          ${amount}
        </div>
      </div>
      
      <Button 
        onClick={handleContinue}
        disabled={isLoading}
        className="mt-6 bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg text-lg"
      >
        {isLoading ? "Processing..." : "Continue to Premium Dashboard"}
      </Button>
    </main>
  );
}