import { useEffect } from "react";
import { useLocation } from "wouter";

export default function RedirectToHome() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    // Replace history entry to avoid going back to /login
    setLocation("/", { replace: true });
  }, [setLocation]);
  return null;
}