import { object, number, TypeOf, boolean } from "zod";

const stat = object({
  wins: number().optional(),
  kills: number().optional(),
  beds: number().optional(),
  finals: number().optional(),
});

export type GameStats = TypeOf<typeof gameStatsSchema>;
const gameStatsSchema = object({
  success: boolean(),
  stats: object({}).catchall(stat),
});

async function fetchGameStats(api: string, uuid: string): Promise<GameStats> {
  const url = new URL(
    `/player/stats/game/${encodeURIComponent(uuid)}`,
    `https://api.voxyl.net/`
  );

  url.searchParams.set("api", api);

  const response = await fetch(url.href).then((resp) => resp.json());
  return gameStatsSchema.parse(response);
}

const MINUTE = 60;

export default async function getGameStats(
  { API_KEY, VOXYL_CACHE }: CloudflareEnv,
  uuid: string
): Promise<GameStats> {
  const cacheKey = `game-stats-${uuid}`;
  let playerInfo = await VOXYL_CACHE.get(cacheKey, { cacheTtl: MINUTE });

  if (playerInfo === null) {
    playerInfo = JSON.stringify(await fetchGameStats(API_KEY, uuid));
    VOXYL_CACHE.put(cacheKey, playerInfo, { expirationTtl: MINUTE });
  }

  return JSON.parse(playerInfo);
}
