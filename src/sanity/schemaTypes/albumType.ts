import React from 'react'
import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'
import { BulkImageUpload } from '../components/BulkImageUpload'

export const albumType = defineType({
  name: 'album',
  title: 'Album',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'parentAlbum',
      title: 'Parent Album',
      type: 'reference',
      to: [{ type: 'album' }],
      description: 'Leave empty for top-level albums (e.g. Norway, Canaries)',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      components: { input: BulkImageUpload },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'location',
              title: 'Location',
              type: 'string',
              description: 'Optional — e.g. "Bryggen, Bergen"',
            }),
          ],
          preview: {
            select: {
              alt: 'alt',
              filename: 'asset->originalFilename',
            },
            prepare({ alt, filename }: Record<string, any>) {
              return {
                title: alt || filename || 'Image',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'file',
              title: 'Video file',
              type: 'file',
              options: { accept: 'video/*' },
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              caption: 'caption',
              filename: 'file.asset->originalFilename',
              url: 'file.asset->url',
            },
            prepare({ caption, filename, url }: { caption?: string; filename?: string; url?: string }) {
              const VideoMedia = url
                ? () => React.createElement('video', {
                    src: `${url}#t=0.001`,
                    preload: 'metadata',
                    muted: true,
                    style: { width: '100%', height: '100%', objectFit: 'cover' },
                  })
                : undefined
              return {
                title: caption || filename || 'Video',
                media: VideoMedia,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'coverImage',
    },
  },
})
