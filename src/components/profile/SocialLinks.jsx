import { FiGithub, FiLinkedin, FiGlobe } from "react-icons/fi";

function SocialLinks({ user }) {
  const profile = user?.profile;

  const links = [
    {
      name: "LinkedIn",
      value: profile?.linkedin,
      icon: FiLinkedin,
    },
    {
      name: "GitHub",
      value: profile?.github,
      icon: FiGithub,
    },
    {
      name: "Portfolio",
      value: profile?.portfolio,
      icon: FiGlobe,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">Social Links</h2>

        <p className="mt-1 text-sm text-gray-500">
          Connect through professional platforms.
        </p>
      </div>

      {/* Links */}
      <div className="grid gap-4 md:grid-cols-3">
        {links.map((link, index) => {
          const Icon = link.icon;

          return (
            <a
              key={index}
              href={link.value || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                <Icon className="text-xl" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {link.name}
                </p>

                <p className="truncate text-xs text-gray-500 group-hover:text-blue-600">
                  {link.value || "Not added"}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default SocialLinks;
