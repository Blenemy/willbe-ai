import SignatureForm from "./components/SignatureForm";

const SignatureTab = () => {
  return (
    <div className="px-6 flex flex-col gap-7">
      <h2 className="font-bold text-xl">Email Signature</h2>

      <SignatureForm />
    </div>
  );
};

export default SignatureTab;
