import { getProfileTranslations } from "@/hooks/translations/getProfileTranslations";
import ProfileTabs from "./profile-tabs/ProfileTabs";

const ProfilePage = async () => {
  const translations = await getProfileTranslations();

  return <ProfileTabs translations={translations} />;
};

export default ProfilePage;
