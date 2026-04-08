import React from "react";
import styled from "styled-components";

export interface CumulativeVotingInput {
  targetDirectors: number;
  totalShares: number;
  totalDirectors: number;
}

type InputFieldValues = Record<keyof CumulativeVotingInput, string>;

interface InputFormProps {
  input: InputFieldValues;
  onInputChange: (name: keyof CumulativeVotingInput, value: string) => void;
  onInputFocus: (name: keyof CumulativeVotingInput) => void;
  onCalculate: () => void;
  onReset: () => void;
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

  max-width: 400px;
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
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 0.75rem;

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
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const InputForm: React.FC<InputFormProps> = ({
  input,
  onInputChange,
  onInputFocus,
  onCalculate,
  onReset,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // 숫자만 허용
    if (/^\d*$/.test(value)) {
      onInputChange(name as keyof CumulativeVotingInput, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
      e.preventDefault();
    }
  };

  const targetDirectorsValue = parseInt(input.targetDirectors, 10);
  const totalSharesValue = parseInt(input.totalShares, 10);
  const totalDirectorsValue = parseInt(input.totalDirectors, 10);

  const isCalculateDisabled =
    input.targetDirectors.trim() === "" ||
    input.totalShares.trim() === "" ||
    input.totalDirectors.trim() === "" ||
    Number.isNaN(targetDirectorsValue) ||
    Number.isNaN(totalSharesValue) ||
    Number.isNaN(totalDirectorsValue) ||
    targetDirectorsValue < 1 ||
    totalSharesValue < 1 ||
    totalDirectorsValue < 1 ||
    targetDirectorsValue > totalDirectorsValue;

  return (
    <FormContainer>
      <InputGroup>
        <Label>확보하려는 이사 수 (N):</Label>
        <Input
          type="number"
          name="targetDirectors"
          value={input.targetDirectors || ""}
          onChange={handleChange}
          onFocus={() => onInputFocus("targetDirectors")}
          onKeyDown={handleKeyDown}
          min="1"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="1 이상의 정수"
        />
      </InputGroup>
      <InputGroup>
        <Label>총 발행 주식 수 (S):</Label>
        <Input
          type="number"
          name="totalShares"
          value={input.totalShares || ""}
          onChange={handleChange}
          onFocus={() => onInputFocus("totalShares")}
          onKeyDown={handleKeyDown}
          min="1"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="1 이상의 정수"
        />
      </InputGroup>
      <InputGroup>
        <Label>전체 이사 수 (D):</Label>
        <Input
          type="number"
          name="totalDirectors"
          value={input.totalDirectors || ""}
          onChange={handleChange}
          onFocus={() => onInputFocus("totalDirectors")}
          onKeyDown={handleKeyDown}
          min="1"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="1 이상의 정수"
        />
      </InputGroup>
      <ButtonGroup>
        <Button
          type="button"
          onClick={onCalculate}
          $primary
          disabled={isCalculateDisabled}
        >
          계산
        </Button>
        <Button type="button" onClick={onReset}>
          초기화
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default InputForm;
