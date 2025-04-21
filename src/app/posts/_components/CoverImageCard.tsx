'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Keep if MoreVertical button logic is moved here
import { MoreVertical } from 'lucide-react'; // Keep if MoreVertical button logic is moved here

interface CoverImageCardProps {
  imageUrl: string | null | undefined;
  altText: string;
}

export function CoverImageCard({ imageUrl, altText }: CoverImageCardProps) {
  if (!imageUrl) {
    // Render a placeholder if no image URL is provided
    return (
      <Card className="bg-[#232323] border-gray-700 mb-4 overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="aspect-[16/6] bg-gray-800 flex items-center justify-center rounded-lg">
            <p className="text-muted-foreground">이미지가 없습니다</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#232323] border-gray-700 mb-4 overflow-hidden">
      <CardContent className="p-0 relative">
        <div className="relative aspect-[16/6] w-full">
          <Image
            src={imageUrl} 
            alt={altText}
            fill
            className="object-cover"
            unoptimized={imageUrl.startsWith('http')} // Assuming external URLs might not be optimized
          />
          
          {/* Optional: Button can be added here or passed as children/prop */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
            aria-label="추가 작업"
            // onClick={...} // Add onClick handler if needed
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 