import { Link } from "react-router-dom";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { login } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { FaRegCircleXmark } from "react-icons/fa6";
import Spinner from "../components/common/Spinner";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, checkAuth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({
      email: "",
      password: "",
    });
    setFormError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrors({
        email: !formData.email.trim() ? "Email is required." : "",
        password: !formData.password.trim() ? "Password is required." : "",
      });

      return;
    }

    try {
      setIsSubmitting(true);
      const response = await login(formData);

      if (response.data.success) {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        await checkAuth();

        //Clear the form
        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      const { field, message } = error.response?.data || {};
      if (field) {
        setErrors((prev) => ({
          ...prev,
          [field]: message,
        }));
      } else {
        setFormError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Section */}
      <div className="hidden min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10">
        {/* Header */}
        <div className="shrink-0">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            FlowDesk
          </h1>

          <p className="mt-2 text-sm font-medium tracking-[0.15em] text-blue-200">
            Project Management Platform
          </p>
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="max-w-xl text-5xl font-bold leading-tight text-white">
            Manage projects.
            <br />
            Track progress.
            <br />
            Deliver with trust.
          </h2>

          <p className="mt-6 max-w-lg text-lg leading-7 text-blue-100">
            A modern workspace built to help managers organize teams, streamline
            workflows, and keep every project moving forward.
          </p>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/10 pt-3">
          <p className="text-sm text-blue-200">
            Designed for managers. Built for teams.
          </p>

          <p className="mt-1 text-xs uppercase tracking-widest text-blue-300/70">
            FlowDesk © 2026
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center bg-gray-50 px-6 py-10">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>

            <p className="mt-2 text-gray-500">
              Login to access your manager dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

              {errors.email && (
                <div className="flex items-center font-semibold gap-1 text-sm text-red-600">
                  <FaRegCircleXmark className="mt-1" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  required
                  onChange={handleChange}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                {errors.password && (
                  <div className="flex items-center font-semibold gap-1 text-sm text-red-600">
                    <FaRegCircleXmark className="mt-1" />
                    <span>{errors.password}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 transition-colors duration-200 hover:text-gray-900"
                >
                  {showPassword ? (
                    <FaRegEye className="text-lg text-gray-700" />
                  ) : (
                    <FaRegEyeSlash className="text-xl text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="flex justify-center w-full text-center cursor-pointer rounded-full bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {isSubmitting ? <Spinner /> : "Log in"}
            </button>

            <div className="w-full font-medium text-gray-800 text-center cursor-pointer rounded-full hover:bg-gray-200 py-3">
              <Link to="#">Forgotten password?</Link>
            </div>
          </form>
          <div className="relative top-10">
            {formError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
