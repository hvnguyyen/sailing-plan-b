'use client'

import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { Box, Button, Card, Flex, Stack, Text, Spinner } from '@sanity/ui'
import { AddIcon, ChevronRightIcon } from '@sanity/icons'

interface SubAlbum {
  _id: string
  title: string
  location?: string
  date?: string
}

interface Props {
  documentId: string
}

export function SubAlbumsView({ documentId }: Props) {
  const client = useClient({ apiVersion: '2024-05-01' })
  const [subAlbums, setSubAlbums] = useState<SubAlbum[] | null>(null)

  useEffect(() => {
    client
      .fetch<SubAlbum[]>(
        `*[_type == "album" && parentAlbum._ref == $parentId] | order(date asc, title asc) { _id, title, location, date }`,
        { parentId: documentId }
      )
      .then(setSubAlbums)
  }, [client, documentId])

  if (subAlbums === null) {
    return (
      <Flex padding={5} justify="center" align="center">
        <Spinner />
      </Flex>
    )
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Flex align="center" justify="flex-end">
          <Button
            icon={AddIcon}
            text="New sub-album"
            tone="primary"
            mode="ghost"
            fontSize={1}
            onClick={() => {
              window.location.href = `/studio/intent/create/type=album;template=album-child;parentId=${documentId}/`
            }}
          />
        </Flex>
        {subAlbums.length === 0 ? (
          <Card padding={4} tone="transparent" border radius={2}>
            <Text size={1} muted>No sub-albums yet.</Text>
          </Card>
        ) : (
          <Stack space={1}>
            {subAlbums.map(album => (
              <Card
                key={album._id}
                padding={3}
                radius={2}
                border
                tone="default"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  window.location.href = `/studio/intent/edit/id=${album._id};type=album/`
                }}
              >
                <Flex align="center" justify="space-between">
                  <Stack space={1}>
                    <Text size={2} weight="medium">{album.title}</Text>
                    {album.location && <Text size={1} muted>{album.location}</Text>}
                  </Stack>
                  <Text muted size={2}><ChevronRightIcon /></Text>
                </Flex>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
