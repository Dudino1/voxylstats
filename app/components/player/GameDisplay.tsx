import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
} from "@mui/material";
import { GameStats } from "~/serverMethods/getGameStats";
import { toHeaderCase } from "js-convert-case";

export default function GameDisplay({ gameStats }: { gameStats: GameStats }) {
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
