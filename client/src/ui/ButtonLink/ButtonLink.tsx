import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { router } from '@/services'

import Button, { ButtonProps } from '../Button/Button'

type Props = Omit<ButtonProps, 'type'> & {
  back?: boolean
  to: string
  params?: Record<string, unknown>
}

const ButtonLink: React.FC<Props> = ({
  back,
  to,
  params,
  size = 'small',
  icon,
  ...rest
}) => {
  const path = useMemo(() => router.buildPath(to, params), [params, to])

  return (
    <Link to={path}>
      <Button
        {...rest}
        type="link"
        size={size}
        icon={icon || (back ? 'left' : 'right')}
      />
    </Link>
  )
}

export default ButtonLink
