'use client'

import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { usePaneRouter } from 'sanity/structure'
import { Box, Button, Card, Flex, Label, Stack, Text, Spinner } from '@sanity/ui'
import { AddIcon, ChevronRightIcon } from '@sanity/icons'

interface SubAlbum {
  _id: string
  title: string
  location?: string
  date?: string
}

interface Props {
  documentId: string
  document: {
    displayed: {
      _id?: string
      title?: string
      location?: string
    }
  }
}

export function SubAlbumsView({ documentId, document: doc }: Props) {
  const client = useClient({ apiVersion: '2024-05-01' })
  const paneRouter = usePaneRouter()
  const { ChildLink } = paneRouter
  const [subAlbums, setSubAlbums] = useState<SubAlbum[] | null>(null)

  useEffect(() => {
    client
      .fetch<SubAlbum[]>(
        `*[_type == "album" && parentAlbum._ref == $parentId && !(_id in path("drafts.**"))] | order(date asc, title asc) { _id, title, location, date }`,
        { parentId: documentId }
      )
      .then(setSubAlbums)
  }, [client, documentId])

  const handleNewSubAlbum = async () => {
    const newId = crypto.randomUUID()
    await client.create({
      _type: 'album',
      _id: `drafts.${newId}`,
      parentAlbum: { _type: 'reference', _ref: documentId },
    })
    paneRouter.navigateIntent('edit', { id: newId, type: 'album' })
  }

  if (subAlbums === null) {
    return (
      <Flex padding={5} justify="center" align="center">
        <Spinner />
      </Flex>
    )
  }

  const parent = doc.displayed

  return (
    <Box padding={4}>
      <Stack space={4}>

        {/* Parent section */}
        <Stack space={2}>
          <Label size={0} muted>Parent</Label>
          <Card padding={3} radius={2} border tone="transparent">
            <Stack space={1}>
              <Text size={2} weight="medium">{parent.title ?? 'Untitled'}</Text>
              {parent.location && <Text size={1} muted>{parent.location}</Text>}
            </Stack>
          </Card>
        </Stack>

        <Box style={{ borderTop: '1px solid var(--card-border-color)' }} />

        {/* Sub-albums section */}
        <Stack space={2}>
          <Flex align="center" justify="space-between">
            <Label size={0} muted>Sub-albums</Label>
            <Button
              icon={AddIcon}
              text="New"
              tone="primary"
              mode="ghost"
              fontSize={1}
              onClick={handleNewSubAlbum}
            />
          </Flex>

          {subAlbums.length === 0 ? (
            <Card padding={4} tone="transparent" border radius={2}>
              <Text size={1} muted>No sub-albums yet.</Text>
            </Card>
          ) : (
            <Stack space={1}>
              {subAlbums.map(album => (
                <ChildLink key={album._id} childId={album._id}>
                  <Card
                    padding={3}
                    radius={2}
                    border
                    tone="default"
                    as="a"
                    style={{ cursor: 'pointer', textDecoration: 'none', display: 'block' }}
                  >
                    <Flex align="center" justify="space-between">
                      <Stack space={1}>
                        <Text size={2} weight="medium">{album.title}</Text>
                        {album.location && <Text size={1} muted>{album.location}</Text>}
                      </Stack>
                      <Text muted size={2}><ChevronRightIcon /></Text>
                    </Flex>
                  </Card>
                </ChildLink>
              ))}
            </Stack>
          )}
        </Stack>

      </Stack>
    </Box>
  )
}
