import { describe, expect, it } from "vitest";
import {
  calculateRequiredShares,
  generateResults,
} from "../../src/domain/cumulativeVoting/cumulativeVoting.js";

describe("누적투표 계산 로직", () => {
  it("calculateRequiredShares는 주어진 수식을 정확히 적용해야 합니다", () => {
    expect(calculateRequiredShares(1000, 3, 1)).toBe(251);
    expect(calculateRequiredShares(1000, 3, 2)).toBe(501);
    expect(calculateRequiredShares(1000, 3, 3)).toBe(751);
  });

  it("generateResults는 각 r에 대한 행과 최대 보장 의석을 반환합니다", () => {
    const result = generateResults(1000, 100, 3);

    expect(result.rows).toEqual([
      { r: 1, requiredShares: 251, status: "부족", diff: -151 },
      { r: 2, requiredShares: 501, status: "부족", diff: -401 },
      { r: 3, requiredShares: 751, status: "부족", diff: -651 },
    ]);
    expect(result.maxGuaranteedSeats).toBe(0);
  });

  it("generateResults는 보유 주식 수에 따라 충족 여부를 계산합니다", () => {
    const result = generateResults(1000, 501, 3);

    expect(result.rows[0]).toMatchObject({
      r: 1,
      requiredShares: 251,
      status: "충족",
      diff: 250,
    });
    expect(result.rows[1]).toMatchObject({
      r: 2,
      requiredShares: 501,
      status: "충족",
      diff: 0,
    });
    expect(result.maxGuaranteedSeats).toBe(2);
  });

  describe("입력 검증", () => {
    it("총 의결권 주식수가 1 미만이면 에러를 발생시킵니다", () => {
      expect(() => calculateRequiredShares(0, 3, 1)).toThrow(
        "총 의결권 주식수(N)은 1 이상의 정수여야 합니다.",
      );
    });

    it("선임할 이사 수가 1 미만이면 에러를 발생시킵니다", () => {
      expect(() => calculateRequiredShares(1000, 0, 1)).toThrow(
        "선임할 이사 수(T)은 1 이상의 정수여야 합니다.",
      );
    });

    it("보장 의석 수가 1 미만이면 에러를 발생시킵니다", () => {
      expect(() => calculateRequiredShares(1000, 3, 0)).toThrow(
        "보장 의석 수(r)은 1 이상의 정수여야 합니다.",
      );
    });

    it("보장 의석 수가 선임할 이사 수를 초과하면 에러를 발생시킵니다", () => {
      expect(() => calculateRequiredShares(1000, 3, 4)).toThrow(
        "보장 의석 수(r)는 선임할 이사 수(T) 이하이어야 합니다.",
      );
    });

    it("실수가 입력되면 에러를 발생시킵니다", () => {
      expect(() => calculateRequiredShares(1000.5, 3, 1)).toThrow(
        "총 의결권 주식수(N)은 1 이상의 정수여야 합니다.",
      );
    });

    it("Infinity가 입력되면 에러를 발생시킵니다", () => {
      expect(() => calculateRequiredShares(Infinity, 3, 1)).toThrow(
        "총 의결권 주식수(N)은 1 이상의 정수여야 합니다.",
      );
    });

    it("NaN이 입력되면 에러를 발생시킵니다", () => {
      expect(() => calculateRequiredShares(NaN, 3, 1)).toThrow(
        "총 의결권 주식수(N)은 1 이상의 정수여야 합니다.",
      );
    });
  });

  describe("경계값 테스트", () => {
    it("최소값 입력으로 계산이 정상적으로 동작합니다", () => {
      const result = generateResults(1, 1, 1);
      expect(result.rows[0]).toMatchObject({
        r: 1,
        requiredShares: 1,
        status: "충족",
        diff: 0,
      });
      expect(result.maxGuaranteedSeats).toBe(1);
    });

    it("큰 숫자 입력으로도 정상적으로 계산됩니다", () => {
      const result = generateResults(1000000, 500000, 10);
      expect(result.rows.length).toBe(10);
      expect(result.maxGuaranteedSeats).toBeGreaterThanOrEqual(0);
    });
  });
});
