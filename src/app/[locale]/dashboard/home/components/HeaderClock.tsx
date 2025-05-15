"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import clockBackground from "@/assets/home_clock_background.png";
import Image from "next/image";

const salesSentences = [
  "Keep pushing towards your quota!",
  "Follow up on yesterday’s leads!",
  "Your next big deal is just one call away!",
  "Consistency is key to conversion!",
  "Every ‘no’ brings you closer to a ‘yes’!",
];

export default function HeaderClock() {
  const [time, setTime] = useState("");
  const [sentence, setSentence] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    setSentence(
      salesSentences[Math.floor(Math.random() * salesSentences.length)]
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-[#030A27] text-white w-full relative rounded-2xl">
      <Image
        src={clockBackground}
        alt="wave"
        className="absolute top-0 left-0 w-full h-full"
      />
      <CardHeader className="flex items-center justify-center flex-col gap-2">
        <CardTitle className="text-6xl font-semibold">{time}</CardTitle>
        <p className="text-lg mt-2">Welcome back, Jacob 😊</p>
        <p className="text-sm text-muted mt-1">{sentence}</p>
      </CardHeader>
    </Card>
  );
}
