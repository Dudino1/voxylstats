import {
  Grid,
  Link,
  styled,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
} from "@mui/material";
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
import { toHeaderCase } from "js-convert-case";
import { useEffect } from "react";

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

const PlayerLink = styled(Link)({
  textDecoration: "none",
});

function PlayerDisplay({ uuid, username }: { uuid: string; username: string }) {
  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      <Grid item>
        <Typography variant="h2" component="h1">
          <PlayerLink href={`https://namemc.com/profile/${uuid}`}>
            {username}
          </PlayerLink>
        </Typography>
      </Grid>
      <Grid item>
        <PlayerLink href={`https://namemc.com/profile/${uuid}`}>
          <img
            src={`https://crafatar.com/renders/body/${uuid}`}
            alt="The player's skin"
          />
        </PlayerLink>
      </Grid>
    </Grid>
  );
}

function GameDisplay({ gameStats }: { gameStats: GameStats }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Player Stats">
        <TableHead>
          <TableRow>
            <TableCell>Game Name</TableCell>
            <TableCell align="right">Wins</TableCell>
            <TableCell align="right">Kills</TableCell>
            <TableCell align="right">Finals</TableCell>
            <TableCell align="right">Beds</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(gameStats.stats).map(
            ([gameName, { wins, kills, finals, beds }]) => (
              <TableRow key={gameName}>
                <TableCell component="th" scope="row">
                  {toHeaderCase(gameName)}
                </TableCell>
                <TableCell align="right">{wins}</TableCell>
                <TableCell align="right">{kills}</TableCell>
                <TableCell align="right">{finals}</TableCell>
                <TableCell align="right">{beds}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

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
            we gonna put like guild info and levels here or somethign maybe???
            but in hte meantime, Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Suspendisse ornare, erat at fermentum volutpat,
            mauris nunc ullamcorper justo, eget porttitor metus erat eget augue.
            Nullam vehicula accumsan magna, vel lobortis magna laoreet eget.
            Nunc laoreet sapien ut scelerisque tempor. Aenean eleifend risus sit
            amet blandit volutpat. Nulla facilisi. Quisque quis fringilla mi.
            Vestibulum in vulputate metus.
          </Typography>
        </Grid>
      </Grid>
      <GameDisplay gameStats={gameStats} />
    </>
  );
}
