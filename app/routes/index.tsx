import {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
  Form,
  ActionFunction,
  useActionData,
} from "remix";
import { useLoaderData } from "remix";
import { Button, Grid, styled, TextField, Typography } from "@mui/material";

export let meta: MetaFunction = () => {
  return {
    title: "Voxyl Stats",
    description: "nice epic!! api!!!",
  };
};

export let links: LinksFunction = () => {
  return [];
};

const Header = styled(Typography)({
  textAlign: "center",
});

export default function Index() {
  return (
    <Form method="get" action="/player">
      <Grid
        container
        flexDirection="column"
        alignItems="stretch"
        justifyContent="center"
        spacing={4}
      >
        <Grid item>
          <Header variant="h2">welcoem to the aweosme... api!!!</Header>
        </Grid>
        <Grid item>
          <TextField
            type="text"
            name="username"
            label="Minecraft Username"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item container justifyContent="center">
          <Button type="submit" variant="contained">
            checc their stats!!1!
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
}
