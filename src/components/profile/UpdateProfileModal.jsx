import { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiPlus,
  FiSave,
  FiX,
} from "react-icons/fi";
import { toast } from "sonner";

import { updateProfile } from "../../services/profile.service";

const initialFormData = {
  name: "",
  phone: "",
  bio: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  designation: "",
  department: "",
  github: "",
  linkedin: "",
  portfolio: "",
  skills: [],
};

const UpdateProfileModal = ({ open, user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !user) return;

    const profile = user.profile || {};

    setFormData({
      name: user.name || "",
      phone: profile.phone || "",
      bio: profile.bio || "",
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
      gender: profile.gender || "",
      address: profile.address || "",
      city: profile.city || "",
      state: profile.state || "",
      country: profile.country || "",
      pincode: profile.pincode || "",
      designation: profile.designation || "",
      department: profile.department || "",
      github: profile.github || "",
      linkedin: profile.linkedin || "",
      portfolio: profile.portfolio || "",
      skills: Array.isArray(profile.skills) ? profile.skills : [],
    });

    setSkillInput("");
    setErrors({});
  }, [open, user]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, submitting, onClose]);

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

  const validateUrl = (value) => {
    if (!value.trim()) return true;

    try {
      new URL(value.trim());
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      nextErrors.name = "Name must contain at least 2 characters.";
    }

    if (
      formData.phone.trim() &&
      !/^[0-9+\-\s()]{7,15}$/.test(formData.phone.trim())
    ) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (
      formData.pincode.trim() &&
      !/^[a-zA-Z0-9\-\s]{3,10}$/.test(formData.pincode.trim())
    ) {
      nextErrors.pincode = "Enter a valid pincode.";
    }

    if (!validateUrl(formData.github)) {
      nextErrors.github = "Enter a complete URL including https://";
    }

    if (!validateUrl(formData.linkedin)) {
      nextErrors.linkedin = "Enter a complete URL including https://";
    }

    if (!validateUrl(formData.portfolio)) {
      nextErrors.portfolio = "Enter a complete URL including https://";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const alreadyExists = formData.skills.some(
      (currentSkill) => currentSkill.toLowerCase() === skill.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error("This skill is already added.");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      skills: [...previous.skills, skill],
    }));

    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((previous) => ({
      ...previous,
      skills: previous.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        pincode: formData.pincode.trim(),
        designation: formData.designation.trim(),
        department: formData.department.trim(),
        github: formData.github.trim(),
        linkedin: formData.linkedin.trim(),
        portfolio: formData.portfolio.trim(),
        skills: formData.skills,
      };

      const response = await updateProfile(payload);

      toast.success(response.data?.message || "Profile updated successfully.");

      await onSuccess?.(response.data.user);

      onClose();
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your personal and professional information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-8">
              {/* Personal */}
              <FormSection
                title="Personal Information"
                description="Your basic personal and contact details."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Enter full name"
                    required
                  />

                  <FormField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="+91 98765 43210"
                  />

                  <FormField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />

                  <SelectField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      {
                        value: "",
                        label: "Select gender",
                      },
                      {
                        value: "Male",
                        label: "Male",
                      },
                      {
                        value: "Female",
                        label: "Female",
                      },
                      {
                        value: "Other",
                        label: "Other",
                      },
                      {
                        value: "PREFER_NOT_TO_SAY",
                        label: "Prefer not to say",
                      },
                    ]}
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Bio
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    placeholder="Write a short professional introduction..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {formData.bio.length}/500
                  </p>
                </div>
              </FormSection>

              {/* Professional */}
              <FormSection
                title="Professional Information"
                description="Your role, department and expertise."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Project Manager"
                  />

                  <FormField
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Engineering"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Skills & Expertise
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(event) => setSkillInput(event.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Enter skill"
                      className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <FiPlus />
                      Add
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.skills.length > 0 ? (
                      formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                        >
                          {skill}

                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="cursor-pointer text-blue-500 transition hover:text-red-600"
                          >
                            <FiX />
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No skills added.</p>
                    )}
                  </div>
                </div>
              </FormSection>

              {/* Address */}
              <FormSection
                title="Address Information"
                description="Your current address and location."
              >
                <FormField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                />

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <FormField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />

                  <FormField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />

                  <FormField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                  />

                  <FormField
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    error={errors.pincode}
                    placeholder="Pincode"
                  />
                </div>
              </FormSection>

              {/* Social links */}
              <FormSection
                title="Professional Links"
                description="Your public social and professional profiles."
              >
                <div className="grid gap-5 md:grid-cols-3">
                  <IconFormField
                    icon={<FiLinkedin />}
                    label="LinkedIn"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    error={errors.linkedin}
                    placeholder="https://linkedin.com/in/..."
                  />

                  <IconFormField
                    icon={<FiGithub />}
                    label="GitHub"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    error={errors.github}
                    placeholder="https://github.com/..."
                  />

                  <IconFormField
                    icon={<FiGlobe />}
                    label="Portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    error={errors.portfolio}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </FormSection>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave />

              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormSection = ({ title, description, children }) => {
  return (
    <section>
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <FiBriefcase />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>

          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
        {children}
      </div>
    </section>
  );
};

const FormField = ({
  label,
  error,
  required,
  type = "text",
  ...inputProps
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        {...inputProps}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
        }`}
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const SelectField = ({ label, options, ...selectProps }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        {...selectProps}
        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const IconFormField = ({ icon, label, error, ...inputProps }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
          {icon}
        </span>

        <input
          type="url"
          {...inputProps}
          className={`w-full rounded-lg border py-2.5 pr-3 pl-10 text-sm outline-none transition focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default UpdateProfileModal;
