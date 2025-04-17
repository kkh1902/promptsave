'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsCardProps {
  tableOfContents: TocItem[];
  warning?: string | null;
  onScrollToHeader: (id: string, e: React.MouseEvent) => void;
}

export function TableOfContentsCard({ 
  tableOfContents, 
  warning, 
  onScrollToHeader 
}: TableOfContentsCardProps) {
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  return (
    <Card className="bg-[#1a1a1a] border-gray-700 rounded-xl overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Simple list icon */}
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="font-semibold text-white text-sm">목차</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
            onClick={() => setIsTableExpanded(!isTableExpanded)}
            aria-label={isTableExpanded ? "목차 접기" : "목차 펼치기"}
          >
            <ChevronDown className={`h-3 w-3 transition-transform ${isTableExpanded ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {isTableExpanded && (
          <nav className="space-y-1 text-xs max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Optional Warning Message */}
            {warning && (
              <div className="text-red-400 mb-1 p-1.5 bg-red-900/20 rounded-lg text-xs">
                {warning}
              </div>
            )}
            
            {/* Special Top Item Example (can be made dynamic if needed) */}
            <a 
              href="#" // This might need a specific handler or ID if it should scroll
              onClick={(e) => { /* TODO: Handle click for special items if necessary */ }}
              className="block text-white font-medium hover:bg-[#172136] p-1.5 rounded-lg bg-[#1d2c48] border-l-4 border-blue-500"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🔪✨</span>
                <span className="truncate">I KILLED CIVBOT</span>
              </div>
            </a>
            
            {/* Dynamic TOC Items */}
            {tableOfContents.length > 0 ? (
              tableOfContents.map((item, index) => {
                // Emoji logic based on title
                let emoji = "📝";
                if (item.title.toLowerCase().includes("what")) emoji = "💭";
                if (item.title.toLowerCase().includes("why")) emoji = "📋";
                if (item.title.toLowerCase().includes("monetization")) emoji = "🎁";
                if (item.title.toLowerCase().includes("now")) emoji = "❤️";
                
                return (
                  <a 
                    key={item.id || index} // Use item.id if stable, otherwise index
                    href={`#${item.id}`} // Use the ID generated in the parent
                    onClick={(e) => onScrollToHeader(item.id, e)}
                    className={`block text-gray-200 hover:bg-[#172136] p-2 rounded-lg ${item.level === 1 ? 'font-medium' : ''} ${item.level > 1 ? `pl-${(item.level -1) * 2 + 2}` : '' }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{emoji}</span>
                      <span className="truncate">{item.title}</span>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className="text-gray-400 p-2">목차를 생성할 수 없습니다.</div>
            )}
          </nav>
        )}
      </CardContent>
    </Card>
  );
} 