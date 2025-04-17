import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight } from "lucide-react"

// 이미지 항목 타입 정의
export interface ImageItem {
  id: string;
  url: string;
  title: string;
  description: string;
  prompt: string;
  negativePrompt: string;
  resources: string[];
  tools: string[];
  techniques: string[];
  tags: string[];
  guidanceScale?: string;
}

// PromptSection 컴포넌트
interface PromptSectionProps {
  selectedImage: ImageItem | null;
  clipSkip: string;
  steps: string;
  sampler: string;
  seed: string;
  togglePromptEdit: () => void;
  updateImageProperty: <K extends keyof ImageItem>(property: K, value: ImageItem[K]) => void;
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  description: string;
  images: ImageItem[];
}

const PromptSection = ({
  selectedImage,
  clipSkip,
  steps,
  sampler,
  seed,
  togglePromptEdit,
  updateImageProperty,
  setImages,
  setSelectedImageIndex,
  title,
  description,
  images
}: PromptSectionProps) => {
  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-md">
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <h3 className="text-lg font-medium text-white">Prompt</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-400 hover:text-blue-300"
          onClick={togglePromptEdit}
        >
          EDIT
        </Button>
      </div>
      <div className="p-4">
        {selectedImage?.prompt ? (
          <div className="space-y-4">
            <div className="bg-[#232323] p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2 text-gray-300">Prompt</h4>
              <p className="text-gray-200 whitespace-pre-wrap">{selectedImage.prompt}</p>
            </div>

            {selectedImage.negativePrompt && (
              <div className="bg-[#232323] p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2 text-gray-300">Negative Prompt</h4>
                <p className="text-gray-200 whitespace-pre-wrap">{selectedImage.negativePrompt}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#232323] p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2 text-gray-300">Guidance</h4>
                <p className="text-right text-gray-200">{selectedImage?.guidanceScale || clipSkip}</p>
              </div>
              <div className="bg-[#232323] p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2 text-gray-300">Steps</h4>
                <p className="text-right text-gray-200">{steps}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#232323] p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2 text-gray-300">Sampler</h4>
                <p className="text-right text-gray-200">{sampler}</p>
              </div>
              <div className="bg-[#232323] p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2 text-gray-300">Seed</h4>
                <p className="text-right text-gray-200">{seed}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-blue-400 hover:text-blue-300 border border-blue-800/50 rounded-md"
              onClick={togglePromptEdit}
            >
              EDIT
            </Button>
          </div>
        ) : (
          <Textarea
            placeholder="Enter your prompt here..."
            value={selectedImage?.prompt || ""}
            onChange={(e) => {
              if (selectedImage) {
                updateImageProperty('prompt', e.target.value);
              } else if (images.length === 0) {
                // 이미지가 없을 때 새 이미지 생성
                const newImage = {
                  id: Date.now().toString(),
                  url: "",
                  title,
                  description,
                  prompt: e.target.value,
                  negativePrompt: "",
                  resources: [],
                  tools: [],
                  techniques: [],
                  tags: [],
                  guidanceScale: undefined
                };
                setImages([newImage]);
                setSelectedImageIndex(0);
              }
            }}
            className="min-h-[100px] bg-[#232323] border-gray-700 text-gray-200 resize-y"
          />
        )}
      </div>
    </div>
  );
};

export default PromptSection;
export type { ImageItem, PromptSectionProps }; 