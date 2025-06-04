"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  collapsedWidth?: number;
  minWidthPx?: number;
  percentageWidth?: number;
}

export function ScenarioSidebarLite({
  children,
  sidebarContent,
  collapsedWidth = 50,
  minWidthPx = 425,
  percentageWidth = 33,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(minWidthPx);

  useEffect(() => {
    const updateWidth = () => {
      const calcWidth = Math.max(
        window.innerWidth * (percentageWidth / 100),
        minWidthPx
      );
      setSidebarWidth(calcWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [percentageWidth, minWidthPx]);

  return (
    <div className="flex w-full min-h-[calc(100vh-100px)]">
      <div
        className={cn(
          "bg-white border border-border h-full flex flex-col justify-start rounded-xl overflow-hidden",
          isOpen ? "px-4 py-4" : "py-4 px-2 items-center"
        )}
        style={{
          width: isOpen ? `${sidebarWidth}px` : `${collapsedWidth}px`,
          transition: "width 300ms ease",
        }}
      >
        <div className="flex items-center justify-between w-full">
          {isOpen && <h2 className="font-semibold text-lg">Filters</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen((prev) => !prev)}
            className="ml-auto"
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>

        {isOpen && sidebarContent && (
          <div className="mt-4 flex flex-col gap-3">{sidebarContent}</div>
        )}
      </div>

      <div
        className="pl-5 transition-all duration-300 flex-1"
        style={{
          width: isOpen
            ? `calc(100% - ${sidebarWidth}px)`
            : `calc(100% - ${collapsedWidth}px)`,
          transition: "width 300ms ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}
