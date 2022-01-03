import {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
  Form,
  ActionFunction,
  useActionData,
} from "remix";
import { useLoaderData } from "remix";
import invariant from "tiny-invariant";
import getGameStats, { GameStats } from "~/serverMethods/getGameStats.ts";
import getOverallStats, { OverallStats } from "~/serverMethods/getOverallStats";
import getPlayerInfo, { PlayerInfo } from "~/serverMethods/getPlayerInfo";
import getUuid from "~/serverMethods/getUuid";

export let meta: MetaFunction = () => {
  return {
    title: "remix-worker-template",
    description: "All-in-one remix starter template for Cloudflare Workers",
  };
};

export let links: LinksFunction = () => {
  return [];
};

interface LoaderResponse {
  uuid: string;
  playerInfo: PlayerInfo;
  overallStats: OverallStats;
  gameStats: GameStats;
}

export let loader: LoaderFunction = async ({ request, context }) => {
  const query = new URL(request.url).searchParams;
  const queryUsername = query.get("username");
  const queryUuid = query.get("uuid");

  let uuid = queryUuid;

  if (!uuid) {
    invariant(queryUsername, "expected username");
    uuid = await getUuid(context, queryUsername);
  }

  const [playerInfo, overallStats, gameStats] = await Promise.all([
    getPlayerInfo(context, uuid),
    getOverallStats(context, uuid),
    getGameStats(context, uuid),
  ]);

  return {
    uuid,
    playerInfo,
    overallStats,
    gameStats,
  };
};

export default function Players() {
  const { uuid, playerInfo, overallStats, gameStats } =
    useLoaderData<LoaderResponse>();
  console.log("loader data", playerInfo, overallStats, gameStats);

  return (
    <div>
      <h1>the player is {playerInfo.lastLoginName}</h1>
      <img
        src={`https://crafatar.com/renders/body/${uuid}`}
        alt="The player's skin"
      />
      <p>games</p>
      <ul>
        {Object.entries(gameStats.stats).map(
          ([game, { wins, kills, beds, finals }]) => (
            <li key={game}>
              <span>
                {game}: wins {wins} kills {kills} beds {beds} finals {finals}
              </span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
