import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, Plus, Trash2 } from "lucide-react";
import { ImageItem } from "./PromptSection";

// ToolsSection 컴포넌트
interface ToolsSectionProps {
  selectedImage: ImageItem | null;
  updateImageProperty: <K extends keyof ImageItem>(property: K, value: ImageItem[K]) => void;
  toggleDropdown: (id: string) => void;
}

const ToolsSection = ({ selectedImage, updateImageProperty, toggleDropdown }: ToolsSectionProps) => {
  // 체크박스로 선택된 도구 추적
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('');

  // 도구 목록
  const toolOptions = [
    "ComfyUI", "AUTOMATIC1111", "InvokeAI", "Midjourney", "Stable Diffusion", "DreamStudio", 
    "NovelAI", "Dall-E", "RunwayML", "Deforum", "Krita", "Photoshop"
  ];

  // 검색어로 필터링된 도구 목록
  const filteredTools = toolOptions.filter(tool => 
    tool.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 체크박스 토글 핸들러
  const handleToolToggle = (tool: string) => {
    setSelectedTools(prev => {
      if (prev.includes(tool)) {
        return prev.filter(t => t !== tool);
      } else {
        return [...prev, tool];
      }
    });
  };

  // 선택한 모든 도구 추가 핸들러
  const handleAddTools = () => {
    if (selectedImage && selectedTools.length > 0) {
      // 기존 도구와 새 도구 합치기 (중복 제거)
      const newTools = [...new Set([...selectedImage.tools, ...selectedTools])];
      
      // 도구 업데이트
      try {
        updateImageProperty('tools', newTools);
        
        // 선택 목록 초기화 및 드롭다운 닫기
        setSelectedTools([]);
        document.getElementById('tools-dropdown')?.classList.add('hidden');
      } catch (error) {
        console.error('도구 업데이트 중 오류 발생:', error);
      }
    } else {
      if (!selectedImage) {
        alert('이미지를 먼저 선택하세요.');
      } else if (selectedTools.length === 0) {
        alert('도구를 하나 이상 선택하세요.');
      }
    }
  };

  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-md">
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-white">Tools</h3>
          <Button variant="ghost" size="icon" className="ml-1 h-6 w-6 p-0 text-gray-400 hover:text-white">
            <Info className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-400 hover:text-blue-300 border-blue-800"
            onClick={() => {
              toggleDropdown('tools-dropdown');
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            TOOL
          </Button>
          <div
            id="tools-dropdown"
            className="absolute right-0 top-full mt-1 w-60 bg-[#232323] border border-gray-700 rounded-md shadow-lg z-10 hidden"
          >
            <div className="p-2 border-b border-gray-700">
              <Input
                placeholder="Search..."
                className="bg-[#1A1A1A] border-gray-600 text-gray-200 h-8 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="p-1 max-h-56 overflow-y-auto">
              <div className="flex items-center px-2 py-1 text-xs text-gray-400 font-medium">
                AI Tools
              </div>
              {filteredTools.map(tool => (
                <div 
                  key={tool} 
                  className="flex items-center px-2 py-1.5 hover:bg-gray-700 rounded-sm cursor-pointer"
                  onClick={() => handleToolToggle(tool)}
                >
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#1A1A1A]"
                    onChange={(e) => {
                      e.stopPropagation(); // 이벤트 버블링 방지
                      handleToolToggle(tool);
                    }}
                    checked={selectedTools.includes(tool)}
                  />
                  <span className="text-sm text-gray-300">{tool}</span>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-gray-700 flex flex-col gap-2">
              {selectedTools.length > 0 && (
                <div className="text-xs text-gray-400 text-center">
                  {selectedTools.length} selected
                </div>
              )}
              <Button 
                variant="default" 
                size="sm" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddTools}
                disabled={selectedTools.length === 0}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        {selectedImage && selectedImage.tools.length > 0 ? (
          <div className="space-y-2">
            {selectedImage.tools.map((tool, index) => (
              <div key={index} className="bg-[#232323] p-3 rounded-md flex items-center justify-between">
                <p className="text-gray-300">{tool}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-400"
                  onClick={() => {
                    if (selectedImage) {
                      const updatedTools = [...selectedImage.tools];
                      updatedTools.splice(index, 1);
                      updateImageProperty('tools', updatedTools);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No tools added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ToolsSection;
export type { ToolsSectionProps }; 