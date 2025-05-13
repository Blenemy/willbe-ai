"use client";

import { useSocialAuth } from "@/hooks/useSocialMedia";
import GoogleLogo from "../../assets/GoogleLogo.svg";
import MicrosoftLogo from "../../assets/MicrosoftLogo.svg";
import LinkedinLogo from "../../assets/LinkedinLogo.svg";
import Image from "next/image";

export const SocialAuthButtons = () => {
  const { redirectTo } = useSocialAuth();

  const baseStyle =
    "relative w-full h-11 border border-input rounded-md text-sm font-medium transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring shadow-sm flex items-center justify-center";

  const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5";

  return (
    <div className="flex flex-col gap-2 mt-6">
      <button
        onClick={() => redirectTo("google")}
        className={baseStyle}
        type="button"
      >
        <Image
          src={GoogleLogo}
          alt="Google"
          className={iconStyle}
          width={20}
          height={20}
        />
        Continue with Google
      </button>

      <button
        onClick={() => redirectTo("microsoft")}
        className={baseStyle}
        type="button"
      >
        <Image
          src={MicrosoftLogo}
          alt="Microsoft"
          className={iconStyle}
          width={20}
          height={20}
        />
        Continue with Microsoft
      </button>

      <button
        onClick={() => redirectTo("linkedin")}
        className={baseStyle}
        type="button"
      >
        <Image
          src={LinkedinLogo}
          alt="LinkedIn"
          className={iconStyle}
          width={20}
          height={20}
        />
        Continue with LinkedIn
      </button>
    </div>
  );
};

export const OrDivider = () => {
  return (
    <div className="flex items-center gap-4 w-full my-4">
      <div className="flex-grow h-px bg-muted" />
      <span className="text-sm text-muted-foreground font-medium">or</span>
      <div className="flex-grow h-px bg-muted" />
    </div>
  );
};
