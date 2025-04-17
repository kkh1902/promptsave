"use client"

import { DetailView } from "@/components/detail/detail-view"

// Sample model data
const modelData = {
  id: "wai-nsfw-illustrious-sdxl",
  name: "WAI-NSFW-illustrious-SDXL",
  type: "CHECKPOINT MERGE",
  baseModel: "Illustrious",
  creator: {
    id: "wai0731",
    name: "WAI0731",
    avatar: "/placeholder.svg?height=100&width=100",
    joined: "Dec 23, 2022",
    followers: "16.8K",
  },
  stats: {
    likes: 26500,
    downloads: 356800,
    views: 32400000,
    bookmarks: 6800,
    energy: 23700000,
  },
  versions: [
    { version: "v13.0", isLatest: true },
    { version: "v12.0" },
    { version: "v11.0" },
    { version: "v10.0" },
    { version: "v9.0" },
    { version: "v8.0" },
    { version: "v7.0" },
    { version: "v6.0" },
    { version: "v5.0" },
    { version: "v4.0" },
    { version: "v3.0" },
    { version: "v2.0" },
    { version: "v1.0" },
  ],
  tags: ["BASE MODEL", "ANIME", "SEXY", "HENTAI"],
  updated: "Apr 3, 2025",
  published: "Apr 3, 2025",
  images: [
    {
      id: 1,
      url: "/placeholder.svg?height=600&width=400",
      likes: 2196,
      dislikes: 793,
      comments: 239,
      views: 129000,
    },
    {
      id: 2,
      url: "/placeholder.svg?height=600&width=400",
      likes: 461,
      dislikes: 183,
      comments: 20,
      views: 7000,
    },
  ],
  details: {
    generation: "Buzzing!",
    reviews: "Overwhelmingly Positive (3,226)",
    usageTips: "CLIP SKIP 2",
    hash: "AUTOV2 A810E710A2",
    air: "civitai: 827184 @ 1612720",
  },
  files: [
    {
      name: "Pruned Model fp16",
      size: "6.46 GB",
      verified: true,
      verifiedDays: 7,
      safeTensor: true,
    },
  ],
  license: "Illustrious License",
  description:
    "This is a high-quality anime-style model that excels at creating detailed character illustrations with vibrant colors and dynamic poses. The model is particularly good at rendering complex outfits, facial expressions, and hair details.",
}

export default function ModelDetail() {
  return <DetailView data={modelData} backUrl="/models" />
} 