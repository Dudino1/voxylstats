import { object, string, number, TypeOf } from "zod";

const minecraftProfileSchema = object({
  id: string(),
  name: string(),
});

async function fetchUuid(username: string): Promise<string> {
  const response = await fetch(
    `https://api.mojang.com/users/profiles/minecraft/${username}`
  ).then((resp) => resp.json());

  const { id } = minecraftProfileSchema.parse(response);

  return (
    `${id.substring(0, 8)}-${id.substring(8, 12)}-` +
    `${id.substring(12, 16)}-${id.substring(16, 20)}-${id.substring(20, 32)}`
  );
}

const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export default async function getUuid(
  { MINECRAFT_UUIDS }: CloudflareEnv,
  username: string
): Promise<string> {
  let uuid = await MINECRAFT_UUIDS.get(username, {
    cacheTtl: 10 * MINUTE,
  });

  if (uuid === null) {
    uuid = await fetchUuid(username);

    // not awaiting this because we don't really care, just using as a cache
    MINECRAFT_UUIDS.put(username, uuid, {
      expirationTtl: 1 * DAY,
    });
  }

  return uuid;
}
