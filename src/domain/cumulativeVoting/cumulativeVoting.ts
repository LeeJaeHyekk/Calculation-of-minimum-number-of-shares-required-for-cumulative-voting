import type { CumulativeVotingInput, CumulativeVotingResult } from "./types.js";
import { validateCumulativeVotingInput } from "./types.js";

export function calculateCumulativeVoting(
  input: CumulativeVotingInput,
): CumulativeVotingResult {
  if (!validateCumulativeVotingInput(input)) {
    throw new Error(
      "잘못된 입력 값입니다. 모든 값은 1 이상의 유효한 숫자여야 합니다.",
    );
  }

  const { targetDirectors: N, totalShares: S, totalDirectors: D } = input;

  // 추가 검증: 매우 큰 값 방지 (JavaScript Number.MAX_SAFE_INTEGER 고려)
  const MAX_SAFE = Number.MAX_SAFE_INTEGER / 2;
  if (N > MAX_SAFE || S > MAX_SAFE || D > MAX_SAFE) {
    throw new Error("입력 값이 너무 큽니다. 계산할 수 없습니다.");
  }

  // 계산: overflow 방지
  const numerator = N * S;
  if (!Number.isSafeInteger(numerator)) {
    throw new Error("계산 중 overflow가 발생했습니다. 입력 값을 줄여주세요.");
  }

  const denominator = D + 1;
  if (denominator === 0) {
    throw new Error("분모가 0이 될 수 없습니다.");
  }

  const quotient = numerator / denominator;
  if (!Number.isFinite(quotient)) {
    throw new Error("계산 결과가 유효하지 않습니다.");
  }

  const minShares = Math.floor(quotient) + 1;

  // 최종 결과 검증
  if (!Number.isSafeInteger(minShares) || minShares < 1) {
    throw new Error("계산 결과가 유효하지 않습니다.");
  }

  return { minShares };
}

export function getMinShares(input: CumulativeVotingInput): number {
  const result = calculateCumulativeVoting(input);
  return result.minShares;
}
