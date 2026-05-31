export interface SanityAsset {
  _ref: string
  _type: string
}

export interface SanityImage {
  _type: 'image'
  asset: SanityAsset
}

export interface GalleryImage {
  asset: SanityAsset
  alt?: string
  lqip?: string
}

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt?: string
  location?: string
  mainImage?: SanityImage
  mainImageLqip?: string
  categories?: string[]
}

export interface PostDetail extends Post {
  mainImageDimensions?: { width: number; height: number }
  body: any[]
  author?: { name: string; image?: SanityImage }
}

export interface Album {
  _id: string
  title: string
  slug: { current: string }
  location?: string
  coverImage?: SanityImage
  coverLqip?: string
  description?: string
  imageCount: number
  videoCount: number
  subAlbumCount: number
}

export interface SubAlbum {
  _id: string
  title: string
  slug: { current: string }
  location?: string
  date?: string
  coverImage?: SanityImage
  coverLqip?: string
  imageCount: number
  videoCount: number
}

export interface AlbumDetail {
  _id: string
  title: string
  slug: { current: string }
  location?: string
  date?: string
  coverImage?: SanityImage
  coverLqip?: string
  description?: string
  parentAlbum?: { title: string; slug: string }
  videos: Array<{ url: string }>
  images: Array<{ asset: SanityAsset; lqip?: string }>
  subAlbums: SubAlbum[]
}

export interface RouteItem {
  time: string
  place: string
  desc?: string
}

export interface SiteSettings {
  heroVideoUrl?: string
  heroImage?: SanityImage
  heroImageLqip?: string
  currentLocation?: string
  currentLat?: number
  currentLon?: number
  currentLocationUpdatedAt?: string
  ulrikImage?: SanityImage
  ulrikImageLqip?: string
  ulrikName?: string
  ulrikBirthLabel?: string
  ulrikBio?: string
  ulrikInstagram?: string
  karenImage?: SanityImage
  karenImageLqip?: string
  karenName?: string
  karenBirthLabel?: string
  karenBio?: string
  karenInstagram?: string
  boatImage?: SanityImage
  boatImageLqip?: string
  boatTitle?: string
  boatDescription?: string
  routeItems?: RouteItem[]
  homeGallery?: GalleryImage[]
}
