import React from 'react';
import {useRouter} from 'next/router';
import styled from 'styled-components';

const Title = styled.h1`
  color: red;
  font-size: 50px;
`;

export default () => {
  const router = useRouter();
  return (
    <div>
      <Title>My page is working fine as hell</Title>

      <button onClick={() => router.push('/sign-in')}>Login</button>
    </div>
  );
};
