import styled from 'styled-components';

export const Page = styled.section`
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Form = styled.form`
  width: 300px;
  max-width: 100%;

  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 600;
  color: rgb(107, 119, 140);
`;

export const ErrorMessagePlaceholder = styled.div`
  height: 20px;
`;
