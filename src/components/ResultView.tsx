import React from "react";
import styled from "styled-components";
import type { CumulativeVotingResultRow } from "../domain/cumulativeVoting/types.js";

interface ResultViewProps {
  rows: CumulativeVotingResultRow[];
  maxGuaranteedSeats: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onBack: () => void;
}

const ResultContainer = styled.div`
  position: relative;
  margin-top: 2.5%;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 820px;
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 100%;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin-top: 1.5rem;
  }
`;

const SummaryText = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 1.5rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ResultTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  table-layout: fixed;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem;
  background: #f8f9fa;
  color: #333;
  border-bottom: 2px solid #e9ecef;
  font-weight: 700;
`;

const TableCell = styled.td`
  padding: 1rem 0.85rem;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
`;

const StatusBadge = styled.span<{ $satisfied: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(props) => (props.$satisfied ? "#0f5132" : "#842029")};
  background: ${(props) => (props.$satisfied ? "#d1e7dd" : "#f8d7da")};
`;

const BackButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: #007bff;
  color: #fff;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #0056b3;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.75rem;
  flex-wrap: wrap;
`;

const PageButton = styled.button<{ $active: boolean }>`
  padding: 0.55rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  background: ${(props) => (props.$active ? "#007bff" : "#ffffff")};
  color: ${(props) => (props.$active ? "#ffffff" : "#495057")};
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.$active ? "#0062cc" : "#f1f3f5")};
  }
`;

const formatNumber = (value: number): string => {
  return value.toLocaleString("ko-KR");
};

const ResultView: React.FC<ResultViewProps> = ({
  rows,
  maxGuaranteedSeats,
  currentPage,
  totalPages,
  onPageChange,
  onBack,
}) => {
  if (!rows || rows.length === 0) return null;

  return (
    <ResultContainer role="region" aria-labelledby="result-summary">
      <BackButton
        type="button"
        className="back-button"
        onClick={onBack}
        aria-label="입력 화면으로 돌아가기"
      >
        ←
      </BackButton>
      <SummaryText id="result-summary">
        보장 가능한 최대 의석 수: {maxGuaranteedSeats}개
      </SummaryText>
      <ResultTable role="table" aria-label="누적투표 계산 결과">
        <thead>
          <tr>
            <TableHeader scope="col">r (보장 의석)</TableHeader>
            <TableHeader scope="col">필요 주식수 (Xn)</TableHeader>
            <TableHeader scope="col">충족 여부</TableHeader>
            <TableHeader scope="col">부족/초과 주식수</TableHeader>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.r} role="row">
              <TableCell role="cell">{row.r}</TableCell>
              <TableCell role="cell">
                {formatNumber(row.requiredShares)}
              </TableCell>
              <TableCell role="cell">
                <StatusBadge
                  $satisfied={row.status === "충족"}
                  aria-label={`${row.status} 상태`}
                >
                  {row.status}
                </StatusBadge>
              </TableCell>
              <TableCell role="cell">{formatNumber(row.diff)}</TableCell>
            </tr>
          ))}
        </tbody>
      </ResultTable>
      <PaginationWrapper
        className="pagination"
        role="navigation"
        aria-label="페이지 네비게이션"
      >
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          return (
            <PageButton
              key={page}
              type="button"
              className={page === currentPage ? "active" : undefined}
              $active={page === currentPage}
              onClick={() => onPageChange(page)}
              aria-label={`페이지 ${page}${page === currentPage ? " (현재 페이지)" : ""}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </PageButton>
          );
        })}
      </PaginationWrapper>
    </ResultContainer>
  );
};

export default ResultView;
