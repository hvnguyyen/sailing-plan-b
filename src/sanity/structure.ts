import type { StructureResolver } from 'sanity/structure'
import {
  ImagesIcon, CogIcon, DocumentTextIcon,
  TagIcon, UserIcon, EditIcon,
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
              // Column 2: sub-albums directly — edit parent via ⋯ menu at top of column
              S.documentList()
                .title('Sub-albums')
                .filter('_type == "album" && parentAlbum._ref == $parentId')
                .params({ parentId })
                .initialValueTemplates([
                  S.initialValueTemplateItem('album-child', { parentId }),
                ])
                .menuItems([
                  S.menuItem()
                    .title('Edit parent album')
                    .icon(EditIcon)
                    .showAsAction(false)
                    .action(() => {
                      window.location.href = `/studio/intent/edit/id=${parentId};type=album/`
                    }),
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
