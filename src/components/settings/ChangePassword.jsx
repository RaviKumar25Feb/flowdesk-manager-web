import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiShield } from "react-icons/fi";
import { toast } from "sonner";

import { changePassword } from "../../services/auth.service";

const initialFormData = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function ChangePassword() {
  const [formData, setFormData] = useState(initialFormData);

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleTogglePassword = (fieldName) => {
    setShowPassword((previous) => ({
      ...previous,
      [fieldName]: !previous[fieldName],
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.oldPassword.trim()) {
      nextErrors.oldPassword = "Current password is required.";
    }

    if (!formData.newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 8) {
      nextErrors.newPassword =
        "New password must contain at least 8 characters.";
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      nextErrors.confirmPassword =
        "New password and confirm password do not match.";
    }

    if (
      formData.oldPassword &&
      formData.newPassword &&
      formData.oldPassword === formData.newPassword
    ) {
      nextErrors.newPassword =
        "New password cannot be the same as current password.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(response.data?.message || "Password updated successfully.");

      setFormData(initialFormData);
      setErrors({});

      setShowPassword({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    } catch (error) {
      console.error(
        "Change Password Error:",
        error.response?.data || error.message,
      );

      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const nextErrors = {};

        backendErrors.forEach((item) => {
          if (item.path) {
            nextErrors[item.path] = item.msg;
          }
        });

        setErrors(nextErrors);
      }

      toast.error(
        error.response?.data?.message || "Failed to update password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <PasswordInput
        label="Current Password"
        name="oldPassword"
        value={formData.oldPassword}
        show={showPassword.oldPassword}
        error={errors.oldPassword}
        placeholder="Enter current password"
        disabled={loading}
        onChange={handleChange}
        onToggle={() => handleTogglePassword("oldPassword")}
      />

      <PasswordInput
        label="New Password"
        name="newPassword"
        value={formData.newPassword}
        show={showPassword.newPassword}
        error={errors.newPassword}
        placeholder="Enter new password"
        disabled={loading}
        onChange={handleChange}
        onToggle={() => handleTogglePassword("newPassword")}
      />

      <PasswordInput
        label="Confirm New Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        show={showPassword.confirmPassword}
        error={errors.confirmPassword}
        placeholder="Confirm new password"
        disabled={loading}
        onChange={handleChange}
        onToggle={() => handleTogglePassword("confirmPassword")}
      />

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <FiShield className="mt-0.5 shrink-0 text-lg text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-blue-900">
              Password recommendations
            </p>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-700">
              <li>Use at least 8 characters.</li>
              <li>Include uppercase and lowercase letters.</li>
              <li>Include a number and special character.</li>
              <li>Do not reuse your current password.</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Updating Password..." : "Update Password"}
      </button>
    </form>
  );
}

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
          autoComplete={
            name === "oldPassword" ? "current-password" : "new-password"
          }
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

export default ChangePassword;
