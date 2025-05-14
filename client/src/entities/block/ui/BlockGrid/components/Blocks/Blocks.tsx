import React, { useEffect } from 'react'
import { FloatButton } from 'antd'

import { BlockProps } from '../../../../model'
import { RecordProps, Record } from '../../../../../record'

import { getInitialBlocks } from './Blocks.constants'

import { useDocumentStore } from '@/store'

import { UseTrackerSettings } from '@/hooks/useTrackerSettings'

import Block from '../../../Block/Block'
import TrackerSettings from '../TrackerSettings/TrackerSettings'

type Props = {
  isRecord: boolean
  documentId?: number
  width: number
  result: RecordProps.Result
  gazes: RecordProps.Gazes
  synonyms: RecordProps.Synonyms
  items: BlockProps.ItemAvailable[]
  updateWords: () => void
} & UseTrackerSettings

const Blocks: React.FC<Props> = ({
  isRecord,
  documentId,
  width,
  result,
  gazes,
  synonyms,
  items,
  trackerSettings,
  trackerSettingsOpened,
  onOpenTrackerSettings,
  onCloseTrackerSettings,
  onApplyTrackerSettings,
  updateWords
}) => {
  const { blocks, setBlocks, clearStore } = useDocumentStore(
    ({ blocks, setBlocks, clearStore }) => ({
      blocks,
      setBlocks,
      clearStore
    })
  )

  useEffect(() => {
    setBlocks(isRecord ? items : getInitialBlocks(items))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, isRecord])

  useEffect(() => {
    updateWords()
  }, [blocks, updateWords])

  useEffect(() => {
    return () => {
      clearStore()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {blocks.map((item) => (
        <Block key={item.id} item={item} isRecord={isRecord} />
      ))}
      {!isRecord && documentId && (
        <FloatButton.Group>
          <TrackerSettings
            state={trackerSettings}
            isOpened={trackerSettingsOpened}
            onOpen={onOpenTrackerSettings}
            onClose={onCloseTrackerSettings}
            onApply={onApplyTrackerSettings}
          />
          <Record.RecordCreate
            documentId={documentId}
            width={width}
            blocks={blocks}
            result={result}
            gazes={gazes}
            synonyms={synonyms}
          />
        </FloatButton.Group>
      )}
    </>
  )
}

const BlocksDefault = React.memo(Blocks)

export default BlocksDefault
