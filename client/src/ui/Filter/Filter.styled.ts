import styled from 'styled-components'

export const Container = styled.div`
  padding: 3px 4px;
  border: 1px solid ${({ theme }) => theme.palette.gray[3]};
  border-radius: 6px;
`

export const Tag = styled.div`
  user-select: none;
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  background: rgba(0, 0, 0, 0.06);

  &:hover {
    cursor: pointer;
  }
`
