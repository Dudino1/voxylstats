import { Grid, Link, styled, Typography } from "@mui/material";

const PlayerLink = styled(Link)({
  textDecoration: "none",
});

export default function PlayerDisplay({
  uuid,
  username,
}: {
  uuid: string;
  username: string;
}) {
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
