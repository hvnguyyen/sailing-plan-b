import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

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
    name: 'coordinates',
    title: 'Coordinates',
    type: 'geopoint',
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