'use client'

import { useCallback, useState } from 'react'
import { useClient, insert, PatchEvent } from 'sanity'
import { Stack, Flex, Text, Spinner } from '@sanity/ui'
import { UploadIcon } from '@sanity/icons'

const BATCH_SIZE = 5

async function normalizeFile(file: File): Promise<File> {
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif'
    || /\.(heic|heif)$/i.test(file.name)
  if (!isHeic) return file

  const lib = await import('heic2any')
  const fn = (lib.default ?? lib) as typeof import('heic2any').default
  const converted = await fn({ blob: file, toType: 'image/jpeg', quality: 0.9 })
  const blob = Array.isArray(converted) ? converted[0] : converted
  const jpgName = file.name.replace(/\.(heic|heif)$/i, '.jpg')
  return new File([blob], jpgName, { type: 'image/jpeg' })
}

export function BulkImageUpload(props: any) {
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
            const normalized = await normalizeFile(file)
            const asset = await client.assets.upload('image', normalized, { filename: normalized.name })
            return {
              _type: 'image',
              _key: crypto.randomUUID(),
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
            accept="image/*"
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
            <Text size={1}>Upload multiple images</Text>
          </Flex>
        </label>
      )}
    </Stack>
  )
}
