import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { toast } from "sonner";

import { forgotPassword } from "../services/auth.service";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await forgotPassword(email.trim().toLowerCase());
      toast.success(response.data?.message || "Reset token sent successfully.");
      const normalizedEmail = email.trim().toLowerCase();
      navigate(`/reset-password?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (error) {
      const validationError = error.response?.data?.errors?.[0]?.msg;

      setError(
        validationError ||
          error.response?.data?.message ||
          "Failed to send reset token.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-7 shadow-xl">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          <FiArrowLeft />
          Back to Login
        </Link>

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter your registered email address. We will send you a verification
            code valid for 10 minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div className="relative">
              <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="Enter your email"
                disabled={submitting}
                className={`w-full rounded-xl border py-3 pr-4 pl-11 text-sm outline-none focus:ring-2 ${
                  error
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
            </div>

            {error && (
              <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending Code..." : "Send Reset Code"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
