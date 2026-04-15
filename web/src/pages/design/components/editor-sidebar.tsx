import { useMutation } from '@tanstack/react-query';
import type { IText } from 'fabric';
import { ImageIcon, Sparkles, Type } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCanvas } from '@/hooks/use-canvas';
import { createListingMutationFn, generateArtworkMutationFn } from '@/lib/api';
import type { CreateListingType } from '@/types/listing';
import type { ProductColorType } from '@/types/product';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ToolButton from './tool-button';

interface EditorSidebarProps {
  colors: ProductColorType[];
  basePrice: number;
  templateId: string;
}

export default function EditorSidebar({
  colors,
  basePrice,
  templateId,
}: EditorSidebarProps) {
  const navigate = useNavigate();
  const { canvasEditor, updatedListingState, listingData } = useCanvas();
  const [activeTextObj, setActiveTextObj] = useState<IText | null>(null);
  const [textProps, setTextProps] = useState({
    file: '#000000',
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    fontStyle: 'normal',
    underline: false,
  });
  const [openPopover, setOpenPopover] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');

  const { mutate: createListing, isPending } = useMutation({
    mutationFn: async (data: CreateListingType) => {
      const response = await createListingMutationFn(data);
      return response;
    },
  });

  const { mutate: generateArtwork, isPending: isGeneratingArtwork } =
    useMutation({
      mutationFn: async (prompt: string) => {
        const response = await generateArtworkMutationFn(prompt);
        return response;
      },
    });

  const addImageToCanvaas = () => {
    //
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //
  };

  const addText = () => {
    //
  };

  const updateText = () => {
    //
  };

  const handleChange = () => {
    //
  };

  const handleColorChange = () => {
    //
  };

  const isFormValid = () => {
    //
  };

  const handleSubmit = () => {
    //
  };

  const handleAIArtwork = () => {
    //
  };

  return (
    <div className="bg-background flex flex-col">
      <div className="divide-border flex-1 space-y-4 divide-y py-4">
        <section className="space-y-3 px-5 pb-4">
          <div>
            <h2 className="text-foreground text-base font-medium">
              Design your product
            </h2>
            <p className="text-muted-foreground text-sm">Max file size 50MB</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolButton
              icon={<ImageIcon />}
              label="Add Image"
              isUpload
              disabled={isPending}
              onChange={handleImageUpload}
            />

            <ToolButton
              icon={<Type />}
              label="Add Text"
              disabled={isPending}
              onClick={addText}
            />

            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <ToolButton
                  icon={<Sparkles />}
                  label="AI Art Studio"
                  disabled={isPending}
                  className="bg-primary/10 border-primary/20 text-primary! hover:bg-primary/20 flex-1"
                />
              </PopoverTrigger>

              <PopoverContent
                align="start"
                side="right"
                className="border-border w-80 overflow-hidden rounded-xl p-0 shadow-2xl sm:w-100"
              >
                <div className="bg-background space-y-4 p-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-foreground text-sm">
                      Describe your design or pick an artwork
                    </h3>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </section>
      </div>
    </div>
  );
}
