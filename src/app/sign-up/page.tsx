"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem("token")) router.push("/pet-store");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log("Signup successful");
        const data = await response.json();
        window.localStorage.setItem("token", data.token);
        router.push("/pet-store");
      } else {
        const data = await response.json();
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("An error occurred during signup");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Illustration */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden rounded-r-3xl">
        <div className="absolute inset-0 bg-[#1a472a] flex justify-center items-center">
          <img
            src="/img/signup.jpg"
            alt="Scenic mountain lake view"
            className="w-11/12 h-5/6 object-cover rounded-3xl drop-shadow-xl border-[#059669] border-4"
          />
        </div>
        <div className="absolute bottom-12 left-12 right-12">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg text-center">
            Make Learning Fun
          </h1>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#1a472a] lg:bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white lg:text-[#1a472a]">
              Create Account
            </h2>
            <p className="text-gray-200 lg:text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-emerald-300 hover:text-emerald-400 lg:text-emerald-600 lg:hover:text-emerald-700"
              >
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white lg:text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 
                         lg:bg-white lg:border-gray-200 lg:text-gray-900 lg:placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white lg:text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 
                         lg:bg-white lg:border-gray-200 lg:text-gray-900 lg:placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-white lg:text-gray-700"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 
                         lg:bg-white lg:border-gray-200 lg:text-gray-900 lg:placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500
                          lg:border-gray-200"
              />
              <Label
                htmlFor="terms"
                className="text-sm text-white lg:text-gray-700"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-emerald-300 hover:text-emerald-400 lg:text-emerald-600 lg:hover:text-emerald-700"
                >
                  Terms & Conditions
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={!agreed}
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
