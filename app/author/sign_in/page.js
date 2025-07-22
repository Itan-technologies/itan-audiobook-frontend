"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { signInAuthor } from "@/utils/auth/authorApi";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const SignIn = () => {
  const [captchaToken, setCaptchaToken] = useState("");
  const recaptchaRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const author = await signInAuthor(email, password, captchaToken);
      console.log("Author Sign-in Data:", author);

      if (
        author.status.code === 202 &&
        author.status.requires_verification == true
      ) {
        router.push("/auth/mfa/verify");
      }

      if (author?.data?.id) {
        localStorage.setItem("authorInfo", JSON.stringify(author.data));
        router.push(`/dashboard/author/${author.data.id}`);
        toast.success("Logged in successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Sign-in failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = () => {
    setGoogleLoading(true);
    localStorage.setItem("oauth_redirect", window.location.href);

    window.location.href = `http://localhost:3000/api/v1/authors/auth/google_oauth2`;
  };

  useEffect(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      setCaptchaToken("");
    }
  }, [email, password]);
  
  useEffect(() => {
    // Check for OAuth errors or success in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error === "oauth_failed") {
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    } else if (error) {
      toast.error(`Authentication error: ${error}`);
      setGoogleLoading(false);
    }
  }, []);

  return (
    <main className="w-full mb-9 px-4 sm:px-0">
      <section className="bg-white w-full max-w-[350px] sm:max-w-[410px] rounded-2xl p-4 sm:py-5 sm:px-6 sm:w-[600px] mt-24 mx-auto border">
        <Link href="/">
          <img
            src="/images/logo.png"
            alt="Company Logo"
            className="w-10 h-6 cursor-pointer"
          />
        </Link>

        <header className="text-center">
          <h1 className="text-lg md:text-2xl font-bold">Welcome Back</h1>
          <p className="text-xs md:text-sm mb-4">
            Don't have an account?{" "}
            <Link
              href="/author/sign_up"
              className="font-bold hover:text-blue-700"
            >
              <span className="text-xs md:text-sm">Create One</span>
            </Link>
          </p>
        </header>

        <form onSubmit={handleSignIn}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="Johndoe@gmail.com"
              className="placeholder-gray-400 h-[50px] bg-gray-50 border-0 text-gray-900 rounded-lg focus:ring-1 focus:outline-none focus:ring-teal-200 block w-full p-2.5"
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
              id="password"
              required
              placeholder="Enter your password"
              className="placeholder-gray-400 h-[50px] bg-gray-50 border-0 text-gray-900 rounded-lg focus:ring-1 focus:outline-none focus:ring-teal-200 block w-full p-2.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* reCAPTCHA placed BEFORE the submit button */}
          <div className="my-4">
            <div className="w-full overflow-hidden">
              <div className="transform scale-75 sm:scale-90 md:scale-100 origin-left w-full">
                {SITE_KEY ? (
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={SITE_KEY}
                    onChange={(token) => setCaptchaToken(token || "")}
                    onError={(err) => {
                      console.error("reCAPTCHA error:", err);
                      toast.error(
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

          <div className="relative">
            <button
              type="submit"
              disabled={loading || !captchaToken}
              className={`${
                loading || !captchaToken
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } h-[50px] font-semibold text-white bg-[#E50913] hover:bg-[#ba2129] rounded-lg px-5 py-2.5 w-full`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <Link
              href="/auth/forget-password"
              className="absolute right-0 -bottom-6 text-sm hover:text-blue-700"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="inline-flex items-center justify-center w-full my-10">
            <div className="h-[1px] w-full bg-gray-300" />
            <span className="px-3 font-extralight text-sm text-gray-300">
              OR
            </span>
            <div className="h-[1px] w-full bg-gray-300" />
          </div>

          <button
            type="button"
            onClick={handleLoginWithGoogle}
            disabled={googleLoading}
            className="h-[50px] hover:text-white text-[#4e4c4c] space-x-3 sm:space-x-5 flex w-full px-3 py-2 font-medium text-center items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-400 focus:ring-1 focus:outline-none focus:ring-[#E50913]"
          >
            {googleLoading ? (
              <p className="text-sm sm:text-base">Redirecting...</p>
            ) : (
              <>
                <img
                  src="/images/google.png"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  alt="Google Logo"
                />
                <p className="text-sm sm:text-base">Continue with Google</p>
              </>
            )}
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-[#E50913]">{message}</p>
          )}
        </form>
      </section>
    </main>
  );
};

export default SignIn;
