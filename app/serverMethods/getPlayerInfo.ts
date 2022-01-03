import { object, string, number, TypeOf } from "zod";

export type PlayerInfo = TypeOf<typeof playerInfoSchema>;
const playerInfoSchema = object({
  lastLoginName: string(),
  lastLoginTime: number(),
  role: string(),
});

async function fetchPlayerInfo(api: string, uuid: string): Promise<PlayerInfo> {
  const url = new URL(
    `/player/info/${encodeURIComponent(uuid)}`,
    `https://api.voxyl.net/`
  );

  url.searchParams.set("api", api);

  const response = await fetch(url.href).then((resp) => resp.json());
  console.log("getPlayerInfo", response);
  return playerInfoSchema.parse(response);
}

const MINUTE = 60;

export default async function getPlayerInfo(
  { API_KEY, VOXYL_CACHE }: CloudflareEnv,
  uuid: string
): Promise<PlayerInfo> {
  const cacheKey = `player-info-${uuid}`;
  let playerInfo = await VOXYL_CACHE.get(cacheKey, { cacheTtl: MINUTE });

  if (playerInfo === null) {
    playerInfo = JSON.stringify(await fetchPlayerInfo(API_KEY, uuid));
    VOXYL_CACHE.put(cacheKey, playerInfo, { expirationTtl: MINUTE });
  }

  return JSON.parse(playerInfo);
}
