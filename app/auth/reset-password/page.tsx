"use client";

import { Sparkles, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { stackClientApp } from "@/lib/auth/client";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [code, setCode] = useState("");
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const resetCode = searchParams.get('code');
    if (!resetCode) {
      setError("Invalid or missing reset code. Please request a new password reset link.");
      return;
    }
    setCode(resetCode);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      setError("Invalid reset code. Please request a new password reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const result = await stackClientApp.resetPassword({
        code: code,
        password: password
      });
      
      if (result.status === 'error') {
        throw new Error(result.error.message);
      }
      
      setIsSuccess(true);
      
      // Redirect to signin after 3 seconds
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      setError(error instanceof Error ? error.message : "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg youtube-gradient">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">TubeSpark</span>
            </Link>
          </div>
          <div className="mt-8 bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">
                Password reset successful!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Your password has been successfully reset. You will be redirected to the sign in page in a few seconds.
              </p>
              <div className="mt-6">
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Continue to sign in →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg youtube-gradient">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">TubeSpark</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below to complete the reset process.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !code}
                className="flex w-full justify-center rounded-md youtube-gradient px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}