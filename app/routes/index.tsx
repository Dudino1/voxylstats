import {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
  Form,
  ActionFunction,
  useActionData,
} from "remix";
import { useLoaderData } from "remix";
import { Grid, Typography } from "@mui/material";

export let meta: MetaFunction = () => {
  return {
    title: "Voxyl Stats",
    description: "nice epic!! api!!!",
  };
};

export let links: LinksFunction = () => {
  return [];
};

export default function Index() {
  return (
    <p>hi</p>
    // <Grid>
    //   <Grid item xs={8} sm={6} md={4} lg={2} xl={1}>
    //     <Typography variant="h2" component="h1">
    //       welcoem to the aweosme... api!!!
    //     </Typography>
    //     <Form method="get" action="/player">
    //       <input type="text" name="username" />
    //     </Form>
    //   </Grid>
    // </Grid>
  );
}
