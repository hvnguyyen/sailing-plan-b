import type { StructureResolver } from 'sanity/structure'
import {
  ImagesIcon, CogIcon, DocumentTextIcon,
  TagIcon, UserIcon, EditIcon, FolderIcon,
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
          // Column 1: only top-level (parent) albums
          S.documentList()
            .title('Albums')
            .filter('_type == "album" && !defined(parentAlbum)')
            .child((parentId) =>
              // Column 2: minimal menu — edit or open sub-albums
              S.list()
                .title('Album')
                .items([
                  S.documentListItem()
                    .id(parentId)
                    .schemaType('album')
                    .title('Edit album')
                    .icon(EditIcon),

                  S.listItem()
                    .title('Sub-albums')
                    .icon(FolderIcon)
                    .child(
                      // Column 3: children — "+" auto-assigns this parent
                      S.documentList()
                        .title('Sub-albums')
                        .filter('_type == "album" && parentAlbum._ref == $parentId')
                        .params({ parentId })
                        .initialValueTemplates([
                          S.initialValueTemplateItem('album-child', { parentId }),
                        ])
                    ),
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
