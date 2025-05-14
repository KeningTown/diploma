import styled from 'styled-components'
import { Typography } from 'antd'

export const Container = styled.span<{ $inline: boolean }>`
  white-space: nowrap;
  display: ${({ $inline }) => $inline && 'inline-'}flex;
  align-items: center;
  gap: 6px;
  color: inherit;

  > div {
    margin: 0 !important;
    line-height: 0 !important;
    font-size: 12px;
  }
`

export const Link = styled(Typography.Link)``
