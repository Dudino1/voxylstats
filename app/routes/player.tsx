import { Grid, Typography } from "@mui/material";
import { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import invariant from "tiny-invariant";
import getGameStats, { GameStats } from "~/serverMethods/getGameStats";
import getOverallStats, { OverallStats } from "~/serverMethods/getOverallStats";
import getPlayerInfo, { PlayerInfo } from "~/serverMethods/getPlayerInfo";
import getUuid from "~/serverMethods/getUuid";
import PlayerDisplay from "~/components/player/PlayerDisplay";
import GameDisplay from "~/components/player/GameDisplay";

export let meta: MetaFunction = ({ data: { playerInfo } }) => {
  return {
    title: "Voxyl Player Stats",
    description: `Statistics for ${playerInfo.lastLoginName}`,
  };
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

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs>
          <PlayerDisplay uuid={uuid} username={playerInfo.lastLoginName} />
        </Grid>
        <Grid item xs>
          <Typography variant="body1">
            we gonna put like guild info and exp ({overallStats.exp}) and levels
            ({overallStats.level}) here or somethign maybe??? but in hte
            meantime, Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse ornare, erat at fermentum volutpat, mauris nunc
            ullamcorper justo, eget porttitor metus erat eget augue. Nullam
            vehicula accumsan magna, vel lobortis magna laoreet eget. Nunc
            laoreet sapien ut scelerisque tempor. Aenean eleifend risus sit amet
            blandit volutpat. Nulla facilisi. Quisque quis fringilla mi.
            Vestibulum in vulputate metus.
          </Typography>
        </Grid>
      </Grid>
      <GameDisplay gameStats={gameStats} />
    </>
  );
}
