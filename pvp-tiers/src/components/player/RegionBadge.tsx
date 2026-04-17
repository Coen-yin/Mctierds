import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface RegionBadgeProps {
  region: string;
  className?: string;
  showIcon?: boolean;
}

export function RegionBadge({ region, className, showIcon = true }: RegionBadgeProps) {
  const getRegionStyles = (reg: string) => {
    switch (reg.toUpperCase()) {
      case "NA": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "EU": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "AS": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "SA": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "OC": return "bg-teal-500/10 text-teal-400 border-teal-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium uppercase tracking-wider",
      getRegionStyles(region),
      className
    )}>
      {showIcon && <Globe className="w-3 h-3 opacity-70" />}
      {region}
    </div>
  );
}
