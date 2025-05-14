import styled from 'styled-components'

export const Card = styled.div`
  display: inline-block;
  border-radius: ${({ theme }) => theme.spacing(0.5)};

  .ant-image * {
    border-radius: ${({ theme }) => theme.spacing(0.5, 0.5, 0, 0)} !important;
  }

  .ant-card-body {
    padding: ${({ theme }) =>
      theme.breakpoint.lg ? theme.spacing(2) : theme.spacing(1.5, 1)};
  }

  .ant-card-meta-title {
    white-space: initial;
    text-overflow: initial;
    font-size: 14px;
    font-weight: 500;
  }

  .ant-card-meta-description {
    color: ${({ theme }) => theme.palette.gray[6]};
  }

  .ant-image-img {
    max-width: 100%;
    width: auto;
  }
`

export const IconContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
`
