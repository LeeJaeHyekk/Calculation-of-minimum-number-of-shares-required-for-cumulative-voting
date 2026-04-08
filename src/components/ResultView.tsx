import React from "react";
import styled from "styled-components";

interface ResultViewProps {
  result: number | null;
}

const ResultContainer = styled.div`
  margin-top: 2.5%;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 350px;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    max-width: 300px;
    margin-top: 1.5rem;
  }
`;

const ResultText = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const HighlightedValue = styled.span`
  font-weight: bold;
  color: #007bff;
  font-size: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  if (result === null) return null;

  return (
    <ResultContainer>
      <ResultText>
        필요한 최소 주식 수: <HighlightedValue>{result}</HighlightedValue>
      </ResultText>
    </ResultContainer>
  );
};

export default ResultView;
