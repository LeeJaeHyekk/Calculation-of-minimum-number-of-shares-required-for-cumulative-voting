export interface CumulativeVotingInput {
  totalShares: number; // N
  ownedShares: number; // M
  totalDirectors: number; // T
}

export interface CumulativeVotingResultRow {
  r: number;
  requiredShares: number;
  status: "충족" | "부족";
  diff: number;
}

export interface CumulativeVotingResult {
  rows: CumulativeVotingResultRow[];
  maxGuaranteedSeats: number;
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
    input.totalShares !== undefined &&
    input.ownedShares !== undefined &&
    input.totalDirectors !== undefined &&
    isValidNumber(input.totalShares) &&
    isValidNumber(input.ownedShares) &&
    isValidNumber(input.totalDirectors) &&
    input.totalShares >= 1 &&
    input.ownedShares >= 1 &&
    input.totalDirectors >= 1
  );
}
