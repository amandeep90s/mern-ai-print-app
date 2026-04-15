import { useMutation } from '@tanstack/react-query';
import type { IText } from 'fabric';
import {
  BoldIcon,
  Check,
  DollarSign,
  ImageIcon,
  ItalicIcon,
  Sparkles,
  Type,
  UnderlineIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import art1 from '@/assets/artworks/art-1.png';
import art2 from '@/assets/artworks/art-2.png';
import art3 from '@/assets/artworks/art-3.png';
import art4 from '@/assets/artworks/art-4.png';
import art5 from '@/assets/artworks/art-5.png';
import art6 from '@/assets/artworks/art-6.png';
import art7 from '@/assets/artworks/art-7.png';
import art8 from '@/assets/artworks/art-8.png';
import art9 from '@/assets/artworks/art-9.png';
import art10 from '@/assets/artworks/art-10.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ListingDataKey } from '@/context/canvas-context';
import { useCanvas } from '@/hooks/use-canvas';
import { createListingMutationFn, generateArtworkMutationFn } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { CreateListingType } from '@/types/listing';
import type { ProductColorType } from '@/types/product';

import ToolButton from './tool-button';

const ARTWORK_PRESET = [
  art1,
  art2,
  art3,
  art4,
  art5,
  art6,
  art7,
  art8,
  art9,
  art10,
];

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
    fill: '#000000',
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

  const updateText = (args: Partial<typeof textProps>) => {
    activeTextObj?.set(args as unknown);
    canvasEditor?.requestRenderAll();
    setTextProps((prev) => ({ ...prev, ...args }));
  };

  const handleChange = (key: ListingDataKey, value: string) => {
    updatedListingState(key, value);
  };

  const handleColorChange = (color: ProductColorType) => {
    //
  };

  const isFormValid = () => {
    return true;
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

                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={userPrompt}
                      className="min-h-10 flex-1 resize-none"
                      placeholder="e.g. Stay Wild quote, A cool gamer freak dog..."
                      onChange={(e) => setUserPrompt(e.target.value)}
                    />

                    <Button
                      className="w-full"
                      size="lg"
                      disabled={isGeneratingArtwork}
                      onClick={handleAIArtwork}
                    >
                      {isGeneratingArtwork ? (
                        <>
                          <Spinner />
                          <span className="leading-tight">
                            Generating...(~30s)
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Generate</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-2.5 text-muted-foreground font-semibold uppercase">
                      Quick Artworks
                    </h5>

                    <div className="grid max-h-45 grid-cols-5 gap-2 overflow-y-auto">
                      {ARTWORK_PRESET.map((artwork, index) => (
                        <button
                          key={index}
                          className="border-border hover:border-primary hover:ring-primary/20 overflow-hidden rounded-md border bg-white p-1 shadow-sm hover:ring-2"
                        >
                          <img
                            src={artwork}
                            alt="style"
                            className="h-full w-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {activeTextObj && (
            <div className="flex items-center gap-2 pt-1">
              <select
                className="border-border bg-background flex-[0.5] rounded-md border px-2 py-1.5 text-sm"
                value={textProps.fontFamily}
                disabled={isPending}
                onChange={(e) => {
                  updateText({
                    fontFamily: e.target.value,
                  });
                }}
              >
                {[
                  'Helvetica',
                  'Impact',
                  'Arial',
                  'Georgia',
                  'Times New Roman',
                  'Courier New',
                ].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <ToggleGroup
                type="multiple"
                orientation="horizontal"
                spacing={1}
                value={[
                  ...(textProps.fontWeight === 'bold' ? ['bold'] : []),
                  ...(textProps.fontStyle === 'italic' ? ['italic'] : []),
                  ...(textProps.underline ? ['underline'] : []),
                ]}
                onValueChange={(vals) => {
                  const props = {
                    fontWeight: vals.includes('bold') ? 'bold' : 'normal',
                    fontStyle: vals.includes('italic') ? 'italic' : 'normal',
                    underline: vals.includes('underline'),
                  };
                  updateText(props);
                }}
              >
                <ToggleGroupItem value="bold">
                  <BoldIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic">
                  <ItalicIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline">
                  <UnderlineIcon />
                </ToggleGroupItem>
              </ToggleGroup>
              <input
                type="color"
                className="h-8 w-8 cursor-pointer overflow-hidden rounded-lg!"
                value={textProps.fill}
                onChange={(e) => updateText({ fill: e.target.value })}
              />
            </div>
          )}
        </section>

        <section className="space-y-3 px-5 pb-4">
          <div>
            <h2 className="text-foreground text-base font-medium">
              Choose product colors
            </h2>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Select up to 3 backgrounds for your product
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {colors.map((item) => {
              const isSelected = (listingData.selectedColors || []).some(
                (c) => c._id === item._id,
              );

              const isWhite = item.color.trim() === 'rgb(255, 255, 255)';

              return (
                <button
                  key={item.name}
                  onClick={() => handleColorChange(item)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2',
                    isWhite && 'border-border',
                  )}
                  disabled={isPending}
                  style={{ backgroundColor: item.color }}
                >
                  {isSelected && (
                    <Check
                      className={cn(
                        'h-4 w-4',
                        isWhite ? 'text-black' : 'text-white',
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3 px-5 pb-4">
          <div>
            <h2 className="text-foreground text-base font-medium">
              Set your pricing
            </h2>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Set your pricing for the product
            </p>
          </div>

          <div>
            <InputGroup className="py-5!">
              <InputGroupAddon>
                <DollarSign size={28} />
              </InputGroupAddon>
              <InputGroupInput
                className={cn(
                  'text-base!',
                  listingData.sellingPrice < basePrice && 'border-destructive',
                )}
                placeholder="Selling Price"
                type="number"
                value={listingData.sellingPrice}
                disabled={isPending}
                onChange={(e) => handleChange('sellingPrice', e.target.value)}
              />
            </InputGroup>
            {listingData.sellingPrice < basePrice && (
              <p className="text-destructive mt-1 text-xs">
                Price must be at least ${basePrice}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-3 px-5 pb-4">
          <div>
            <h2 className="text-foreground text-base font-medium">
              Title &amp; Description
            </h2>

            <p className="text-muted-foreground mt-0.5 text-sm">
              Set your title and description for the product
            </p>
          </div>

          <div className="space-y-3">
            <Input
              className="py-5 text-sm!"
              placeholder="Title"
              type="text"
              value={listingData.title}
              disabled={isPending}
              onChange={(e) => handleChange('title', e.target.value)}
            />

            <Textarea
              className="h-30! text-sm!"
              placeholder="Description"
              value={listingData.description}
              disabled={isPending}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
        </section>
      </div>

      <div className="border-border border-t px-5 py-4">
        <Button
          size="lg"
          className="w-full cursor-pointer py-6"
          disabled={!isFormValid() || isPending}
          onClick={handleSubmit}
        >
          {isPending ? <Spinner className="size-6" /> : 'Create Product'}
        </Button>
      </div>
    </div>
  );
}
