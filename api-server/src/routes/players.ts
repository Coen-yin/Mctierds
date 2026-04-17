import { Router } from "express";
import { db } from "@workspace/db";
import { playersTable } from "@workspace/db";
import { eq, ilike, sql } from "drizzle-orm";
import {
  ListPlayersQueryParams,
  CreatePlayerBody,
  GetPlayerParams,
  UpdatePlayerParams,
  UpdatePlayerBody,
  DeletePlayerParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/players", async (req, res) => {
  const parsed = ListPlayersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { gameMode, region, search } = parsed.data;

  let query = db.select().from(playersTable).$dynamic();

  if (region) {
    query = query.where(eq(playersTable.region, region));
  }
  if (search) {
    query = query.where(ilike(playersTable.username, `%${search}%`));
  }

  const players = await query.orderBy(playersTable.rank);

  if (gameMode && gameMode !== "overall") {
    const filtered = players.filter((p) => {
      const tiers = p.tiers as Record<string, string | null>;
      return tiers[gameMode] != null;
    });
    res.json(
      filtered.map((p) => ({
        ...p,
        avatarUrl: p.avatarUrl ?? `https://mc-heads.net/avatar/${p.username}/50`,
      }))
    );
    return;
  }

  res.json(
    players.map((p) => ({
      ...p,
      avatarUrl: p.avatarUrl ?? `https://mc-heads.net/avatar/${p.username}/50`,
    }))
  );
});

router.post("/players", async (req, res) => {
  const parsed = CreatePlayerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;

  const count = await db.select({ count: sql<number>`count(*)` }).from(playersTable);
  const nextRank = Number(count[0].count) + 1;

  const [player] = await db
    .insert(playersTable)
    .values({
      username: data.username,
      points: data.points,
      rank: nextRank,
      region: data.region,
      rankTitle: data.rankTitle,
      avatarUrl: data.avatarUrl ?? null,
      tiers: data.tiers as Record<string, string | null>,
    })
    .returning();

  await recomputeRanks();

  res.status(201).json({
    ...player,
    avatarUrl: player.avatarUrl ?? `https://mc-heads.net/avatar/${player.username}/50`,
  });
});

router.get("/players/:id", async (req, res) => {
  const parsed = GetPlayerParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [player] = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.id, parsed.data.id));

  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }

  res.json({
    ...player,
    avatarUrl: player.avatarUrl ?? `https://mc-heads.net/avatar/${player.username}/50`,
  });
});

router.put("/players/:id", async (req, res) => {
  const paramsParsed = UpdatePlayerParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: paramsParsed.error.message });
    return;
  }
  const bodyParsed = UpdatePlayerBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const data = bodyParsed.data;
  const [player] = await db
    .update(playersTable)
    .set({
      username: data.username,
      points: data.points,
      region: data.region,
      rankTitle: data.rankTitle,
      avatarUrl: data.avatarUrl ?? null,
      tiers: data.tiers as Record<string, string | null>,
      updatedAt: new Date(),
    })
    .where(eq(playersTable.id, paramsParsed.data.id))
    .returning();

  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }

  await recomputeRanks();

  res.json({
    ...player,
    avatarUrl: player.avatarUrl ?? `https://mc-heads.net/avatar/${player.username}/50`,
  });
});

router.delete("/players/:id", async (req, res) => {
  const parsed = DeletePlayerParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await db.delete(playersTable).where(eq(playersTable.id, parsed.data.id));
  await recomputeRanks();

  res.status(204).send();
});

async function recomputeRanks() {
  const players = await db.select().from(playersTable).orderBy(sql`points DESC`);
  for (let i = 0; i < players.length; i++) {
    await db
      .update(playersTable)
      .set({ rank: i + 1 })
      .where(eq(playersTable.id, players[i].id));
  }
}

export default router;
