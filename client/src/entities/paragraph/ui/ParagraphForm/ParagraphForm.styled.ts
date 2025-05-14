import styled from 'styled-components'

export const Container = styled.div`
  width: 480px;
  border-width: 0 0 0 1px;
  border-radius: 0;
  display: flex;
  flex-direction: column;

  .ant-card-body {
    overflow-y: auto;
  }
`

export const Divider = styled.div`
  margin: ${({ theme }) => theme.spacing(3, -3)};
  border-bottom: ${({ theme }) => theme.border};
`

export const Space = styled.div`
  width: 100%;
`

export const TableButtonContainer = styled.div`
  position: absolute;
  right: 12px;
  z-index: 1;
`
