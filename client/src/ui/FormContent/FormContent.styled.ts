import styled from 'styled-components'

export const Container = styled.div<{
  $inline: boolean
  $noVerticalSpace: boolean
}>`
  margin: ${({ $noVerticalSpace, $inline, theme }) => {
    if ($noVerticalSpace || $inline) {
      return 0
    }

    return theme.spacing(3, 0)
  }};

  .ant-form-item {
    margin-bottom: 0;
  }

  > * {
    position: relative;

    &:empty {
      display: none;
    }
  }
`
