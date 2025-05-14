import styled from 'styled-components'

export const Title = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(1)} !important;
`

export const Container = styled.div`
  display: block;
  overflow-x: auto;
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.atom / 2}px;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr:not(:last-child) td {
    border-bottom: ${({ theme }) => theme.border};
  }

  td {
    padding: ${({ theme }) => theme.spacing(1, 2)};
    vertical-align: top;
    word-break: keep-all;

    &:not(:last-child) {
      border-right: ${({ theme }) => theme.border};
    }
  }
`

export const Td = styled.td<{ $isLeft: boolean; $isRight: boolean }>`
  text-align: ${({ $isLeft, $isRight }) => {
    if ($isLeft && $isRight) {
      return 'center'
    }

    if ($isRight) {
      return 'right'
    }

    return 'left'
  }};
`
