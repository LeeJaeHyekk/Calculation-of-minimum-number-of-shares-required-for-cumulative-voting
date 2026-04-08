import type {
  CumulativeVotingResult,
  CumulativeVotingResultRow,
} from "./types.js";

function validatePositiveInteger(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 1 || !Number.isInteger(value)) {
    throw new Error(`${name}은 1 이상의 정수여야 합니다.`);
  }
}

export function calculateRequiredShares(
  totalShares: number,
  totalDirectors: number,
  r: number,
): number {
  validatePositiveInteger(totalShares, "총 의결권 주식수(N)");
  validatePositiveInteger(totalDirectors, "선임할 이사 수(T)");
  validatePositiveInteger(r, "보장 의석 수(r)");

  if (r > totalDirectors) {
    throw new Error("보장 의석 수(r)는 선임할 이사 수(T) 이하이어야 합니다.");
  }

  return Math.floor((totalShares * r) / (totalDirectors + 1)) + 1;
}

export function generateResults(
  totalShares: number,
  ownedShares: number,
  totalDirectors: number,
): CumulativeVotingResult {
  validatePositiveInteger(totalShares, "총 의결권 주식수(N)");
  validatePositiveInteger(ownedShares, "보유 주식수(M)");
  validatePositiveInteger(totalDirectors, "선임할 이사 수(T)");

  const rows: CumulativeVotingResultRow[] = [];
  let maxGuaranteedSeats = 0;

  for (let r = 1; r <= totalDirectors; r += 1) {
    const requiredShares = calculateRequiredShares(
      totalShares,
      totalDirectors,
      r,
    );
    const status = ownedShares >= requiredShares ? "충족" : "부족";
    const diff = ownedShares - requiredShares;

    if (status === "충족") {
      maxGuaranteedSeats = r;
    }

    rows.push({
      r,
      requiredShares,
      status,
      diff,
    });
  }

  return { rows, maxGuaranteedSeats };
}
