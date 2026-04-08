import React from "react";
import styled from "styled-components";

interface ErrorMessageProps {
  error: string | null;
}

const ErrorContainer = styled.div`
  padding: 1rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  max-width: 400px;
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    max-width: 350px;
  }

  @media (max-width: 480px) {
    max-width: 300px;
    padding: 0.8rem;
  }
`;

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return <ErrorContainer>{error}</ErrorContainer>;
};

export default ErrorMessage;
