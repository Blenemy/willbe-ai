"use client";

import { useRouter } from "next/navigation";
import ProfileCard from "../../profile/tabs/components/ProfileCard";
import { useTranslations } from "next-intl";
import { useConnections } from "@/hooks/useConnections";
import {
  useConnectHubspot,
  useDisconnectHubspot,
} from "@/hooks/useConnectHubspot";
import IconHubspot from "@/assets/hubspot_orange.svg";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const ConnectionsTab = () => {
  const router = useRouter();
  const t = useTranslations("Profile");

  const { userStatus } = useConnections({
    enableFetch: true,
  });

  const { mutate: connectHubspot } = useConnectHubspot();
  const { mutate: disconnectHubspot } = useDisconnectHubspot();

  const hubspotConnected = userStatus?.hubspot;

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">{t("connections_title")}</h2>

      <p className="text-[#5F5F5F]">{t("connections_desription")}: </p>

      <ProfileCard title={t("connections_hubspot")} icon={IconHubspot}>
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
