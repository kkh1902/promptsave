import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { ImageItem } from "./PromptSection";

interface PromptEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImage: ImageItem | null;
  updateImageProperty: <K extends keyof ImageItem>(property: K, value: ImageItem[K]) => void;
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  description: string;
  images: ImageItem[];
  clipSkip: string;
  setClipSkip: (value: string) => void;
  steps: string;
  setSteps: (value: string) => void;
  sampler: string;
  setSampler: (value: string) => void;
  seed: string;
  setSeed: (value: string) => void;
}

const PromptEditDialog = ({
  isOpen,
  onOpenChange,
  selectedImage,
  updateImageProperty,
  setImages,
  setSelectedImageIndex,
  title,
  description,
  images,
  clipSkip,
  setClipSkip,
  steps,
  setSteps,
  sampler,
  setSampler,
  seed,
  setSeed
}: PromptEditDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-[#191919] border-gray-800 text-white p-0">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <DialogTitle className="text-white text-lg font-medium">Image details</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 w-8 p-0 text-gray-400 hover:text-white bg-[#232323] rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium mb-2 text-gray-300">Prompt</h5>
              <Textarea
                placeholder="Enter your prompt"
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
                      tags: []
                    };
                    setImages([newImage]);
                    setSelectedImageIndex(0);
                  }
                }}
                className="min-h-[60px] bg-[#242424] border-gray-700 text-gray-200 resize-none text-sm"
              />
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2 text-gray-300">Negative prompt</h5>
              <Textarea
                placeholder="Enter negative prompt"
                value={selectedImage?.negativePrompt || ""}
                onChange={(e) => selectedImage && updateImageProperty('negativePrompt', e.target.value)}
                className="min-h-[60px] bg-[#242424] border-gray-700 text-gray-200 resize-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium mb-2 text-gray-300">Guidance scale</h5>
                <div className="relative">
                  <Input 
                    type="number"
                    value={selectedImage?.guidanceScale || clipSkip}
                    onChange={(e) => {
                      setClipSkip(e.target.value);
                      if (selectedImage) {
                        updateImageProperty('guidanceScale', e.target.value);
                      }
                    }}
                    min="1"
                    max="30"
                    className="bg-[#242424] border-gray-700 text-gray-200 pr-10 appearance-none"
                    style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                  />
                  <div className="absolute inset-y-0 right-0 flex flex-col h-full">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-1/2 w-10 p-0 text-gray-400 rounded-none border-l border-gray-700" 
                      onClick={() => {
                        const newValue = String(Number(selectedImage?.guidanceScale || clipSkip) + 1);
                        setClipSkip(newValue);
                        if (selectedImage) {
                          updateImageProperty('guidanceScale', newValue);
                        }
                      }}
                    >
                      <span className="text-sm">▲</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-1/2 w-10 p-0 text-gray-400 rounded-none border-l border-t border-gray-700" 
                      onClick={() => {
                        const newValue = String(Math.max(1, Number(selectedImage?.guidanceScale || clipSkip) - 1));
                        setClipSkip(newValue);
                        if (selectedImage) {
                          updateImageProperty('guidanceScale', newValue);
                        }
                      }}
                    >
                      <span className="text-sm">▼</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2 text-gray-300">Steps</h5>
                <div className="relative">
                  <Input 
                    type="number"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    min="1"
                    max="150"
                    className="bg-[#242424] border-gray-700 text-gray-200 pr-10 appearance-none"
                    style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                  />
                  <div className="absolute inset-y-0 right-0 flex flex-col h-full">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-1/2 w-10 p-0 text-gray-400 rounded-none border-l border-gray-700" 
                      onClick={() => setSteps(String(Number(steps) + 1))}
                    >
                      <span className="text-sm">▲</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-1/2 w-10 p-0 text-gray-400 rounded-none border-l border-t border-gray-700" 
                      onClick={() => setSteps(String(Math.max(1, Number(steps) - 1)))}
                    >
                      <span className="text-sm">▼</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2 text-gray-300">Sampler</h5>
              <div className="relative">
                <Select value={sampler} onValueChange={setSampler}>
                  <SelectTrigger className="bg-[#242424] border-gray-700 text-gray-200 w-full text-sm">
                    <SelectValue placeholder="Select sampler" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#242424] border-gray-700 text-gray-200">
                    <SelectItem value="Euler">Euler</SelectItem>
                    <SelectItem value="Euler a">Euler a</SelectItem>
                    <SelectItem value="DPM++ 2M">DPM++ 2M</SelectItem>
                    <SelectItem value="DPM++ SDE">DPM++ SDE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2 text-gray-300">Seed</h5>
              <div className="relative">
                <Input 
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  className="bg-[#242424] border-gray-700 text-gray-200 pr-10 appearance-none"
                  style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                />
                <div className="absolute inset-y-0 right-0 flex flex-col h-full">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-1/2 w-10 p-0 text-gray-400 rounded-none border-l border-gray-700" 
                    onClick={() => setSeed(String(Number(seed) + 1))}
                  >
                    <span className="text-sm">▲</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-1/2 w-10 p-0 text-gray-400 rounded-none border-l border-t border-gray-700" 
                    onClick={() => setSeed(String(Math.max(1, Number(seed) - 1)))}
                  >
                    <span className="text-sm">▼</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptEditDialog; 