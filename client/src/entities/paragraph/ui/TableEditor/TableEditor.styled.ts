import styled from 'styled-components'

export const Container = styled.div`
  margin: ${({ theme }) => theme.spacing(2, 0)};
`

export const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
`

export const Td = styled.td`
  position: relative;
  vertical-align: top;
  border: 1px solid ${({ theme }) => theme.palette.gray[3]};

  > textarea {
    min-height: 52px;
    border: none;
    box-shadow: none !important;
  }
`

export const AddColumn = styled.div`
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 1;
`

export const AddRow = styled.div`
  position: absolute;
  bottom: -12px;
  left: -12px;
  z-index: 1;
`

export const DeleteColumn = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
`

export const DeleteRow = styled.div`
  position: absolute;
  top: 50%;
  left: -25px;
  transform: translateY(-50%);
`
