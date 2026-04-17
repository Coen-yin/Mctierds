import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetLeaderboard, useListPlayers } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Trophy, Sword, Shield, Zap, Globe, Target, Flame, Crown, Star } from "lucide-react";
import { TierBadge, CompactTierBadge } from "@/components/player/TierBadge";
import { RegionBadge } from "@/components/player/RegionBadge";
import { Skeleton } from "@/components/ui/skeleton";

const GAME_MODES = [
  { id: "overall", label: "Overall", icon: Trophy },
  { id: "vanilla", label: "Vanilla", icon: Sword },
  { id: "uhc", label: "UHC", icon: Shield },
  { id: "pot", label: "Pot", icon: Zap },
  { id: "nethop", label: "NethOP", icon: Globe },
  { id: "smp", label: "SMP", icon: Flame },
  { id: "sword", label: "Sword", icon: Sword },
  { id: "axe", label: "Axe", icon: Target },
  { id: "mace", label: "Mace", icon: Star },
] as const;

type GameMode = typeof GAME_MODES[number]["id"];

const TIER_MODES = ["overall", "vanilla", "uhc", "pot", "nethop", "smp", "sword", "axe", "mace"] as const;

const rankColors: Record<number, string> = {
  1: "from-yellow-400 to-amber-500 text-black shadow-yellow-400/30",
  2: "from-slate-300 to-slate-400 text-black shadow-slate-300/20",
  3: "from-amber-600 to-orange-700 text-white shadow-amber-600/20",
};

export default function Home() {
  const [activeMode, setActiveMode] = useState<GameMode>("overall");
  const [search, setSearch] = useState("");

  const { data: leaderboard, isLoading } = useGetLeaderboard({
    gameMode: activeMode as any,
    limit: 100,
  });

  const { data: searchResults, isLoading: searchLoading } = useListPlayers(
    search.trim().length > 0 ? { search: search.trim() } : undefined
  );

  const displayData = search.trim().length > 0
    ? searchResults?.map((p, idx) => ({ rank: p.rank, player: p, score: p.points }))
    : leaderboard;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,166,35,0.08),transparent_60%)] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-widest">Elite Rankings</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Minecraft PvP<br />
              <span className="text-primary">Tier List</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              The definitive ranking for competitive Minecraft PvP. Track the best players across all game modes.
            </p>

            {/* Search */}
            <div className="relative max-w-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search player..."
                className="h-12 w-full rounded-xl bg-white/5 border border-white/10 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all text-white placeholder:text-muted-foreground"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Game Mode Tabs */}
        {!search && (
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {GAME_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-primary text-black shadow-lg shadow-primary/20"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {mode.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl bg-primary"
                        style={{ zIndex: -1 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="rounded-2xl border border-white/5 bg-card overflow-hidden shadow-xl">
          {/* Table Header */}
          <div className="grid grid-cols-[3rem_1fr_auto_auto] md:grid-cols-[3.5rem_1fr_auto_auto] gap-4 px-4 md:px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">#</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Player</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest hidden sm:block">Region</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Tiers</div>
          </div>

          {/* Rows */}
          {isLoading || searchLoading ? (
            <div className="divide-y divide-white/5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[3rem_1fr_auto_auto] md:grid-cols-[3.5rem_1fr_auto_auto] gap-4 px-4 md:px-6 py-4 items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-10 hidden sm:block" />
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-6 w-6 rounded-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : !displayData || displayData.length === 0 ? (
            <div className="py-20 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No players found</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-white/[0.04]"
            >
              <AnimatePresence mode="popLayout">
                {displayData.map((entry) => {
                  const player = entry.player;
                  const tiers = player.tiers as Record<string, string | null>;
                  const rankNum = entry.rank;
                  const isTopThree = rankNum <= 3;

                  return (
                    <motion.div
                      key={player.id}
                      variants={rowVariants}
                      layout
                      className={`grid grid-cols-[3rem_1fr_auto_auto] md:grid-cols-[3.5rem_1fr_auto_auto] gap-4 px-4 md:px-6 py-4 items-center hover:bg-white/[0.03] transition-all duration-200 cursor-pointer group ${
                        isTopThree ? "bg-white/[0.01]" : ""
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-start">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-transform group-hover:scale-110 ${
                            isTopThree
                              ? `bg-gradient-to-br ${rankColors[rankNum]} shadow-lg`
                              : "bg-white/5 text-muted-foreground"
                          }`}
                        >
                          {rankNum}
                        </div>
                      </div>

                      {/* Player Info */}
                      <Link href={`/player/${player.id}`} className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={player.avatarUrl ?? `https://mc-heads.net/avatar/${player.username}/50`}
                            alt={player.username}
                            className="h-10 w-10 rounded-lg object-cover bg-white/5 ring-1 ring-white/10"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${player.username}&background=1a1a2e&color=f5a623&bold=true&size=50`;
                            }}
                          />
                          {isTopThree && (
                            <div className={`absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-br ${rankColors[rankNum]} flex items-center justify-center`}>
                              <Crown className="h-2.5 w-2.5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white group-hover:text-primary transition-colors truncate">
                            {player.username}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {player.rankTitle} &middot; {player.points} pts
                          </div>
                        </div>
                      </Link>

                      {/* Region */}
                      <div className="hidden sm:flex">
                        <RegionBadge region={player.region} showIcon={false} />
                      </div>

                      {/* Tier Badges */}
                      <div className="flex gap-1 flex-wrap justify-end max-w-[200px]">
                        {TIER_MODES.map((mode) => (
                          tiers[mode] ? (
                            <CompactTierBadge
                              key={mode}
                              tier={tiers[mode]}
                              gameMode={mode}
                            />
                          ) : null
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {displayData && displayData.length > 0 && (
          <p className="text-center text-muted-foreground text-sm mt-6">
            Showing {displayData.length} players
          </p>
        )}
      </div>
    </div>
  );
}
