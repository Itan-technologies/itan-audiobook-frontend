"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAuthor } from "@/utils/auth/authorApi";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const SignUp = () => {
  const [captchaToken, setCaptchaToken] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignup = () => {
    // Get your backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Store current page URL to redirect back after OAuth (optional)
    localStorage.setItem("oauth_redirect", window.location.href);

    // Redirect to your Rails backend OAuth endpoint
    window.location.href = `${backendUrl}/authors/auth/google_oauth2`;
  };
  

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const author = await registerAuthor(
        // name,
        email,
        password,
        captchaToken
        // password_confirmation
      );
      if (author?.data?.id) {
        setMessage("Registration successful! You can now log in.");
        router.push("/author/sign_in");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for OAuth errors in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error === "oauth_failed") {
      setMessage("Google sign-up failed. Please try again.");
    } else if (error === "oauth_error") {
      setMessage("Authentication error. Please try again.");
    }
  }, []);

  return (
    <main className="w-full mb-9 px-4 sm:px-0">
      <section className="bg-white max-w-[350px] rounded-2xl p-2 sm:py-5 sm:px-6 sm:max-w-[410px] mt-24 mx-auto border">
        <header>
          <Link href="/">
            <img
              src="/images/logo.png"
              alt="Itan Logo"
              className="w-10 h-6 cursor-pointer"
            />
          </Link>
        </header>

        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome!</h1>
          <p className="text-sm mb-4">
            Already have an account?{" "}
            <Link
              href="/author/sign_in"
              className="font-bold cursor-pointer hover:text-blue-700"
            >
              Log In
            </Link>
          </p>
        </div>

        <form onSubmit={handleSignup} aria-label="Signup Form">
          <div className="mt-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="placeholder-gray-400 h-[45px] sm:h-[50px] bg-gray-50 border-0 text-gray-900 rounded-lg focus:ring-1 focus:outline-none focus:ring-teal-200 block p-2 sm:p-2.5 text-sm sm:text-base w-full"
              placeholder="Johndoe@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="placeholder-gray-400 h-[45px] sm:h-[50px] bg-gray-50 border-0 text-gray-900 rounded-lg focus:ring-1 focus:outline-none focus:ring-teal-200 block w-full p-2 sm:p-2.5 text-sm sm:text-base"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ✅ Updated reCAPTCHA component with error handling */}
          <div className="my-4">
            <div className="w-full overflow-hidden">
              <div className="transform scale-75 sm:scale-90 md:scale-100 origin-left w-full">
                {SITE_KEY ? (
                  <ReCAPTCHA
                    sitekey={SITE_KEY}
                    onChange={(token) => setCaptchaToken(token || "")}
                    onError={(err) => {
                      console.error("reCAPTCHA error:", err);
                      // If you have toast imported, uncomment the line below
                      // toast.error("reCAPTCHA failed to load. Please refresh the page.");
                      setMessage(
                        "reCAPTCHA failed to load. Please refresh the page."
                      );
                    }}
                  />
                ) : (
                  <div className="p-3 text-red-500 text-sm border border-red-200 rounded bg-red-50">
                    reCAPTCHA configuration error - Please try again
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="h-[50px] font-semibold text-white bg-[#E50913] hover:bg-[#ba2129] rounded-lg px-5 py-2.5 w-full max-w-full min-w-0"
              disabled={loading || !captchaToken}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>

            <div className="inline-flex items-center justify-center w-full my-5">
              <p className="ml-10 h-[1px] w-full bg-gray-300" />
              <span className="px-3 font-extralight text-sm text-gray-300">
                OR
              </span>
              <p className="h-[1px] w-full bg-gray-300 mr-10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="h-[50px] hover:text-white text-[#4e4c4c] space-x-5 flex w-full px-3 py-2 font-medium text-center items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-400 focus:ring-1 focus:outline-none focus:ring-[#E50913]"
            >
              <img
                src="/images/google.png"
                className="w-6 h-6"
                alt="Google Logo"
              />
              <p>Continue with Google</p>
            </button>
          </div>

          {message && (
            <p
              className="mt-4 text-center text-sm text-[#E50913]"
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
};

export default SignUp;
