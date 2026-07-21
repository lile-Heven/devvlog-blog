import { Info, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "warning" | "success" | "tip";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const iconMap: Record<CalloutType, React.ReactNode> = {
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  tip: <Lightbulb className="w-5 h-5" />,
};

const colorMap: Record<CalloutType, string> = {
  info: "border-neon-blue/30 bg-neon-blue/[0.04] text-neon-blue",
  warning: "border-neon-gold/30 bg-neon-gold/[0.04] text-neon-gold",
  success: "border-neon-cyan/30 bg-neon-cyan/[0.04] text-neon-cyan",
  tip: "border-neon-cyan/30 bg-neon-cyan/[0.04] text-neon-cyan",
};

const defaultTitles: Record<CalloutType, string> = {
  info: "Note",
  warning: "Warning",
  success: "Success",
  tip: "Tip",
};

export function Callout({
  type = "info",
  title,
  children,
}: CalloutProps) {
  return (
    <div
      className={cn(
        "border-l-[3px] rounded-r-lg p-4 my-5",
        colorMap[type]
      )}
      role={type === "warning" ? "alert" : undefined}
    >
      <div className="flex items-start gap-3">
        <span className="shrink-0 mt-0.5">{iconMap[type]}</span>
        <div>
          {title !== undefined ? (
            <p className="font-semibold text-sm mb-1">
              {title || defaultTitles[type]}
            </p>
          ) : (
            <p className="font-semibold text-sm mb-1">{defaultTitles[type]}</p>
          )}
          <div className="text-sm text-ink-secondary [&>p]:m-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
