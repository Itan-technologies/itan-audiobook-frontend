"use client";

import { useState, useEffect } from "react";

import { Plus, Wallet } from "lucide-react";

import { api } from "@/utils/auth/authorApi";
import { getPaymentSummary } from "@/utils/payment";


export default function WalletPage() {
  // ──────────────────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);

  const [banks, setBanks] = useState([]);
  const [balance, setBalance] = useState(0)

  /** FORM DATA */
  const [bankCode, setBankCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  /** VERIFICATION DATA */
  const [verifiedAccountName, setVerifiedAccountName] = useState("");
  const [verificationError, setVerificationError] = useState("");

  /** UX FLAGS */
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false); // New state for verification loading
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  
useEffect(() => {
  const fetchBalance = async () => {
    try {
      const data = await getPaymentSummary();
      setBalance(data?.earnings_summary || 0);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  fetchBalance();
}, []);

  useEffect(() => {
    if (!showModal) return;

    const fetchBanks = async () => {
      setLoadingBanks(true);
      setError("");
      try {
        const res = await api.get("/author/banking_details/banks");
        setBanks(res.data.banks || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load banks; please try again."
        );
      } finally {
        setLoadingBanks(false);
      }
    };

    fetchBanks();
  }, [showModal]);

  /* ── Handle bank details verification ─────────────────────────────── */
  useEffect(() => {
    const verifyBankDetails = async () => {
      // Only proceed if bankCode is selected and accountNumber is exactly 10 digits
      if (!bankCode || accountNumber.length !== 10) {
        setVerifiedAccountName("");
        setVerificationError("");
        return;
      }

      setVerifying(true);
      setVerificationError("");
      setVerifiedAccountName(""); // Clear previous verification

      try {
        const res = await api.post(
          "http://localhost:3000/api/v1/author/banking_details/verify",
          {
            bank_code: bankCode,
            account_number: accountNumber,
          },
          { "Content-Type": "application/json" }
        );

        if (res.data?.success) {
          setVerifiedAccountName(res.data.account_name);
          setAccountName(res.data.account_name); 
        } else {
          setVerificationError(
            res.data?.message || "Account verification failed."
          );
        }
      } catch (err) {
        setVerificationError(
          err.response?.data?.message || "Network error during verification."
        );
      } finally {
        setVerifying(false);
      }
    };

    const timeoutId = setTimeout(verifyBankDetails, 700); // Debounce verification for 700ms
    return () => clearTimeout(timeoutId);
  }, [bankCode, accountNumber]); // Rerun when bankCode or accountNumber changes

  /* ── Handle form submit ───────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    // Prevent submission if verification is pending or failed
    if (verifying) {
      setError("Please wait for account verification to complete.");
      setSubmitting(false);
      return;
    }

    if (verificationError) {
      setError("Cannot save. Please correct the banking details.");
      setSubmitting(false);
      return;
    }

    // This check becomes less critical if auto-populating, but still good as a fallback
    // In a real scenario, you might entirely rely on the verifiedAccountName for submission
    if (
      verifiedAccountName &&
      verifiedAccountName.toLowerCase() !== accountName.toLowerCase()
    ) {
      setError(
        "Account name does not match verified name. Please ensure they are identical or accept the auto-filled name."
      );
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.put(
        "/author/banking_details",
        {
          banking_detail: {
            bank_code: bankCode,
            account_number: accountNumber,
            account_name: accountName, // Using the (potentially auto-filled) user-entered account name
          },
        },
        { "Content-Type": "application/json" }
      );

      if (res.data?.active) {
        setMessage(res.data.message || "Banking details updated!");
        // Clear form / force re-fetch wallet balance here if needed
        setShowModal(false);
      } else {
        console.log("Bank Details Err: ", res)
        setError("Something went wrong.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative mt-12 flex min-h-screen flex-col items-center justify-start bg-white px-4 py-10">
      {/* Balance Card */}
      <div className="w-full max-w-md rounded-xl border-4 border-orange-600 bg-gradient-to-r from-orange-300 to-orange-500 p-6 text-black shadow-md">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold">Available Balance</p>
          </div>
          <div className="flex flex-col relative">
            {/* <p className="text-sm">{new Date().toLocaleDateString()}</p> */}
            <p className="text-sm">Pending Balance</p>
            <p className="text-sm absolute right-0 top-8">${balance.pending_earnings}</p>
          </div>
        </div>

        <p className="mb-8 text-4xl font-bold">${balance.approved_earnings}</p>

        <div className="flex items-center justify-between text-sm text-black/80 border-0 border-b-2 border-gray-600">
          <p>Total wallet balance</p>
          <p>${balance.total}</p>
        </div>
      </div>

      {/* Withdraw Button */}
      <button className="mt-6 flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 text-sm text-white hover:bg-red-700">
        <Wallet className="h-4 w-4" />
        Withdraw
      </button>

      {/* Add New Details Trigger */}
      <div
        className="mt-10 w-full max-w-md cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-400"
        onClick={() => setShowModal(true)}
      >
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
          <Plus className="mb-2 h-6 w-6 text-red-600" />
          <p className="text-gray-600">Add New Details</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative mx-2 w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-red-500"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Logo */}
            <div className="mb-6">
              <img src="/images/logo.png" alt="itan" className="h-6 w-12" />
            </div>

            <h2 className="mb-6 text-center text-xl font-bold">
              Add New Details
            </h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bank Name */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Bank Name
                </label>
                {loadingBanks ? (
                  <p className="py-2 text-sm text-gray-500">Loading banks…</p>
                ) : (
                  <select
                    key={bankCode} // Key helps reset select when options change
                    required
                    value={bankCode}
                    onChange={(e) => {
                      setBankCode(e.target.value);
                      setVerifiedAccountName(""); // Clear verification on bank change
                      setVerificationError("");
                      setAccountName(""); // Clear account name on bank change
                    }}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="" disabled>
                      Select Bank
                    </option>
                    {banks.map((b) => (
                      <option key={b.name} value={b.code}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Account Number
                </label>
                <input
                  type="tel" // Use type="tel" for numeric input, but allow for flexible input on mobile
                  placeholder="Enter Account Number (10 digits)"
                  value={accountNumber}
                  onChange={(e) => {
                    // Restrict input to numbers and max 10 digits
                    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                    setAccountNumber(value.slice(0, 10)); // Limit to 10 digits
                    setVerifiedAccountName(""); // Clear verification on account number change
                    setVerificationError("");
                    // Do NOT clear accountName here, as it will be auto-populated by verification
                  }}
                  maxLength={10} // HTML attribute for max length
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {accountNumber.length > 0 && accountNumber.length < 10 && (
                  <p className="mt-1 text-sm text-gray-500">
                    Account number must be 10 digits.
                  </p>
                )}
                {verifying && (
                  <p className="mt-1 text-sm text-gray-500">
                    Verifying account...
                  </p>
                )}
                {verificationError && (
                  <p className="mt-1 text-sm text-red-600">
                    {verificationError}
                  </p>
                )}
                {verifiedAccountName && !verificationError && (
                  <p className="mt-1 text-sm text-green-600">
                    Verified Name:{" "}
                    <span className="font-semibold">{verifiedAccountName}</span>
                  </p>
                )}
              </div>

              {/* Account Name */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Account Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {verifiedAccountName &&
                  accountName &&
                  verifiedAccountName.toLowerCase() !==
                    accountName.toLowerCase() && (
                    <p className="mt-1 text-sm text-orange-600">
                      Warning: The entered name differs from the verified name.
                      Please correct it.
                    </p>
                  )}
              </div>

              {/* FEEDBACK */}
              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  submitting ||
                  verifying ||
                  verificationError ||
                  accountNumber.length !== 10 ||
                  !verifiedAccountName ||
                  (verifiedAccountName &&
                    accountName.toLowerCase() !==
                      verifiedAccountName.toLowerCase())
                }
                className={`mt-2 w-full rounded-md bg-red-600 py-3 font-semibold text-white hover:bg-red-700 ${
                  submitting ||
                  verifying ||
                  verificationError ||
                  accountNumber.length !== 10 ||
                  !verifiedAccountName ||
                  (verifiedAccountName &&
                    accountName.toLowerCase() !==
                      verifiedAccountName.toLowerCase())
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                {submitting
                  ? "Saving…"
                  : verifying
                    ? "Verifying..."
                    : "Add Details"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
