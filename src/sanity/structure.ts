import type { StructureResolver } from 'sanity/structure'
import { ImagesIcon, CogIcon, DocumentTextIcon, TagIcon, UserIcon, ImageIcon } from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([

      // Blog
      S.listItem()
        .title('Posts')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('post').title('Posts')),

      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('category').title('Categories')),

      S.listItem()
        .title('Authors')
        .icon(UserIcon)
        .child(S.documentTypeList('author').title('Authors')),

      S.divider(),

      // Gallery — hierarchical albums
      S.listItem()
        .title('Albums')
        .icon(ImagesIcon)
        .child(
          S.documentList()
            .title('Albums')
            .filter('_type == "album" && !defined(parentAlbum)')
            .child((parentId) =>
              S.list()
                .title('Album')
                .items([
                  // Edit the parent album itself
                  S.documentListItem()
                    .id(parentId)
                    .schemaType('album')
                    .title('Edit album'),

                  S.divider(),

                  // Sub-albums under this parent
                  S.listItem()
                    .title('Sub-albums')
                    .icon(ImagesIcon)
                    .child(
                      S.documentList()
                        .title('Sub-albums')
                        .filter('_type == "album" && parentAlbum._ref == $parentId')
                        .params({ parentId })
                    ),
                ])
            )
        ),

      S.listItem()
        .title('Gallery Images')
        .icon(ImageIcon)
        .child(S.documentTypeList('galleryImage').title('Gallery Images')),

      S.divider(),

      // Settings
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
    ])
