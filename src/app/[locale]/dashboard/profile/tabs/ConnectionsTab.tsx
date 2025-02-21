"use client";

import { useState } from "react";
import ProfileCard from "./components/ProfileCard";
import { Button } from "@/components/ui/button";

const ConnectionsTab = () => {
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const [emailConnected, setEmailConnected] = useState<
    "none" | "gmail" | "outlook"
  >("none");

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
                onClick={() => setLinkedInConnected(false)}
              >
                Remove
              </Button>
            ) : (
              <Button onClick={() => setLinkedInConnected(true)}>
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
                <Button onClick={() => setEmailConnected("gmail")}>
                  Connect Gmail
                </Button>
                <Button onClick={() => setEmailConnected("outlook")}>
                  Connect Outlook
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setEmailConnected("none")}
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
