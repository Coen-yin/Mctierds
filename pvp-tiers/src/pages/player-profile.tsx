import { useParams } from "wouter";
import { motion } from "framer-motion";
import { useGetPlayer } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowLeft, Trophy, Globe, Star, Crown, Shield } from "lucide-react";
import { TierBadge } from "@/components/player/TierBadge";
import { RegionBadge } from "@/components/player/RegionBadge";
import { Skeleton } from "@/components/ui/skeleton";

const GAME_MODES = [
  { id: "overall", label: "Overall" },
  { id: "vanilla", label: "Vanilla" },
  { id: "uhc", label: "UHC" },
  { id: "pot", label: "Pot" },
  { id: "nethop", label: "NethOP" },
  { id: "smp", label: "SMP" },
  { id: "sword", label: "Sword" },
  { id: "axe", label: "Axe" },
  { id: "mace", label: "Mace" },
];

const tierPoints: Record<string, number> = {
  HT1: 100,
  HT2: 85,
  HT3: 70,
  LT1: 55,
  LT2: 40,
  LT3: 25,
  LT4: 10,
};

function getTierColor(tier: string | null | undefined): string {
  if (!tier) return "text-muted-foreground";
  if (tier.startsWith("HT1")) return "text-yellow-400";
  if (tier.startsWith("HT2")) return "text-amber-400";
  if (tier.startsWith("HT3")) return "text-orange-400";
  if (tier.startsWith("LT1")) return "text-green-400";
  if (tier.startsWith("LT2")) return "text-teal-400";
  if (tier.startsWith("LT3")) return "text-blue-400";
  if (tier.startsWith("LT4")) return "text-slate-400";
  return "text-muted-foreground";
}

function getTierBarWidth(tier: string | null | undefined): number {
  if (!tier) return 0;
  return tierPoints[tier] ?? 0;
}

export default function PlayerProfile() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0", 10);

  const { data: player, isLoading, error } = useGetPlayer(id, {
    query: { enabled: !!id && !isNaN(id) },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="rounded-2xl border border-white/5 bg-card p-8">
          <div className="flex items-center gap-6 mb-8">
            <Skeleton className="h-24 w-24 rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 text-center">
        <Shield className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Player Not Found</h2>
        <p className="text-muted-foreground mb-6">This player doesn't exist in our database.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Leaderboard
        </Link>
      </div>
    );
  }

  const tiers = player.tiers as Record<string, string | null>;
  const rankedModes = GAME_MODES.filter((m) => tiers[m.id]);
  const avgTier = rankedModes.length > 0
    ? Math.round(rankedModes.reduce((sum, m) => sum + getTierBarWidth(tiers[m.id]), 0) / rankedModes.length)
    : 0;

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="container mx-auto px-4 md:px-6 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Leaderboard
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-white/5 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <div className="relative">
              <img
                src={player.avatarUrl ?? `https://mc-heads.net/avatar/${player.username}/100`}
                alt={player.username}
                className="h-24 w-24 rounded-2xl ring-2 ring-primary/30 shadow-xl shadow-primary/10 object-cover bg-white/5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${player.username}&background=1a1a2e&color=f5a623&bold=true&size=100`;
                }}
              />
              {player.rank <= 3 && (
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-400/30">
                  <Crown className="h-4 w-4 text-black" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">
                  {player.username}
                </h1>
                <RegionBadge region={player.region} />
              </div>
              <p className="text-primary font-medium mb-3">{player.rankTitle}</p>
              <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-white font-semibold">#{player.rank}</span>
                  <span>Global Rank</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-white font-semibold">{player.points}</span>
                  <span>Points</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-white font-semibold">{rankedModes.length}</span>
                  <span>Ranked Modes</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-12 max-w-5xl">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Global Rank", value: `#${player.rank}`, icon: Trophy, color: "text-primary" },
            { label: "Total Points", value: player.points.toString(), icon: Star, color: "text-blue-400" },
            { label: "Ranked Modes", value: `${rankedModes.length}/9`, icon: Shield, color: "text-green-400" },
            { label: "Avg Score", value: `${avgTier}%`, icon: Globe, color: "text-purple-400" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-white/5 bg-card p-5 flex flex-col gap-3"
              >
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <div className="text-2xl font-bold text-white font-heading">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Tier Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-card overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-white/5">
            <h2 className="font-heading text-xl font-bold text-white">Tier Breakdown</h2>
            <p className="text-sm text-muted-foreground mt-1">Ratings across all PvP game modes</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {GAME_MODES.map((mode, idx) => {
              const tier = tiers[mode.id];
              const barWidth = getTierBarWidth(tier);
              const color = getTierColor(tier);

              return (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + idx * 0.04 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-20 text-sm font-medium text-muted-foreground shrink-0">
                    {mode.label}
                  </div>
                  <div className="flex-1">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.6, delay: 0.4 + idx * 0.04, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          tier?.startsWith("HT") ? "from-yellow-500 to-amber-400" :
                          tier?.startsWith("LT1") ? "from-green-600 to-green-400" :
                          tier?.startsWith("LT2") ? "from-teal-600 to-teal-400" :
                          tier?.startsWith("LT3") ? "from-blue-600 to-blue-400" :
                          tier?.startsWith("LT4") ? "from-slate-600 to-slate-400" :
                          "from-slate-800 to-slate-700"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="w-24 flex justify-end">
                    {tier ? (
                      <TierBadge tier={tier} size="sm" />
                    ) : (
                      <span className="text-xs text-muted-foreground/50">Unranked</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
