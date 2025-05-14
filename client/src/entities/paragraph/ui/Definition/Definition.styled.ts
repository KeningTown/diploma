import styled from 'styled-components'

export const Container = styled.div`
  margin-top: ${({ theme }) => theme.spacing(-1)};

  .ant-card-head {
    padding: ${({ theme }) => theme.spacing(1)};

    .ant-card-head-title {
      line-height: 1;
      font-weight: normal;

      > span {
        font-size: 14px;
      }
    }
  }

  .ant-card-body {
    padding: ${({ theme }) =>
      theme.breakpoint.lg ? theme.spacing(1, 2) : theme.spacing(1)};
  }
`
