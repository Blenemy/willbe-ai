"use client";

import ProfileCard from "./components/ProfileCard";
import { Button } from "@/components/ui/button";
import {
  useConnectHubspot,
  useDisconnectHubspot,
} from "@/hooks/useConnectHubspot";
import { useConnections } from "@/hooks/useConnections";
import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const ConnectionsTab = () => {
  const router = useRouter();
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

  const { mutate: connectHubspot } = useConnectHubspot();
  const { mutate: disconnectHubspot } = useDisconnectHubspot();

  const hubspotConnected = userStatus?.hubspot;
  const linkedInConnected = userStatus?.linkedin ?? false;
  const emailConnected = (userStatus?.email ?? "none") as
    | "none"
    | "gmail"
    | "outlook";

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">{t("connections_title")}</h2>

      <p className="text-[#5F5F5F]">{t("connections_desription")}: </p>

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
                className="bg-[#EF476F]"
              >
                {t("connections_remove")}
              </Button>
            ) : (
              <Button
                onClick={() => connectLinkedIn.mutate()}
                className="bg-[#084960] rounded-md"
              >
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
                className="bg-[#EF476F]"
              >
                {t("connections_remove")}
              </Button>
            )}
          </div>
        </div>
      </ProfileCard>

      <ProfileCard title={t("connections_hubspot")}>
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            {t("connections_status")}:{" "}
            {hubspotConnected
              ? t("connections_connected")
              : t("connections_not_connected")}
          </p>
          <div className="flex gap-2">
            {hubspotConnected ? (
              <>
                <Button
                  size="icon"
                  className="bg-[#084960]"
                  onClick={() =>
                    router.push("/en/dashboard/profile/hubspot-settings")
                  }
                >
                  <Settings className="w-4 h-4 text-white" />
                </Button>
                <Button
                  variant="destructive"
                  className="bg-[#EF476F]"
                  onClick={() => disconnectHubspot()}
                >
                  {t("connections_remove")}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => connectHubspot()}
                className="bg-[#084960] rounded-md"
              >
                {t("connections_connect_hubspot")}
              </Button>
            )}
          </div>
        </div>
      </ProfileCard>
    </div>
  );
};

export default ConnectionsTab;
