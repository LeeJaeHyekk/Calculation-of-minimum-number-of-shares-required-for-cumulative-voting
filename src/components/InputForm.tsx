import React, { useEffect, useState } from "react";
import styled from "styled-components";
import type { CumulativeVotingInput } from "../domain/cumulativeVoting/types.js";

type InputFieldValues = Record<keyof CumulativeVotingInput, string>;

interface InputFormProps {
  input: InputFieldValues;
  onInputChange: (name: keyof CumulativeVotingInput, value: string) => void;
  resetSignal: number;
  onCalculate: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 2rem;

  background: #f1f3f5;
  border-radius: 16px;
  border: 1px solid #dbdbdb;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  max-width: 760px;
  min-width: 320px;
  width: 100%;

  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 350px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    max-width: 300px;
    gap: 1rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1 1 180px;
  min-width: 160px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1.2rem;
  width: 100%;
  flex-wrap: nowrap;

  @media (max-width: 860px) {
    flex-wrap: wrap;
  }
`;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Label = styled.label`
  font-weight: 600;
  color: #262626;
  font-size: 0.85rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem 0.85rem;

  border: 1px solid #dbdbdb;
  border-radius: 8px;

  font-size: 0.95rem;
  background: #fafafa;

  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0095f6;
    background: #fff;
    box-shadow: 0 0 0 1px rgba(0, 149, 246, 0.3);
  }

  &[type="number"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.7rem;
    font-size: 0.9rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  justify-content: center;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;

  border: none;
  border-radius: 8px;

  font-size: 0.95rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  background: ${(props) => (props.$primary ? "#0095f6" : "#d1d5db")};

  color: ${(props) => (props.$primary ? "#ffffff" : "#262626")};

  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$primary ? "#0077cc" : "#e0e0e0")};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const INITIAL_DIRTY_STATE: Record<keyof CumulativeVotingInput, boolean> = {
  totalShares: false,
  ownedShares: false,
  totalDirectors: false,
};

const InputForm: React.FC<InputFormProps> = ({
  input,
  onInputChange,
  resetSignal,
  onCalculate,
  onReset,
  isLoading = false,
}) => {
  const [dirtyState, setDirtyState] =
    useState<Record<keyof CumulativeVotingInput, boolean>>(INITIAL_DIRTY_STATE);

  useEffect(() => {
    setDirtyState(INITIAL_DIRTY_STATE);
  }, [resetSignal]);

  const handleFocus = (name: keyof CumulativeVotingInput) => {
    if (!dirtyState[name]) {
      onInputChange(name, "");
      setDirtyState((prev) => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      onInputChange(name as keyof CumulativeVotingInput, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
      e.preventDefault();
    }
  };

  const totalSharesValue = parseInt(input.totalShares, 10);
  const ownedSharesValue = parseInt(input.ownedShares, 10);
  const totalDirectorsValue = parseInt(input.totalDirectors, 10);

  const isCalculateDisabled =
    input.totalShares.trim() === "" ||
    input.ownedShares.trim() === "" ||
    input.totalDirectors.trim() === "" ||
    Number.isNaN(totalSharesValue) ||
    Number.isNaN(ownedSharesValue) ||
    Number.isNaN(totalDirectorsValue) ||
    totalSharesValue < 1 ||
    ownedSharesValue < 1 ||
    totalDirectorsValue < 1;

  return (
    <FormContainer
      className="input-container"
      role="form"
      aria-labelledby="calculator-title"
    >
      <InputRow className="input-row">
        <InputGroup>
          <Label htmlFor="totalShares">총 의결권 주식수 (N):</Label>
          <Input
            id="totalShares"
            type="number"
            name="totalShares"
            value={input.totalShares || ""}
            onChange={handleChange}
            onFocus={() => handleFocus("totalShares")}
            onKeyDown={handleKeyDown}
            min="1"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="1 이상의 정수"
            aria-describedby="totalShares-error"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="ownedShares">보유 주식수 (M):</Label>
          <Input
            id="ownedShares"
            type="number"
            name="ownedShares"
            value={input.ownedShares || ""}
            onChange={handleChange}
            onFocus={() => handleFocus("ownedShares")}
            onKeyDown={handleKeyDown}
            min="1"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="1 이상의 정수"
            aria-describedby="ownedShares-error"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="totalDirectors">선임할 이사 수 (T):</Label>
          <Input
            id="totalDirectors"
            type="number"
            name="totalDirectors"
            value={input.totalDirectors || ""}
            onChange={handleChange}
            onFocus={() => handleFocus("totalDirectors")}
            onKeyDown={handleKeyDown}
            min="1"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="1 이상의 정수"
            aria-describedby="totalDirectors-error"
            required
          />
        </InputGroup>
      </InputRow>
      <ButtonRow className="button-row">
        <ButtonGroup role="group" aria-label="계산 컨트롤">
          <Button
            type="button"
            className="sc-dsLRjI kmSBUe"
            onClick={onCalculate}
            $primary
            disabled={isCalculateDisabled || isLoading}
            aria-describedby="calculate-button-status"
          >
            {isLoading ? "계산 중..." : "계산"}
          </Button>
          <Button
            type="button"
            className="sc-dsLRjI kmSBUe"
            onClick={onReset}
            aria-describedby="reset-button-status"
          >
            초기화
          </Button>
        </ButtonGroup>
      </ButtonRow>
    </FormContainer>
  );
};

export default InputForm;
