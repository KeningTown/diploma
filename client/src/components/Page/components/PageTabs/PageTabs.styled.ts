import styled from 'styled-components'

export const Container = styled.div`
  /* margin-bottom: ${({ theme }) => theme.spacing(2)}; */
  padding: ${({ theme }) =>
    theme.breakpoint.lg ? theme.spacing(0, 4) : theme.spacing(0, 2)};
  background-color: ${({ theme }) => theme.palette.white};
  border-radius: ${({ theme }) => theme.atom}px;

  .ant-tabs-nav {
    margin: 0;

    &::before {
      border: none;
    }
  }

  .ant-tabs-tab-btn {
    text-shadow: none !important;
  }
`
