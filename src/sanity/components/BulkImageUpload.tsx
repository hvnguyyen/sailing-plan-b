'use client'

import { useCallback, useRef, useState } from 'react'
import { useClient, insert, PatchEvent } from 'sanity'
import { Button, Stack, Flex, Text, Spinner } from '@sanity/ui'
import { UploadIcon } from '@sanity/icons'

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

      const newItems: any[] = []
      for (const file of files) {
        const asset = await client.assets.upload('image', file, { filename: file.name })
        newItems.push({
          _type: 'image',
          _key: Math.random().toString(36).slice(2),
          asset: { _type: 'reference', _ref: asset._id },
        })
        setProgress((p) => ({ ...p, done: p.done + 1 }))
      }

      props.onChange(PatchEvent.from(insert(newItems, 'after', [-1])))
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
        accept="image/*"
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
