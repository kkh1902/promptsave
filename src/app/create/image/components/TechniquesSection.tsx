import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, Plus, Trash2 } from "lucide-react";
import { ImageItem } from "./PromptSection";

// TechniquesSection 컴포넌트
interface TechniquesSectionProps {
  selectedImage: ImageItem | null;
  updateImageProperty: <K extends keyof ImageItem>(property: K, value: ImageItem[K]) => void;
  toggleDropdown: (id: string) => void;
}

const TechniquesSection = ({ selectedImage, updateImageProperty, toggleDropdown }: TechniquesSectionProps) => {
  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-md">
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-white">Techniques</h3>
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
              toggleDropdown('techniques-dropdown');
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            TECHNIQUE
          </Button>
          <div
            id="techniques-dropdown"
            className="absolute right-0 top-full mt-1 w-60 bg-[#232323] border border-gray-700 rounded-md shadow-lg z-10 hidden"
          >
            <div className="p-2 border-b border-gray-700">
              <Input
                placeholder="Search..."
                className="bg-[#1A1A1A] border-gray-600 text-gray-200 h-8 text-sm"
              />
            </div>
            <div className="p-1 max-h-56 overflow-y-auto">
              {/* Image 카테고리 */}
              <div className="flex items-center px-2 py-1 text-xs text-gray-400 font-medium">
                Image
              </div>
              <div 
                className="flex items-center px-2 py-1.5 hover:bg-gray-700 rounded-sm cursor-pointer"
                onClick={() => {
                  if (selectedImage) {
                    const hasItem = selectedImage.techniques.includes("txt2img");
                    if (hasItem) {
                      const filtered = selectedImage.techniques.filter(t => t !== "txt2img");
                      updateImageProperty('techniques', filtered);
                    } else {
                      updateImageProperty('techniques', [...selectedImage.techniques, "txt2img"]);
                    }
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#1A1A1A]"
                  onChange={(e) => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    if (selectedImage) {
                      const hasItem = selectedImage.techniques.includes("txt2img");
                      if (hasItem) {
                        const filtered = selectedImage.techniques.filter(t => t !== "txt2img");
                        updateImageProperty('techniques', filtered);
                      } else {
                        updateImageProperty('techniques', [...selectedImage.techniques, "txt2img"]);
                      }
                    }
                  }}
                  checked={selectedImage?.techniques.includes("txt2img") || false}
                />
                <span className="text-sm text-gray-300">txt2img</span>
              </div>
              <div 
                className="flex items-center px-2 py-1.5 hover:bg-gray-700 rounded-sm cursor-pointer"
                onClick={() => {
                  if (selectedImage) {
                    const hasItem = selectedImage.techniques.includes("img2img");
                    if (hasItem) {
                      const filtered = selectedImage.techniques.filter(t => t !== "img2img");
                      updateImageProperty('techniques', filtered);
                    } else {
                      updateImageProperty('techniques', [...selectedImage.techniques, "img2img"]);
                    }
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#1A1A1A]"
                  onChange={(e) => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    if (selectedImage) {
                      const hasItem = selectedImage.techniques.includes("img2img");
                      if (hasItem) {
                        const filtered = selectedImage.techniques.filter(t => t !== "img2img");
                        updateImageProperty('techniques', filtered);
                      } else {
                        updateImageProperty('techniques', [...selectedImage.techniques, "img2img"]);
                      }
                    }
                  }}
                  checked={selectedImage?.techniques.includes("img2img") || false}
                />
                <span className="text-sm text-gray-300">img2img</span>
              </div>
              <div 
                className="flex items-center px-2 py-1.5 hover:bg-gray-700 rounded-sm cursor-pointer"
                onClick={() => {
                  if (selectedImage) {
                    const hasItem = selectedImage.techniques.includes("inpainting");
                    if (hasItem) {
                      const filtered = selectedImage.techniques.filter(t => t !== "inpainting");
                      updateImageProperty('techniques', filtered);
                    } else {
                      updateImageProperty('techniques', [...selectedImage.techniques, "inpainting"]);
                    }
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#1A1A1A]"
                  onChange={(e) => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    if (selectedImage) {
                      const hasItem = selectedImage.techniques.includes("inpainting");
                      if (hasItem) {
                        const filtered = selectedImage.techniques.filter(t => t !== "inpainting");
                        updateImageProperty('techniques', filtered);
                      } else {
                        updateImageProperty('techniques', [...selectedImage.techniques, "inpainting"]);
                      }
                    }
                  }}
                  checked={selectedImage?.techniques.includes("inpainting") || false}
                />
                <span className="text-sm text-gray-300">inpainting</span>
              </div>
              <div 
                className="flex items-center px-2 py-1.5 hover:bg-gray-700 rounded-sm cursor-pointer"
                onClick={() => {
                  if (selectedImage) {
                    const hasItem = selectedImage.techniques.includes("workflow");
                    if (hasItem) {
                      const filtered = selectedImage.techniques.filter(t => t !== "workflow");
                      updateImageProperty('techniques', filtered);
                    } else {
                      updateImageProperty('techniques', [...selectedImage.techniques, "workflow"]);
                    }
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#1A1A1A]"
                  onChange={(e) => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    if (selectedImage) {
                      const hasItem = selectedImage.techniques.includes("workflow");
                      if (hasItem) {
                        const filtered = selectedImage.techniques.filter(t => t !== "workflow");
                        updateImageProperty('techniques', filtered);
                      } else {
                        updateImageProperty('techniques', [...selectedImage.techniques, "workflow"]);
                      }
                    }
                  }}
                  checked={selectedImage?.techniques.includes("workflow") || false}
                />
                <span className="text-sm text-gray-300">workflow</span>
              </div>

              {/* Video 카테고리 */}
              <div className="flex items-center px-2 py-1 mt-2 text-xs text-gray-400 font-medium">
                Video
              </div>
              <div 
                className="flex items-center px-2 py-1.5 hover:bg-gray-700 rounded-sm cursor-pointer"
                onClick={() => {
                  if (selectedImage) {
                    const hasItem = selectedImage.techniques.includes("vid2vid");
                    if (hasItem) {
                      const filtered = selectedImage.techniques.filter(t => t !== "vid2vid");
                      updateImageProperty('techniques', filtered);
                    } else {
                      updateImageProperty('techniques', [...selectedImage.techniques, "vid2vid"]);
                    }
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#1A1A1A]"
                  onChange={(e) => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    if (selectedImage) {
                      const hasItem = selectedImage.techniques.includes("vid2vid");
                      if (hasItem) {
                        const filtered = selectedImage.techniques.filter(t => t !== "vid2vid");
                        updateImageProperty('techniques', filtered);
                      } else {
                        updateImageProperty('techniques', [...selectedImage.techniques, "vid2vid"]);
                      }
                    }
                  }}
                  checked={selectedImage?.techniques.includes("vid2vid") || false}
                />
                <span className="text-sm text-gray-300">vid2vid</span>
              </div>
              <div 
                className="flex items-center px-2 py-1.5 hover:bg-gray-700 rounded-sm cursor-pointer"
                onClick={() => {
                  if (selectedImage) {
                    const hasItem = selectedImage.techniques.includes("txt2vid");
                    if (hasItem) {
                      const filtered = selectedImage.techniques.filter(t => t !== "txt2vid");
                      updateImageProperty('techniques', filtered);
                    } else {
                      updateImageProperty('techniques', [...selectedImage.techniques, "txt2vid"]);
                    }
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#1A1A1A]"
                  onChange={(e) => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    if (selectedImage) {
                      const hasItem = selectedImage.techniques.includes("txt2vid");
                      if (hasItem) {
                        const filtered = selectedImage.techniques.filter(t => t !== "txt2vid");
                        updateImageProperty('techniques', filtered);
                      } else {
                        updateImageProperty('techniques', [...selectedImage.techniques, "txt2vid"]);
                      }
                    }
                  }}
                  checked={selectedImage?.techniques.includes("txt2vid") || false}
                />
                <span className="text-sm text-gray-300">txt2vid</span>
              </div>
              <div 
                className="flex items-center px-2 py-1.5 hover:bg-gray-700 rounded-sm cursor-pointer"
                onClick={() => {
                  if (selectedImage) {
                    const hasItem = selectedImage.techniques.includes("img2vid");
                    if (hasItem) {
                      const filtered = selectedImage.techniques.filter(t => t !== "img2vid");
                      updateImageProperty('techniques', filtered);
                    } else {
                      updateImageProperty('techniques', [...selectedImage.techniques, "img2vid"]);
                    }
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 rounded border-gray-600 bg-[#1A1A1A]"
                  onChange={(e) => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    if (selectedImage) {
                      const hasItem = selectedImage.techniques.includes("img2vid");
                      if (hasItem) {
                        const filtered = selectedImage.techniques.filter(t => t !== "img2vid");
                        updateImageProperty('techniques', filtered);
                      } else {
                        updateImageProperty('techniques', [...selectedImage.techniques, "img2vid"]);
                      }
                    }
                  }}
                  checked={selectedImage?.techniques.includes("img2vid") || false}
                />
                <span className="text-sm text-gray-300">img2vid</span>
              </div>
            </div>
            <div className="p-2 border-t border-gray-700 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-blue-400 hover:text-blue-300"
                onClick={() => {
                  document.getElementById('techniques-dropdown')?.classList.add('hidden');
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        {selectedImage && selectedImage.techniques.length > 0 ? (
          <div className="space-y-2">
            {selectedImage.techniques.map((technique, index) => (
              <div key={index} className="bg-[#232323] p-3 rounded-md flex items-center justify-between">
                <p className="text-gray-300">{technique}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-400"
                  onClick={() => {
                    if (selectedImage) {
                      const updatedTechniques = [...selectedImage.techniques];
                      updatedTechniques.splice(index, 1);
                      updateImageProperty('techniques', updatedTechniques);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No techniques added yet.</p>
        )}
      </div>
    </div>
  );
};

export default TechniquesSection;
export type { TechniquesSectionProps }; 