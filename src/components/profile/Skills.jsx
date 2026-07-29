import { FiCode } from "react-icons/fi";

function Skills({ user }) {
  const skills = user?.profile?.skills || [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <FiCode className="text-xl" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Skills & Expertise
          </h2>

          <p className="text-sm text-gray-500">
            Technical skills and professional capabilities.
          </p>
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No skills added yet.</p>
      )}
    </div>
  );
}

export default Skills;
