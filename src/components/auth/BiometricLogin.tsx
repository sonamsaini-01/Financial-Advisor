import React, { useState, useEffect } from "react";
import { Fingerprint, ShieldCheck, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BiometricLogin({ onAuthenticate }: { onAuthenticate: () => void }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAuthenticate = () => {
    setIsAuthenticating(true);
    // Simulate biometric check
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsSuccess(true);
      setTimeout(() => {
        onAuthenticate();
      }, 800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
      
      <div className="relative space-y-8 max-w-xs w-full">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xl">
            <Lock className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Authenticate to access your financial vault</p>
        </div>

        <div className="py-12 flex flex-col items-center justify-center">
          <button 
            onClick={handleAuthenticate}
            disabled={isAuthenticating || isSuccess}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
              isSuccess ? "bg-primary scale-110" : 
              isAuthenticating ? "bg-primary/20" : "bg-primary/10 hover:bg-primary/20"
            }`}
          >
            {isSuccess ? (
              <ShieldCheck className="w-12 h-12 text-white animate-in zoom-in duration-300" />
            ) : (
              <Fingerprint className={`w-12 h-12 text-primary ${isAuthenticating ? "animate-pulse" : ""}`} />
            )}
            
            {isAuthenticating && (
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </button>
          <p className="mt-6 text-xs font-medium text-primary uppercase tracking-widest animate-pulse">
            {isSuccess ? "Access Granted" : isAuthenticating ? "Scanning..." : "Tap to scan"}
          </p>
        </div>

        <div className="pt-8">
          <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1.5 uppercase tracking-widest font-bold">
            <Smartphone className="w-3 h-3" />
            Secure Biometric Vault
          </p>
        </div>
      </div>
    </div>
  );
}
