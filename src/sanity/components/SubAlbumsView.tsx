'use client'

import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { IntentLink } from 'sanity/router'
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
          <IntentLink
            intent="create"
            params={{ type: 'album', template: 'album-child', parentId: documentId }}
            style={{ textDecoration: 'none' }}
          >
            <Button
              as="span"
              icon={AddIcon}
              text="New sub-album"
              tone="primary"
              mode="ghost"
              fontSize={1}
            />
          </IntentLink>
        </Flex>
        {subAlbums.length === 0 ? (
          <Card padding={4} tone="transparent" border radius={2}>
            <Text size={1} muted>No sub-albums yet.</Text>
          </Card>
        ) : (
          <Stack space={1}>
            {subAlbums.map(album => (
              <IntentLink
                key={album._id}
                intent="edit"
                params={{ id: album._id, type: 'album' }}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <Card
                  padding={3}
                  radius={2}
                  border
                  tone="default"
                  style={{ cursor: 'pointer' }}
                >
                  <Flex align="center" justify="space-between">
                    <Stack space={1}>
                      <Text size={2} weight="medium">{album.title}</Text>
                      {album.location && <Text size={1} muted>{album.location}</Text>}
                    </Stack>
                    <Text muted size={2}><ChevronRightIcon /></Text>
                  </Flex>
                </Card>
              </IntentLink>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
