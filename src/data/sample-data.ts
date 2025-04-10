export interface GalleryItem {
  id: string
  imageUrl: string
  title: string
  author: string
  authorAvatar: string
  likes: number
  views: number
  comments: number
  rating: number
  borderColor: string
}

export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    imageUrl: "/placeholder.svg",
    title: "Blue Alien Executive",
    author: "Rythak",
    authorAvatar: "/placeholder.svg",
    likes: 2058,
    views: 675,
    comments: 352,
    rating: 4.9,
    borderColor: "border-blue-500",
  },
  {
    id: "2",
    imageUrl: "/placeholder.svg",
    title: "Windmill Island",
    author: "SmallHands",
    authorAvatar: "/placeholder.svg",
    likes: 973,
    views: 357,
    comments: 117,
    rating: 4.8,
    borderColor: "border-green-500",
  },
  {
    id: "3",
    imageUrl: "/placeholder.svg",
    title: "Crystal Cave",
    author: "JPP01",
    authorAvatar: "/placeholder.svg",
    likes: 1377,
    views: 466,
    comments: 148,
    rating: 5.0,
    borderColor: "border-cyan-500",
  },
  {
    id: "4",
    imageUrl: "/placeholder.svg",
    title: "Mystic Portrait",
    author: "artimede",
    authorAvatar: "/placeholder.svg",
    likes: 3030,
    views: 1003,
    comments: 476,
    rating: 4.9,
    borderColor: "border-purple-500",
  },
  {
    id: "5",
    imageUrl: "/placeholder.svg",
    title: "Forest Spirit",
    author: "Soulsmith",
    authorAvatar: "/placeholder.svg",
    likes: 829,
    views: 337,
    comments: 96,
    rating: 4.7,
    borderColor: "border-emerald-500",
  },
  {
    id: "6",
    imageUrl: "/placeholder.svg",
    title: "Cyber Samurai",
    author: "AJ_Artworks",
    authorAvatar: "/placeholder.svg",
    likes: 711,
    views: 322,
    comments: 105,
    rating: 4.8,
    borderColor: "border-red-500",
  },
  {
    id: "7",
    imageUrl: "/placeholder.svg",
    title: "Dark Dragon",
    author: "arenwynn",
    authorAvatar: "/placeholder.svg",
    likes: 1171,
    views: 404,
    comments: 79,
    rating: 5.0,
    borderColor: "border-orange-500",
  },
  {
    id: "8",
    imageUrl: "/placeholder.svg",
    title: "Neon Warrior",
    author: "Nyxerion",
    authorAvatar: "/placeholder.svg",
    likes: 9829,
    views: 711,
    comments: 195,
    rating: 4.9,
    borderColor: "border-pink-500",
  },
] 