import styled from 'styled-components'

export const Container = styled.div`
  .ant-card-head {
    min-height: initial;
    margin: 0;
    padding: ${({ theme }) =>
      theme.breakpoint.lg ? theme.spacing(2, 3) : theme.spacing(1, 2)};

    .ant-card-head-title {
      white-space: normal;
      overflow: initial;
      text-overflow: initial;
    }
  }

  .ant-card-body {
    padding: ${({ theme }) =>
      theme.breakpoint.lg ? theme.spacing(2, 3) : theme.spacing(2)};
  }
`
