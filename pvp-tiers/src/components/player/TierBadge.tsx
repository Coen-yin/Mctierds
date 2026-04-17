import { cn } from "@/lib/utils";

interface TierBadgeProps {
  tier: string | null | undefined;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function TierBadge({ tier, className, size = "md", showLabel = true }: TierBadgeProps) {
  if (!tier || tier === "Unranked") {
    return (
      <div 
        className={cn(
          "inline-flex items-center justify-center rounded-full border tier-badge-unranked shadow-sm",
          size === "sm" ? "px-2 py-0.5 text-[10px]" : size === "md" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
          className
        )}
        title="Unranked"
      >
        {showLabel ? "Unranked" : "-"}
      </div>
    );
  }

  const normalizedTier = tier.toUpperCase();
  const tierClass = `tier-badge-${normalizedTier.toLowerCase()}`;

  return (
    <div 
      className={cn(
        "inline-flex items-center justify-center rounded-full border shadow-sm transition-all duration-300",
        tierClass,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : size === "md" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        normalizedTier.startsWith('H') && "shadow-[0_0_10px_rgba(250,204,21,0.2)] hover:shadow-[0_0_15px_rgba(250,204,21,0.4)]",
        className
      )}
    >
      {normalizedTier}
    </div>
  );
}

// Circular tier badge for compact display (e.g. in tables)
export function CompactTierBadge({ tier, gameMode, className }: { tier: string | null | undefined, gameMode?: string, className?: string }) {
  if (!tier || tier === "Unranked") {
    return (
      <div 
        className={cn("w-6 h-6 rounded-full tier-badge-unranked flex items-center justify-center text-[9px] font-bold shrink-0", className)}
        title={`${gameMode ? gameMode + ': ' : ''}Unranked`}
      >
        -
      </div>
    );
  }

  const normalizedTier = tier.toUpperCase();
  const tierClass = `tier-badge-${normalizedTier.toLowerCase()}`;

  return (
    <div 
      className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 shadow-sm",
        tierClass,
        className
      )}
      title={`${gameMode ? gameMode + ': ' : ''}${normalizedTier}`}
    >
      {normalizedTier.replace('T', '')}
    </div>
  );
}
