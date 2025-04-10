import SignatureForm from "./components/SignatureForm";
import { getProfileTranslations } from "@/hooks/translations/getProfileTranslations";

const SignatureTab = async () => {
  const translations = await getProfileTranslations();
  return (
    <div className="px-6 flex flex-col gap-7">
      <h2 className="font-bold text-xl">{translations.signature_title}</h2>

      <SignatureForm />
    </div>
  );
};

export default SignatureTab;
