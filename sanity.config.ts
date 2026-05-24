'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig, type Template} from 'sanity'
import {structureTool} from 'sanity/structure'
import {media} from 'sanity-plugin-media'

import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'
import {heicPlugin} from './src/sanity/plugins/heicPlugin'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
    media(),
    heicPlugin(),
  ],
  // When creating a child album from within a parent folder, auto-assign the parent
  templates: (prev: Template[]) => [
    ...prev,
    {
      id: 'album-child',
      title: 'Sub-album',
      schemaType: 'album',
      parameters: [{ name: 'parentId', type: 'string' }],
      value: ({ parentId }: { parentId: string }) => ({
        parentAlbum: { _type: 'reference', _ref: parentId },
      }),
    },
  ],
})