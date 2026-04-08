import type { CumulativeVotingInput } from "../domain/cumulativeVoting/types.js";
import { getMinShares } from "../application/voting/votingService.js";

export class VotingController {
  calculateMinShares(input: CumulativeVotingInput): number {
    return getMinShares(input);
  }
}
