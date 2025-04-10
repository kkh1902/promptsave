# Rule: Civitai-style Gallery UI
## Applies to: src/components/**, src/pages/**

## Description:
Create a modern gallery interface like civitai.com with a dark-themed UI and image-based card layout.

## Layout:
- Responsive grid of cards (3-4 columns)
- Sticky navbar with logo, nav links, and search bar
- Optional banner section for announcements or promotions

## Card Design:
- Image preview at top
- Author name and profile icon
- Emoji-style stats (👍 👁 💬 ⭐)
- Rounded corners, dark background, soft shadows
- Framer Motion for hover effects: scale, shadow, icon glow

## Preferred Stack:
- TailwindCSS
- shadcn/ui or Aceternity UI
- Lucide or Heroicons
- Framer Motion

## Accessibility:
- Keyboard-navigable cards
- Alt text on images
- WCAG contrast ratio for dark theme

## Notes:
Avoid unnecessary borders. Use padding and hover styling to create clean spacing. All elements must be mobile responsive.
