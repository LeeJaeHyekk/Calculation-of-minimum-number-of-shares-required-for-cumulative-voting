import type {
  CumulativeVotingInput,
  CumulativeVotingResult,
} from "../domain/cumulativeVoting/types.js";
import { generateVotingResults } from "../application/voting/votingService.js";

export class VotingController {
  calculateVotingResults(input: CumulativeVotingInput): CumulativeVotingResult {
    return generateVotingResults(input);
  }
}
