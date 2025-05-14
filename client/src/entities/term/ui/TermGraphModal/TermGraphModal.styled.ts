import styled from 'styled-components'

export const Container = styled.div`
  top: ${({ theme }) => theme.spacing(2)};
  height: calc(100vh - ${({ theme }) => theme.spacing(2)});

  .ant-modal-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .ant-modal-body {
      flex: 1;
      overflow: hidden;

      > div {
        height: 100%;
      }
    }
  }
`
