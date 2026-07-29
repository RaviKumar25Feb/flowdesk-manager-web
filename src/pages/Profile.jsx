import { useAuth } from "../context/AuthContext";

import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfo from "../components/profile/PersonalInfo";
import ProfessionalInfo from "../components/profile/ProfessionalInfo";
import SocialLinks from "../components/profile/SocialLinks";
import Skills from "../components/profile/Skills";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} />
      <PersonalInfo user={user} />
      <ProfessionalInfo user={user} />
      <SocialLinks user={user} />
      <Skills user={user} />
    </div>
  );
}

export default Profile;
