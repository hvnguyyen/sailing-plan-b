import type { StructureResolver } from 'sanity/structure'
import {
  ImagesIcon, CogIcon, DocumentTextIcon,
  TagIcon, UserIcon,
} from '@sanity/icons'
import { SubAlbumsView } from './components/SubAlbumsView'

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
          S.documentList()
            .title('Albums')
            .filter('_type == "album" && !defined(parentAlbum)')
            .child((parentId) =>
              S.document()
                .schemaType('album')
                .documentId(parentId)
                .views([
                  S.view.form(),
                  S.view.component(SubAlbumsView).title('Sub-albums').icon(ImagesIcon),
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
