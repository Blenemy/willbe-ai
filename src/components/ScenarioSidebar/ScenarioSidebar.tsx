"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UseFormReturn } from "react-hook-form";

interface IconItem {
  icon: string;
  label: string;
}

interface Props {
  readonly children: React.ReactNode;
  readonly sidebarContent?: React.ReactNode;
  readonly sidebarIconsWithLabels?: ReadonlyArray<IconItem>;
  readonly collapsedWidth?: number;
  readonly minWidthPx?: number;
  readonly percentageWidth?: number;
  readonly form?: UseFormReturn<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  readonly fieldMap?: Readonly<Record<string, readonly string[]>>;
}

export function ScenarioSidebarLite({
  children,
  sidebarContent,
  sidebarIconsWithLabels = [],
  collapsedWidth = 60,
  minWidthPx = 425,
  percentageWidth = 30,
  fieldMap,
  form,
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

  const watchedValues = form ? form.watch() : {};

  return (
    <div className="flex w-full min-h-[calc(100vh-100px)]">
      <div
        className={cn(
          "bg-white border border-border h-full flex flex-col justify-start rounded-xl overflow-hidden transition-all duration-300",
          isOpen ? "px-4 py-4" : "py-4 px-2 items-center"
        )}
        style={{
          width: isOpen ? `${sidebarWidth}px` : `${collapsedWidth}px`,
        }}
      >
        <div
          className={cn(
            "flex items-center w-full transition-all duration-300",
            isOpen ? "justify-between px-4 py-4" : "justify-center py-4"
          )}
        >
          {isOpen && <h2 className="font-semibold text-lg">Filters</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          {isOpen && sidebarContent}

          {!isOpen && (
            <TooltipProvider>
              <div className="flex flex-col items-center mt-4 gap-2">
                {sidebarIconsWithLabels.map(({ icon, label }) => {
                  const relatedFields = fieldMap?.[label] || [];
                  const isActive = relatedFields.some((fieldName) => {
                    const value = watchedValues?.[fieldName];
                    if (typeof value === "boolean") return value === true;
                    if (Array.isArray(value)) return value.length > 0;
                    return (
                      value !== undefined && value !== null && value !== ""
                    );
                  });

                  return (
                    <Tooltip key={label}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "h-10 w-full flex items-center justify-center rounded",
                            isActive && "border border-green-500"
                          )}
                        >
                          <span
                            className="w-6 h-6 text-xl flex items-center justify-center text-center"
                            style={{
                              fontFamily: "sans-serif",
                              lineHeight: "1",
                            }}
                          >
                            {icon}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">{label}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          )}
        </div>
      </div>

      <div
        className="transition-all duration-300 flex-1"
        style={{
          width: isOpen
            ? `calc(100% - ${sidebarWidth}px)`
            : `calc(100% - ${collapsedWidth}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
