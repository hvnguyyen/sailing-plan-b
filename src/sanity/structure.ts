import type { StructureResolver } from 'sanity/structure'
import {
  ImagesIcon, CogIcon, DocumentTextIcon,
  TagIcon, UserIcon,
} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([

      S.listItem().title('Posts').icon(DocumentTextIcon)
        .child(S.documentTypeList('post').title('Posts')),

      S.listItem().title('Categories').icon(TagIcon)
        .child(S.documentTypeList('category').title('Categories')),

      S.listItem().title('Authors').icon(UserIcon)
        .child(S.documentTypeList('author').title('Authors')),

      S.divider(),

      S.listItem()
        .title('Albums')
        .icon(ImagesIcon)
        .child(
          // Column 1: top-level albums
          S.documentList()
            .title('Albums')
            .filter('_type == "album" && !defined(parentAlbum)')
            .child((parentId) =>
              // Column 2: parent album + its sub-albums — click any to edit in column 3
              S.documentList()
                .title('Albums')
                .filter('_id == $parentId || (_type == "album" && parentAlbum._ref == $parentId)')
                .params({ parentId })
                .defaultOrdering([{ field: '_createdAt', direction: 'asc' }])
                .initialValueTemplates([
                  S.initialValueTemplateItem('album-child', { parentId }),
                ])
            )
        ),

      S.divider(),

      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

    ])
