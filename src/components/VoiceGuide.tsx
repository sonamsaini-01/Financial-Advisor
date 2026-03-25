import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { VolumeX, HelpCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoiceGuideProps {
  context?: string;
}

const PAGE_GUIDES: Record<string, string> = {
  "/": "Welcome to your personal financial advisor. Let's start by getting to know you. Please fill in your age and financial details to get started.",
  "/dashboard": "This is your financial health dashboard. You can see your money health score, monthly surplus, and net worth. Scroll down to see smart alerts and insights personalized for you.",
  "/onboarding": "We're setting up your financial profile. Please provide your income, expenses, and goals so we can give you the best advice.",
  "/chat": "I'm your AI financial assistant. You can ask me anything about taxes, investments, or budgeting. Try one of the quick prompts below to get started.",
  "/fire": "Planning for early retirement? This page helps you calculate when you can reach financial independence based on your savings and goals.",
  "/goals": "Let's track your progress towards your financial goals. You can see how much you've saved and what's left to reach your targets.",
  "/tax": "Optimize your taxes here. We'll help you find ways to save more on taxes based on your current income and investments.",
  "/simulator": "What if you save more? Or invest more? This simulator helps you visualize how different financial decisions affect your future wealth.",
  "/personality": "Discover your money personality. This assessment helps you understand your financial habits and how they impact your wealth building.",
  "/emergency": "Build your financial safety net. We'll help you calculate how much you need for an emergency fund and track your progress.",
  "/settings": "Manage your profile and app preferences here.",
};

const VoiceGuide: React.FC<VoiceGuideProps> = ({ context }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const getGuideText = useCallback(() => {
    if (context) return context;
    return PAGE_GUIDES[location.pathname] || "How can I help you today?";
  }, [location.pathname, context]);

  const speak = () => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const text = getGuideText();
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Voice Error",
          description: "There was an error playing the voice guide.",
          variant: "destructive",
        });
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not Supported",
        description: "Your browser does not support voice synthesis.",
        variant: "destructive",
      });
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-[100]">
      <TooltipProvider>
        <div className="flex flex-col gap-2">
          {isSpeaking ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="destructive"
                  className="rounded-full shadow-lg h-14 w-14 animate-pulse relative"
                  onClick={stopSpeaking}
                >
                  <span className="text-2xl">🤖</span>
                  <VolumeX className="h-4 w-4 absolute -top-1 -right-1 bg-destructive rounded-full p-0.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Stop Guide</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full shadow-lg h-14 w-14 bg-primary hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
                  onClick={speak}
                >
                  <span className="text-2xl">🤖</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Play Guide</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-background border border-border rounded-full p-2 shadow-sm flex items-center justify-center h-10 w-10 cursor-default opacity-60 hover:opacity-100 transition-opacity">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px]">
              Click the AI guide to hear helpful tips for this page.
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default VoiceGuide;
