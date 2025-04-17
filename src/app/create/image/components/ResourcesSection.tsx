import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, Plus, Trash2 } from "lucide-react";
import { ImageItem } from "./PromptSection";

// ResourcesSection 컴포넌트
interface ResourcesSectionProps {
  selectedImage: ImageItem | null;
  updateImageProperty: <K extends keyof ImageItem>(property: K, value: ImageItem[K]) => void;
  toggleDropdown: (id: string) => void;
}

const ResourcesSection = ({ selectedImage, updateImageProperty, toggleDropdown }: ResourcesSectionProps) => {
  // 체크박스로 선택된 리소스 추적
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('');

  // 리소스 목록
  const resourceOptions = [
    "Civitai", "Rubbrband", "Purplesmart", "Freepik", "A1111", "Adobe Firefly", "AniFusion"
  ];

  // 검색어로 필터링된 리소스 목록
  const filteredResources = resourceOptions.filter(resource => 
    resource.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 체크박스 토글 핸들러
  const handleResourceToggle = (resource: string) => {
    setSelectedResources(prev => {
      if (prev.includes(resource)) {
        return prev.filter(r => r !== resource);
      } else {
        return [...prev, resource];
      }
    });
  };

  // 선택한 모든 리소스 추가 핸들러
  const handleAddResources = () => {
    console.log('handleAddResources 호출됨', { selectedImage, selectedResources });
    
    if (selectedImage && selectedResources.length > 0) {
      // 기존 리소스와 새 리소스 합치기 (중복 제거)
      const newResources = [...new Set([...selectedImage.resources, ...selectedResources])];
      console.log('업데이트할 리소스:', newResources);
      
      // 리소스 업데이트 (직접 업데이트 방식으로 변경)
      if (selectedImage) {
        try {
          updateImageProperty('resources', newResources);
          console.log('리소스 업데이트 성공');
          
          // 선택 목록 초기화 및 드롭다운 닫기
          setSelectedResources([]);
          document.getElementById('resources-dropdown')?.classList.add('hidden');
          
          // 알림창 제거
        } catch (error) {
          console.error('리소스 업데이트 중 오류 발생:', error);
        }
      }
    } else {
      console.log('선택된 이미지 또는 리소스가 없습니다.');
      if (!selectedImage) {
        alert('이미지를 먼저 선택하세요.');
      } else if (selectedResources.length === 0) {
        alert('리소스를 하나 이상 선택하세요.');
      }
    }
  };

  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-md">
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-white">Resources</h3>
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
              toggleDropdown('resources-dropdown');
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            RESOURCE
          </Button>
          <div
            id="resources-dropdown"
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
                Image
              </div>
              {filteredResources.map(resource => (
                <div 
                  key={resource} 
                  className="flex items-center px-2 py-1.5 hover:bg-gray-700 rounded-sm cursor-pointer"
                  onClick={() => handleResourceToggle(resource)}
                >
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#1A1A1A]"
                    onChange={(e) => {
                      e.stopPropagation(); // 이벤트 버블링 방지
                      handleResourceToggle(resource);
                    }}
                    checked={selectedResources.includes(resource)}
                  />
                  <span className="text-sm text-gray-300">{resource}</span>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-gray-700 flex flex-col gap-2">
              {selectedResources.length > 0 && (
                <div className="text-xs text-gray-400 text-center">
                  Show {selectedResources.length} selected
                </div>
              )}
              <Button 
                variant="default" 
                size="sm" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddResources}
                disabled={selectedResources.length === 0}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        {selectedImage && selectedImage.resources.length > 0 ? (
          <div className="space-y-2">
            {selectedImage.resources.map((resource, index) => (
              <div key={index} className="bg-[#232323] p-3 rounded-md flex items-center justify-between">
                <p className="text-gray-300">{resource}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-400"
                  onClick={() => {
                    if (selectedImage) {
                      const updatedResources = [...selectedImage.resources];
                      updatedResources.splice(index, 1);
                      updateImageProperty('resources', updatedResources);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-amber-900/30 border border-amber-800 text-amber-300 p-3 rounded-md">
            <p>
              Install the Civitai Extension for Automatic 1111 Stable Diffusion Web UI to automatically
              detect all the resources used in your images.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesSection;
export type { ResourcesSectionProps }; 