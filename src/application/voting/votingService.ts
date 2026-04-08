import type { CumulativeVotingInput } from "./../../domain/cumulativeVoting/types.js";
import { calculateCumulativeVoting } from "../../domain/cumulativeVoting/cumulativeVoting.js";

export function getMinShares(input: CumulativeVotingInput): number {
  const result = calculateCumulativeVoting(input);
  return result.minShares;
}
