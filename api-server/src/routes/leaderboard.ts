import { Router } from "express";
import { db } from "@workspace/db";
import { playersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  GetLeaderboardQueryParams,
  GetTierDistributionQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/leaderboard", async (req, res) => {
  const parsed = GetLeaderboardQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { gameMode, limit = 50 } = parsed.data;

  let players = await db
    .select()
    .from(playersTable)
    .orderBy(sql`points DESC`)
    .limit(limit);

  if (gameMode && gameMode !== "overall") {
    players = players.filter((p) => {
      const tiers = p.tiers as Record<string, string | null>;
      return tiers[gameMode] != null;
    });
  }

  const leaderboard = players.map((p, idx) => ({
    rank: idx + 1,
    player: {
      ...p,
      avatarUrl: p.avatarUrl ?? `https://mc-heads.net/avatar/${p.username}/50`,
    },
    score: p.points,
  }));

  res.json(leaderboard);
});

router.get("/stats/summary", async (_req, res) => {
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(playersTable);

  const ranked = await db
    .select({ count: sql<number>`count(*)` })
    .from(playersTable)
    .where(sql`points > 0`);

  const regionResult = await db
    .select({
      region: playersTable.region,
      count: sql<number>`count(*)`,
    })
    .from(playersTable)
    .groupBy(playersTable.region)
    .orderBy(sql`count(*) DESC`)
    .limit(1);

  const recentResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(playersTable)
    .where(sql`updated_at > now() - interval '7 days'`);

  res.json({
    totalPlayers: Number(total),
    totalRanked: Number(ranked[0]?.count ?? 0),
    topRegion: regionResult[0]?.region ?? "NA",
    recentlyUpdated: Number(recentResult[0]?.count ?? 0),
  });
});

router.get("/stats/tier-distribution", async (req, res) => {
  const parsed = GetTierDistributionQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { gameMode = "overall" } = parsed.data;

  const players = await db.select().from(playersTable);

  const tierCounts: Record<string, number> = {};
  const tierOrder = ["HT1", "HT2", "HT3", "LT1", "LT2", "LT3", "LT4", "Unranked"];

  for (const tier of tierOrder) {
    tierCounts[tier] = 0;
  }

  for (const player of players) {
    const tiers = player.tiers as Record<string, string | null>;
    const tier = tiers[gameMode] ?? "Unranked";
    if (tierCounts[tier] !== undefined) {
      tierCounts[tier]++;
    } else {
      tierCounts["Unranked"]++;
    }
  }

  const distribution = tierOrder.map((tier) => ({
    tier,
    count: tierCounts[tier] ?? 0,
  }));

  res.json(distribution);
});

export default router;
