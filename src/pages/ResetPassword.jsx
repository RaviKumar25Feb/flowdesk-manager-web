// src/pages/ResetPassword.jsx

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLock,
  FiMail,
} from "react-icons/fi";
import { toast } from "sonner";

import { resetPassword } from "../services/auth.service";

const initialFormData = {
  resetPasswordToken: "",
  newPassword: "",
  confirmPassword: "",
};

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState(initialFormData);

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!email) {
      nextErrors.email = "Email is missing. Please request a new reset code.";
    }

    if (!formData.resetPasswordToken.trim()) {
      nextErrors.resetPasswordToken = "Verification code is required.";
    }

    if (!formData.newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      nextErrors.confirmPassword =
        "New password and confirm password do not match.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const mapBackendErrors = (backendErrors) => {
    if (!Array.isArray(backendErrors)) return;

    const nextErrors = {};

    backendErrors.forEach((item) => {
      if (item.path) {
        nextErrors[item.path] = item.msg;
      }
    });

    setErrors((previous) => ({
      ...previous,
      ...nextErrors,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const response = await resetPassword({
        email,
        resetPasswordToken: formData.resetPasswordToken.trim(),
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(response.data?.message || "Password reset successfully.");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Reset Password Error:",
        error.response?.data || error.message,
      );

      mapBackendErrors(error.response?.data?.errors);

      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-7 shadow-xl">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
        >
          <FiArrowLeft />
          Back to Login
        </Link>

        <div className="mt-6">
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Reset Password
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter the verification code sent to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="resetPasswordToken"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Verification Code
            </label>

            <div className="relative">
              <FiKey className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

              <input
                id="resetPasswordToken"
                type="text"
                name="resetPasswordToken"
                value={formData.resetPasswordToken}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  handleChange({
                    target: {
                      name: "resetPasswordToken",
                      value,
                    },
                  });
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter 6-digit code"
                disabled={submitting}
                className={`w-full rounded-xl border py-3 pr-4 pl-11 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 ${
                  errors.resetPasswordToken
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
            </div>

            {errors.resetPasswordToken && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {errors.resetPasswordToken}
              </p>
            )}
          </div>

          <PasswordInput
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            show={showPassword.newPassword}
            error={errors.newPassword}
            placeholder="Enter new password"
            disabled={submitting}
            onChange={handleChange}
            onToggle={() =>
              setShowPassword((previous) => ({
                ...previous,
                newPassword: !previous.newPassword,
              }))
            }
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            show={showPassword.confirmPassword}
            error={errors.confirmPassword}
            placeholder="Confirm new password"
            disabled={submitting}
            onChange={handleChange}
            onToggle={() =>
              setShowPassword((previous) => ({
                ...previous,
                confirmPassword: !previous.confirmPassword,
              }))
            }
          />

          <button
            type="submit"
            disabled={submitting || !email}
            className="w-full cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Did not receive the code?{" "}
          <Link
            to="/forgot-password"
            className="font-semibold text-blue-600 underline"
          >
            Resend
          </Link>
        </p>
      </div>
    </div>
  );
}

const ReadOnlyEmail = ({ email, error }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Email Address
      </label>

      <div className="relative">
        <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

        <input
          type="email"
          value={email}
          readOnly
          placeholder="Email not available"
          className={`w-full rounded-xl border bg-gray-50 py-3 pr-4 pl-11 text-sm text-gray-600 outline-none ${
            error ? "border-red-400" : "border-gray-300"
          }`}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
};

const PasswordInput = ({
  label,
  name,
  value,
  show,
  error,
  placeholder,
  disabled,
  onChange,
  onToggle,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

        <input
          id={name}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="new-password"
          className={`w-full rounded-xl border py-3 pr-12 pl-11 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          title={show ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ResetPassword;
