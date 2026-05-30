import React from 'react'
import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'
import { BulkImageUpload } from '../components/BulkImageUpload'
import { BulkVideoUpload } from '../components/BulkVideoUpload'

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
          preview: {
            select: {
              asset: 'asset',
              filename: 'asset->originalFilename',
            },
            prepare({ asset, filename }: Record<string, any>) {
              return {
                title: filename || 'Image',
                media: asset ? { _type: 'image', asset } : undefined,
              } as any
            },
          },
        },
      ],
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      components: { input: BulkVideoUpload },
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
          ],
          preview: {
            select: {
              filename: 'file.asset->originalFilename',
              url: 'file.asset->url',
            },
            prepare({ filename, url }: Record<string, any>) {
              const name = filename || (url ? (url as string).split('/').pop()?.split('?')[0] : 'Video')
              const VideoMedia = url
                ? () => React.createElement('video', {
                    src: `${url}#t=0.001`,
                    preload: 'metadata',
                    muted: true,
                    style: { width: '100%', height: '100%', objectFit: 'cover' },
                  })
                : undefined
              return { title: name, media: VideoMedia as any }
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
