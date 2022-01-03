import { object, number, TypeOf } from "zod";

export type OverallStats = TypeOf<typeof overallStatsSchema>;
const overallStatsSchema = object({
  level: number(),
  exp: number(),
  weightedwins: number(),
});

async function fetchOverallStats(
  api: string,
  uuid: string
): Promise<OverallStats> {
  const url = new URL(
    `/player/stats/overall/${encodeURIComponent(uuid)}`,
    `https://api.voxyl.net/`
  );

  url.searchParams.set("api", api);

  const response = await fetch(url.href).then((resp) => resp.json());
  console.log("getOverallStats", response);
  return overallStatsSchema.parse(response);
}

const MINUTE = 60;

export default async function getOverallStats(
  { API_KEY, VOXYL_CACHE }: CloudflareEnv,
  uuid: string
): Promise<OverallStats> {
  const cacheKey = `overall-stats-${uuid}`;
  let playerInfo = await VOXYL_CACHE.get(cacheKey, { cacheTtl: MINUTE });

  if (playerInfo === null) {
    playerInfo = JSON.stringify(await fetchOverallStats(API_KEY, uuid));
    VOXYL_CACHE.put(cacheKey, playerInfo, { expirationTtl: MINUTE });
  }

  return JSON.parse(playerInfo);
}
