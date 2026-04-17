import { motion } from "framer-motion";
import { useGetStatsSummary, useGetTierDistribution, useGetLeaderboard } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Trophy, Users, Globe, TrendingUp, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TierBadge } from "@/components/player/TierBadge";
import { RegionBadge } from "@/components/player/RegionBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const TIER_COLORS: Record<string, string> = {
  HT1: "#FACC15",
  HT2: "#F59E0B",
  HT3: "#FB923C",
  LT1: "#22C55E",
  LT2: "#14B8A6",
  LT3: "#60A5FA",
  LT4: "#94A3B8",
  Unranked: "#374151",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-card/90 backdrop-blur-sm px-4 py-3 shadow-xl">
        <p className="text-sm font-semibold text-white mb-1">{label}</p>
        <p className="text-primary text-sm">{payload[0].value} players</p>
      </div>
    );
  }
  return null;
};

export default function Stats() {
  const { data: summary, isLoading: summaryLoading } = useGetStatsSummary();
  const { data: distribution, isLoading: distLoading } = useGetTierDistribution();
  const { data: leaderboard, isLoading: lbLoading } = useGetLeaderboard({ limit: 5 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const chartData = distribution?.filter((d) => d.count > 0).map((d) => ({
    name: d.tier,
    count: d.count,
    fill: TIER_COLORS[d.tier] ?? "#374151",
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5 mb-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-widest">Analytics</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
              Stats & <span className="text-primary">Analytics</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg">
              Deep insights into the competitive Minecraft PvP landscape.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-16 max-w-6xl">
        {/* Summary Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {summaryLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))
          ) : (
            [
              { label: "Total Players", value: summary?.totalPlayers ?? 0, icon: Users, color: "text-blue-400", bg: "from-blue-500/10 to-blue-500/5" },
              { label: "Ranked Players", value: summary?.totalRanked ?? 0, icon: Trophy, color: "text-primary", bg: "from-primary/10 to-primary/5" },
              { label: "Top Region", value: summary?.topRegion ?? "N/A", icon: Globe, color: "text-green-400", bg: "from-green-500/10 to-green-500/5" },
              { label: "Updated (7d)", value: summary?.recentlyUpdated ?? 0, icon: TrendingUp, color: "text-purple-400", bg: "from-purple-500/10 to-purple-500/5" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={cardVariants}
                  className={`relative rounded-2xl border border-white/5 bg-gradient-to-br ${stat.bg} p-5 overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                    <Icon className="h-full w-full" />
                  </div>
                  <Icon className={`h-5 w-5 ${stat.color} mb-3`} />
                  <div className="text-3xl font-bold text-white font-heading mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Tier Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-3 rounded-2xl border border-white/5 bg-card overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="font-heading text-xl font-bold text-white">Tier Distribution</h2>
              <p className="text-sm text-muted-foreground mt-1">Player count by tier across all modes</p>
            </div>
            <div className="p-6">
              {distLoading ? (
                <Skeleton className="h-64 w-full rounded-xl" />
              ) : chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} barSize={36}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}

              {/* Tier Legend */}
              {!distLoading && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {Object.entries(TIER_COLORS).filter(([t]) => t !== "Unranked").map(([tier, color]) => (
                    <div key={tier} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                      {tier}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Top 5 Players */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-2 rounded-2xl border border-white/5 bg-card overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-white/5">
              <h2 className="font-heading text-xl font-bold text-white">Top Players</h2>
              <p className="text-sm text-muted-foreground mt-1">Elite competitive ranking</p>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {lbLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-4">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))
              ) : leaderboard?.map((entry, idx) => {
                const player = entry.player;
                const tiers = player.tiers as Record<string, string | null>;
                return (
                  <Link
                    key={player.id}
                    href={`/player/${player.id}`}
                    className="flex items-center gap-3 px-6 py-4 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      idx === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black" :
                      idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400 text-black" :
                      idx === 2 ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white" :
                      "bg-white/5 text-muted-foreground"
                    }`}>
                      {idx === 0 ? <Crown className="h-3 w-3" /> : entry.rank}
                    </div>
                    <img
                      src={player.avatarUrl ?? `https://mc-heads.net/avatar/${player.username}/50`}
                      alt={player.username}
                      className="h-9 w-9 rounded-lg object-cover bg-white/5 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${player.username}&background=1a1a2e&color=f5a623&bold=true&size=50`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{player.username}</div>
                      <div className="text-xs text-muted-foreground">{player.points} pts</div>
                    </div>
                    <div className="shrink-0">
                      <TierBadge tier={tiers.overall} size="sm" />
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="px-6 py-4 border-t border-white/5">
              <Link href="/" className="text-sm text-primary hover:underline flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" />
                View full leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
