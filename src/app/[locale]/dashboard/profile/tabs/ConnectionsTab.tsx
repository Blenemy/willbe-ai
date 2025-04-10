"use client";

import ProfileCard from "./components/ProfileCard";
import { Button } from "@/components/ui/button";
import { useConnections } from "@/hooks/useConnections";
import { useTranslations } from "next-intl";

const ConnectionsTab = () => {
  const t = useTranslations("Profile");

  const {
    userStatus,
    connectLinkedIn,
    disconnectLinkedIn,
    connectGmail,
    connectOutlook,
    disconnectEmail,
  } = useConnections({
    enableFetch: true,
  });

  const linkedInConnected = userStatus?.linkedin ?? false;
  const emailConnected = (userStatus?.email ?? "none") as
    | "none"
    | "gmail"
    | "outlook";

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">{t("connections_title")}</h2>

      <ProfileCard title={t("connections_linkedin")}>
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            {t("connections_status")}:{" "}
            {linkedInConnected
              ? t("connections_connected")
              : t("connections_not_connected")}
          </p>
          <div className="flex gap-2">
            {linkedInConnected ? (
              <Button
                variant="destructive"
                onClick={() => disconnectLinkedIn.mutate()}
              >
                {t("connections_remove")}
              </Button>
            ) : (
              <Button onClick={() => connectLinkedIn.mutate()}>
                {t("connections_connect_linkedin")}
              </Button>
            )}
          </div>
        </div>
      </ProfileCard>

      <ProfileCard title={t("connections_email")}>
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            {t("connections_status")}:{" "}
            {emailConnected === "none"
              ? t("connections_not_connected")
              : t("connections_connected_to", {
                  provider: emailConnected,
                })}
          </p>
          <div className="flex gap-2">
            {emailConnected === "none" ? (
              <>
                <Button onClick={() => connectGmail.mutate()}>
                  {t("connections_connect_gmail")}
                </Button>
                <Button onClick={() => connectOutlook.mutate()}>
                  {t("connections_connect_outlook")}
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                onClick={() => disconnectEmail.mutate()}
              >
                {t("connections_remove")}
              </Button>
            )}
          </div>
        </div>
      </ProfileCard>
    </div>
  );
};

export default ConnectionsTab;
