import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'ulrikImage',
      title: 'Ulrik — Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'karenImage',
      title: 'Karen — Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'boatImage',
      title: 'Boat — Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'homeGallery',
      title: 'Home Gallery',
      description: 'Images that appear on the front page when scrolling',
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
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})