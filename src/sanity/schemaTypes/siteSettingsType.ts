import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'homepage', title: 'Homepage' },
    { name: 'ulrik', title: 'Ulrik' },
    { name: 'karen', title: 'Karen' },
    { name: 'boat', title: 'Boat' },
    { name: 'about', title: 'About page' },
    { name: 'route', title: 'Route' },
    { name: 'gallery', title: 'Gallery' },
  ],
  fields: [
    // Homepage
    defineField({
      name: 'heroVideo',
      title: 'Homepage — Hero video',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Looping background video. Takes priority over the hero image.',
      group: 'homepage',
    }),
    defineField({
      name: 'heroImage',
      title: 'Homepage — Hero image',
      type: 'image',
      options: { hotspot: true },
      description: 'Background photo shown if no video is set.',
      group: 'homepage',
    }),
    defineField({
      name: 'currentLocation',
      title: 'Homepage — Current location',
      type: 'string',
      description: 'e.g. "Bergen, Norway" — shown in the footer',
      group: 'homepage',
    }),

    // Plan B story
    defineField({
      name: 'planBStoryTitle',
      title: 'About — Plan B story title',
      type: 'string',
      description: 'e.g. "It was always Plan A"',
      group: 'about',
    }),
    defineField({
      name: 'planBStoryText',
      title: 'About — Plan B story text',
      type: 'text',
      rows: 4,
      group: 'about',
    }),

    // Ulrik
    defineField({
      name: 'ulrikImage',
      title: 'Ulrik — Photo',
      type: 'image',
      options: { hotspot: true },
      group: 'ulrik',
    }),
    defineField({
      name: 'ulrikName',
      title: 'Ulrik — Full name',
      type: 'string',
      group: 'ulrik',
    }),
    defineField({
      name: 'ulrikBirthLabel',
      title: 'Ulrik — Birth label',
      type: 'string',
      description: 'e.g. "Born 10 Sep 2001 · Age 24"',
      group: 'ulrik',
    }),
    defineField({
      name: 'ulrikBio',
      title: 'Ulrik — Bio',
      type: 'text',
      rows: 4,
      group: 'ulrik',
    }),
    defineField({
      name: 'ulrikInstagram',
      title: 'Ulrik — Instagram URL',
      type: 'url',
      group: 'ulrik',
    }),

    // Karen
    defineField({
      name: 'karenImage',
      title: 'Karen — Photo',
      type: 'image',
      options: { hotspot: true },
      group: 'karen',
    }),
    defineField({
      name: 'karenName',
      title: 'Karen — Full name',
      type: 'string',
      group: 'karen',
    }),
    defineField({
      name: 'karenBirthLabel',
      title: 'Karen — Birth label',
      type: 'string',
      description: 'e.g. "Born 11 Nov 2002 · Age 23"',
      group: 'karen',
    }),
    defineField({
      name: 'karenBio',
      title: 'Karen — Bio',
      type: 'text',
      rows: 4,
      group: 'karen',
    }),
    defineField({
      name: 'karenInstagram',
      title: 'Karen — Instagram URL',
      type: 'url',
      group: 'karen',
    }),

    // Boat
    defineField({
      name: 'boatImage',
      title: 'Boat — Photo',
      type: 'image',
      options: { hotspot: true },
      group: 'boat',
    }),
    defineField({
      name: 'boatTitle',
      title: 'Boat — Title',
      type: 'string',
      description: 'e.g. "A 1984 Najad 343"',
      group: 'boat',
    }),
    defineField({
      name: 'boatDescription',
      title: 'Boat — Description',
      type: 'text',
      rows: 4,
      group: 'boat',
    }),

    // Route
    defineField({
      name: 'routeItems',
      title: 'Route',
      type: 'array',
      group: 'route',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'time', title: 'Time', type: 'string' }),
            defineField({ name: 'place', title: 'Place', type: 'string' }),
            defineField({ name: 'desc', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'place', subtitle: 'time' },
          },
        },
      ],
    }),

    // Gallery
    defineField({
      name: 'homeGallery',
      title: 'Home Gallery',
      description: 'Images that appear on the front page when scrolling',
      type: 'array',
      group: 'gallery',
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
