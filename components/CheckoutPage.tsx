"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    if (!stripe || !elements) {
      console.log("Stripe or elements not loaded");
      return;
    }
    
    console.log("Submitting payment form...");
    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.error("Submit error:", submitError);
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
    
    console.log("Confirming payment with client secret:", clientSecret.substring(0, 10) + "...");
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `http://localhost:3000/payment-success?amount=${amount}`,
        },
        redirect: "if_required", // Add this to see if Stripe is attempting to redirect
      });
      
      if (error) {
        console.error("Payment confirmation error:", error);
        setErrorMessage(error.message);
      } else if (paymentIntent) {
        console.log("Payment intent:", paymentIntent.status);
        if (paymentIntent.status === "succeeded") {
          // If redirect doesn't happen automatically, do it manually
          window.location.href = `/payment-success?amount=${amount}`;
        }
      }
    } catch (e) {
      console.error("Exception during payment confirmation:", e);
      setErrorMessage("An unexpected error occurred");
    }
    
    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}

      {errorMessage && <div>{errorMessage}</div>}

      <button
        disabled={!stripe || loading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay $${amount} USD` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;