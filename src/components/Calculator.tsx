import React, { useState } from "react";
import styled from "styled-components";
import { VotingController } from "../controllers/votingController.js";
import type { CumulativeVotingInput } from "../domain/cumulativeVoting/types.js";
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

type DirtyState = Record<keyof CumulativeVotingInput, boolean>;

const INITIAL_INPUT_VALUES: InputValues = {
  targetDirectors: "1",
  totalShares: "1",
  totalDirectors: "1",
};

const INITIAL_DIRTY_STATE: DirtyState = {
  targetDirectors: false,
  totalShares: false,
  totalDirectors: false,
};

const Calculator: React.FC = () => {
  const [inputValues, setInputValues] =
    useState<InputValues>(INITIAL_INPUT_VALUES);
  const [dirtyState, setDirtyState] = useState<DirtyState>(INITIAL_DIRTY_STATE);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const controller = new VotingController();

  const handleInputChange = (
    name: keyof CumulativeVotingInput,
    value: string,
  ) => {
    if (/^\d*$/.test(value)) {
      setInputValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleInputFocus = (name: keyof CumulativeVotingInput) => {
    if (!dirtyState[name]) {
      setInputValues((prev) => ({
        ...prev,
        [name]: "",
      }));
      setDirtyState((prev) => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  const handleCalculate = () => {
    const numericInput: CumulativeVotingInput = {
      targetDirectors: parseInt(inputValues.targetDirectors, 10),
      totalShares: parseInt(inputValues.totalShares, 10),
      totalDirectors: parseInt(inputValues.totalDirectors, 10),
    };

    if (
      Object.values(numericInput).some(
        (value) => Number.isNaN(value) || value < 1,
      )
    ) {
      setResult(null);
      setError("모든 입력은 1 이상의 숫자여야 합니다.");
      return;
    }

    try {
      const minShares = controller.calculateMinShares(numericInput);
      setResult(minShares);
      setError(null);
    } catch (err) {
      setResult(null);
      setError((err as Error).message);
    }
  };

  const handleReset = () => {
    setInputValues(INITIAL_INPUT_VALUES);
    setDirtyState(INITIAL_DIRTY_STATE);
    setResult(null);
    setError(null);
  };

  return (
    <Container>
      <Title>누적투표 계산기</Title>
      <InputForm
        input={inputValues}
        onInputChange={handleInputChange}
        onInputFocus={handleInputFocus}
        onCalculate={handleCalculate}
        onReset={handleReset}
      />
      <ErrorMessage error={error} />
      <ResultView result={result} />
    </Container>
  );
};

export default Calculator;
