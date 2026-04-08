export interface CumulativeVotingInput {
  targetDirectors: number; // N
  totalShares: number; // S
  totalDirectors: number; // D
}

export interface CumulativeVotingResult {
  minShares: number;
}

// 타입 가드: 숫자인지 확인
export function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

// 입력 검증 함수
export function validateCumulativeVotingInput(
  input: Partial<CumulativeVotingInput>,
): input is CumulativeVotingInput {
  return (
    input.targetDirectors !== undefined &&
    input.totalShares !== undefined &&
    input.totalDirectors !== undefined &&
    isValidNumber(input.targetDirectors) &&
    isValidNumber(input.totalShares) &&
    isValidNumber(input.totalDirectors) &&
    input.targetDirectors >= 1 &&
    input.totalShares >= 1 &&
    input.totalDirectors >= 1 &&
    input.targetDirectors <= input.totalDirectors
  );
}
