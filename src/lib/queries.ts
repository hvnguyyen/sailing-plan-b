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
    "mainImageLqip": mainImage.asset->metadata.lqip,
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
    "mainImageLqip": mainImage.asset->metadata.lqip,
    "mainImageDimensions": mainImage.asset->metadata.dimensions,
    body,
    "categories": categories[]->title,
    "author": author->{ name, image },
  }
`


export const albumsQuery = groq`
  *[_type == "album" && !defined(parentAlbum)] | order(_createdAt desc) {
    _id,
    title,
    slug,
    location,
    coverImage,
    "coverLqip": coverImage.asset->metadata.lqip,
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
    "coverLqip": coverImage.asset->metadata.lqip,
    description,
    "parentAlbum": parentAlbum->{ title, "slug": slug.current },
    "videos": videos[defined(file.asset)] {
      "url": file.asset->url,
    },
    "images": images[defined(asset)] {
      asset,
      "lqip": asset->metadata.lqip,
    },
    "subAlbums": *[_type == "album" && references(^._id)] | order(date asc) {
      _id,
      title,
      slug,
      location,
      date,
      coverImage,
      "coverLqip": coverImage.asset->metadata.lqip,
      "imageCount": count(images),
    },
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    "heroVideoUrl": heroVideo.asset->url,
    heroImage,
    "heroImageLqip": heroImage.asset->metadata.lqip,
    currentLocation,
    currentLat,
    currentLon,
    currentLocationUpdatedAt,
    ulrikImage,
    "ulrikImageLqip": ulrikImage.asset->metadata.lqip,
    ulrikName,
    ulrikBirthLabel,
    ulrikBio,
    ulrikInstagram,
    karenImage,
    "karenImageLqip": karenImage.asset->metadata.lqip,
    karenName,
    karenBirthLabel,
    karenBio,
    karenInstagram,
    boatImage,
    "boatImageLqip": boatImage.asset->metadata.lqip,
    boatTitle,
    boatDescription,
    routeItems[] { time, place, desc },
    homeGallery[] { asset, alt, "lqip": asset->metadata.lqip },
  }
`