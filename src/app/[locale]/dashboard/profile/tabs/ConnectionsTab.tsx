"use client";

import ProfileCard from "./components/ProfileCard";
import { Button } from "@/components/ui/button";
import { useConnections } from "@/hooks/useConnections";

const ConnectionsTab = () => {
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

  console.log(userStatus);

  const linkedInConnected = userStatus?.linkedin ?? false;
  const emailConnected = (userStatus?.email ?? "none") as
    | "none"
    | "gmail"
    | "outlook";

  return (
    <div className="px-6 flex flex-col gap-5">
      <h2 className="font-bold text-xl">Connections</h2>

      <ProfileCard title="LinkedIn">
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Status: {linkedInConnected ? "Connected" : "Not Connected"}
          </p>
          <div className="flex gap-2">
            {linkedInConnected ? (
              <Button
                variant="destructive"
                onClick={() => {
                  disconnectLinkedIn.mutate();
                }}
              >
                Remove
              </Button>
            ) : (
              <Button onClick={() => connectLinkedIn.mutate()}>
                Connect LinkedIn
              </Button>
            )}
          </div>
        </div>
      </ProfileCard>

      <ProfileCard title="Email">
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Status:{" "}
            {emailConnected === "none"
              ? "Not Connected"
              : `Connected to ${emailConnected}`}
          </p>
          <div className="flex gap-2">
            {emailConnected === "none" ? (
              <>
                <Button
                  onClick={() => {
                    connectGmail.mutate();
                  }}
                >
                  Connect Gmail
                </Button>
                <Button
                  onClick={() => {
                    connectOutlook.mutate();
                  }}
                >
                  Connect Outlook
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                onClick={() => {
                  disconnectEmail.mutate();
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </ProfileCard>
    </div>
  );
};

export default ConnectionsTab;
