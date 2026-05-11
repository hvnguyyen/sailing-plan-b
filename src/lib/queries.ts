import { groq } from 'next-sanity'

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    location,
    mainImage,
    "categories": categories[]->title,
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    location,
    mainImage,
    body,
    "categories": categories[]->title,
    "author": author->{ name, image },
  }
`

export const galleryQuery = groq`
  *[_type == "galleryImage"] | order(order asc) {
    _id,
    image,
    caption,
    order,
  }
`

export const albumsQuery = groq`
  *[_type == "album" && !defined(parentAlbum)] | order(_createdAt desc) {
    _id,
    title,
    slug,
    location,
    coverImage,
    description,
    "imageCount": count(images),
    "subAlbumCount": count(*[_type == "album" && references(^._id)]),
  }
`

export const albumBySlugQuery = groq`
  *[_type == "album" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    location,
    date,
    coverImage,
    description,
    "parentAlbum": parentAlbum->{ title },
    images[] {
      asset,
      alt,
      caption,
      location,
    },
    "subAlbums": *[_type == "album" && references(^._id)] | order(date asc) {
      _id,
      title,
      slug,
      location,
      date,
      coverImage,
      "imageCount": count(images),
    },
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroSubtitle,
    aboutSubtitle,
    planBStoryTitle,
    planBStoryText,
    ulrikImage,
    ulrikName,
    ulrikBirthLabel,
    ulrikBio,
    ulrikInstagram,
    karenImage,
    karenName,
    karenBirthLabel,
    karenBio,
    karenInstagram,
    boatImage,
    boatTitle,
    boatDescription,
    routeItems[] { time, place, desc },
    homeGallery[] { asset, alt },
  }
`