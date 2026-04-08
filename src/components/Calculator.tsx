import React, { useState, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { VotingController } from "../controllers/votingController.js";
import type {
  CumulativeVotingInput,
  CumulativeVotingResult,
} from "../domain/cumulativeVoting/types.js";
import InputForm from "./InputForm.tsx";
import ResultView from "./ResultView.tsx";
import ErrorMessage from "./ErrorMessage.tsx";

const Container = styled.div`
  margin: 0 auto;
  top: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 80%);
  opacity: 0.65;
  padding: 2rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 100vh;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const GlobalStyle = createGlobalStyle`
  .sc-dsLRjI.kmSBUe {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 80%) !important;
    color: #ffffff !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transition: all 0.2s ease;
    width: 200px;
  }

  .sc-dsLRjI.kmSBUe:hover {
    filter: brightness(1.1);
  }

  .sc-dsLRjI.kmSBUe:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    .sc-dsLRjI.kmSBUe {
      width: 150px;
    }
  }

  @media (max-width: 480px) {
    .sc-dsLRjI.kmSBUe {
      width: 120px;
    }
  }

  .back-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 80%);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 8px 14px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back-button:hover {
    filter: brightness(1.1);
  }

  .back-button:active {
    transform: scale(0.97);
  }

  .pagination button.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 80%);
    color: white;
    border: none;
  }
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;

type InputValues = Record<keyof CumulativeVotingInput, string>;

const INITIAL_INPUT_VALUES: InputValues = {
  totalShares: "1",
  ownedShares: "1",
  totalDirectors: "1",
};

const Calculator: React.FC = () => {
  const [inputValues, setInputValues] =
    useState<InputValues>(INITIAL_INPUT_VALUES);
  const [resetSignal, setResetSignal] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [result, setResult] = useState<CumulativeVotingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const controller = new VotingController();

  const handleInputChange = useCallback(
    (name: keyof CumulativeVotingInput, value: string) => {
      // 입력값 sanitization: 숫자만 허용, 최대 길이 제한
      const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 12); // 최대 12자리 숫자

      setInputValues((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    },
    [],
  );

  const handleCalculate = useCallback(async () => {
    const numericInput: CumulativeVotingInput = {
      totalShares: parseInt(inputValues.totalShares, 10),
      ownedShares: parseInt(inputValues.ownedShares, 10),
      totalDirectors: parseInt(inputValues.totalDirectors, 10),
    };

    if (
      Object.values(numericInput).some(
        (value) => Number.isNaN(value) || value < 1,
      )
    ) {
      setResult(null);
      setError("모든 입력은 1 이상의 숫자여야 합니다.");
      setIsCalculated(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 계산 시뮬레이션을 위해 약간의 지연 추가 (실제로는 필요 없음)
      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = controller.calculateVotingResults(numericInput);
      setResult(result);
      setCurrentPage(1);
      setIsCalculated(true);
    } catch (err) {
      setResult(null);
      setError((err as Error).message);
      setIsCalculated(false);
    } finally {
      setIsLoading(false);
    }
  }, [inputValues]);

  const handleReset = useCallback(() => {
    setInputValues(INITIAL_INPUT_VALUES);
    setResetSignal((prev) => prev + 1);
    setResult(null);
    setError(null);
    setIsCalculated(false);
    setCurrentPage(1);
  }, []);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = result
    ? result.rows.slice(startIndex, startIndex + itemsPerPage)
    : [];
  const totalPages = result
    ? Math.max(1, Math.ceil(result.rows.length / itemsPerPage))
    : 1;

  return (
    <Container>
      <GlobalStyle />
      <Title>누적투표 계산기</Title>
      {!isCalculated && (
        <InputForm
          input={inputValues}
          onInputChange={handleInputChange}
          resetSignal={resetSignal}
          onCalculate={handleCalculate}
          onReset={handleReset}
          isLoading={isLoading}
        />
      )}
      <ErrorMessage error={error} />
      {isCalculated && result && (
        <ResultView
          rows={currentItems}
          maxGuaranteedSeats={result.maxGuaranteedSeats}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onBack={() => setIsCalculated(false)}
        />
      )}
    </Container>
  );
};

export default Calculator;
