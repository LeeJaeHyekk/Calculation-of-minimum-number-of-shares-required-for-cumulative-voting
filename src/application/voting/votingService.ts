import type {
  CumulativeVotingInput,
  CumulativeVotingResult,
} from "./../../domain/cumulativeVoting/types.js";
import { generateResults } from "../../domain/cumulativeVoting/cumulativeVoting.js";

export function generateVotingResults(
  input: CumulativeVotingInput,
): CumulativeVotingResult {
  return generateResults(
    input.totalShares,
    input.ownedShares,
    input.totalDirectors,
  );
}
