'use client'

import { useCallback, useRef, useState } from 'react'
import { useClient, insert, PatchEvent } from 'sanity'
import { Button, Stack, Flex, Text, Spinner } from '@sanity/ui'
import { UploadIcon } from '@sanity/icons'

const BATCH_SIZE = 5

export function BulkImageUpload(props: any) {
  const client = useClient({ apiVersion: '2024-05-01' })
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (!files.length) return

      setUploading(true)
      setProgress({ done: 0, total: files.length })

      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE)

        const results = await Promise.allSettled(
          batch.map(async (file) => {
            const asset = await client.assets.upload('image', file, { filename: file.name })
            return {
              _type: 'image',
              _key: Math.random().toString(36).slice(2),
              asset: { _type: 'reference', _ref: asset._id },
            }
          }),
        )

        const successful = results
          .filter((r) => r.status === 'fulfilled')
          .map((r) => (r as PromiseFulfilledResult<any>).value)

        if (successful.length > 0) {
          props.onChange(PatchEvent.from(insert(successful, 'after', [-1])))
        }

        setProgress((p) => ({ ...p, done: Math.min(p.done + batch.length, files.length) }))
      }

      setUploading(false)
      e.target.value = ''
    },
    [client, props],
  )

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.heic,.heif"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      {uploading ? (
        <Flex align="center" gap={2} padding={2}>
          <Spinner />
          <Text size={1} muted>
            Laster opp {progress.done} / {progress.total}...
          </Text>
        </Flex>
      ) : (
        <Button
          icon={UploadIcon}
          text="Upload multiple images"
          mode="ghost"
          tone="primary"
          onClick={() => inputRef.current?.click()}
        />
      )}
    </Stack>
  )
}
