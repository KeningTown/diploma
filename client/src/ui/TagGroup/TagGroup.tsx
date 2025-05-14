import React from 'react'

import { TagGroupProps } from './TagGroup.types'

import ButtonModal from '../ButtonModal/ButtonModal'

import * as Styled from './TagGroup.styled'

const TagGroup: React.FC<TagGroupProps> = ({
  addModalHidden,
  addModal,
  children
}) => {
  return (
    <Styled.Container>
      {children}
      {!addModalHidden && addModal && (
        <ButtonModal size="small" type="text" icon="plus" modal={addModal} />
      )}
    </Styled.Container>
  )
}

export default TagGroup
