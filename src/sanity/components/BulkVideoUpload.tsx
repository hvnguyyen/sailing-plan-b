'use client'

import { useCallback, useState } from 'react'
import { useClient, insert, PatchEvent } from 'sanity'
import { Stack, Flex, Text, Spinner } from '@sanity/ui'
import { UploadIcon } from '@sanity/icons'

const BATCH_SIZE = 2

export function BulkVideoUpload(props: any) {
  const client = useClient({ apiVersion: '2024-05-01' })
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
            const asset = await client.assets.upload('file', file, { filename: file.name })
            return {
              _type: 'object',
              _key: crypto.randomUUID(),
              file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } },
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
      {uploading ? (
        <Flex align="center" gap={2} padding={2}>
          <Spinner />
          <Text size={1} muted>
            Laster opp {progress.done} / {progress.total}...
          </Text>
        </Flex>
      ) : (
        <label style={{ position: 'relative', display: 'block' }}>
          <input
            type="file"
            multiple
            accept="video/*"
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
            onChange={handleUpload}
          />
          <Flex
            align="center"
            gap={2}
            padding={3}
            style={{ border: '1px solid var(--card-border-color)', borderRadius: 3, cursor: 'pointer' }}
          >
            <UploadIcon />
            <Text size={1}>Upload multiple videos</Text>
          </Flex>
        </label>
      )}
    </Stack>
  )
}
