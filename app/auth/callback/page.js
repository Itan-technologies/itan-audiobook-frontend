"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {        
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

        const response = await fetch(`${backendUrl}/api/v1/authors/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();

          // Store user data to match your app's format
          localStorage.setItem("authorInfo", JSON.stringify(userData.data));

          // Show success message
          toast.success("Signed in with Google successfully!");
          
          router.push(`/dashboard/author/${userData.data.id}`);
        } else if (response.status === 401) {
          // User exists but not confirmed
          toast.error(
            "Please check your email and confirm your account to complete sign-in."
          );
          router.push("/author/sign_in"); 
        } else {
          // Other authentication failures
          toast.error("Google sign-in failed. Please try again.");
          router.push("/author/sign_up?error=oauth_failed");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast.error("Authentication error. Please try again.");
        router.push("/author/sign_up?error=oauth_error");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50913] mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
