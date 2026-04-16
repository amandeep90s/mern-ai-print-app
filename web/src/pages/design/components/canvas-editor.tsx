import { Canvas } from 'fabric';
import { Eye, Pencil } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useCanvas } from '@/hooks/use-canvas';
import { applyCustomControls } from '@/lib/canvas-controls';
import { cn } from '@/lib/utils';
import type { ProductColorType, ProductType } from '@/types/product';

interface CanvasEditorProps {
  template: ProductType;
  defaultColor?: ProductColorType;
}

function getScale(el: HTMLElement, width: number, height: number, pad = 40) {
  return Math.min(
    (el.clientWidth - pad) / width,
    (el.clientHeight - pad) / height,
    1,
  );
}

export default function CanvasEditor({
  template,
  defaultColor,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const printableAreaRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<'design' | 'preview'>('design');
  const [loading, setLoading] = useState(true);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isMaskLoaded, setIsMaskLoaded] = useState(false);

  const { canvasEditor, setCanvasEditor, listingData, updatedListingState } =
    useCanvas();
  const [selectedColor, setSelectedColor] = useState<ProductColorType | null>(
    listingData.selectedColors.length > 0
      ? listingData.selectedColors[listingData.selectedColors.length - 1]
      : defaultColor || null,
  );

  const DISPLAY_SIZE = 662;

  const printableArea = useMemo(
    () => ({
      top: template.printableArea.top,
      left: template.printableArea.left,
      width: template.printableArea.width,
      height: template.printableArea.height,
    }),
    [template],
  );

  useEffect(() => {
    if (!canvasRef.current || !template) return;
    let canvas: Canvas;

    (async () => {
      try {
        const scale = containerRef.current
          ? getScale(
              containerRef.current,
              printableArea.width,
              printableArea.height,
            )
          : 1;

        canvas = new Canvas(canvasRef.current!, {
          width: printableArea.width,
          height: printableArea.height,
          backgroundColor: undefined,
          preserveObjectStacking: true,
          controlsAboveOverlay: true,
        });
        canvas.setDimensions({
          width: printableArea.width * scale,
          height: printableArea.height * scale,
        });
        canvas.setZoom(scale);

        const dpr = window.devicePixelRatio || 1;
        if (dpr > 1) {
          canvas.getElement().width = printableArea.width * dpr;
          canvas.getElement().height = printableArea.height * dpr;
          canvas.getContext().scale(dpr, dpr);
        }

        canvas.calcOffset();
        canvas.requestRenderAll();
        applyCustomControls(canvas);
        setCanvasEditor(canvas);
      } catch {
        console.log('Canvas failed to init');
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      // Dispose canvas and clear canvas editor
      canvas?.dispose();
      setCanvasEditor(null);
    };
  }, [template]);

  useEffect(() => {
    if (!canvasEditor) return;

    const captureArtwork = () => {
      const artworkDataUrl = canvasEditor.toDataURL({
        format: 'png',
        multiplier: 1,
        quality: 1.0,
      });
      updatedListingState('artworkUrl', artworkDataUrl);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleObjectModifed = (e: any) => {
      const obj = e.target;
      if (obj)
        updatedListingState('artworkPlacement', {
          top: obj.top,
          left: obj.left,
          width: obj.getScaledWidth(),
          height: obj.getScaledHeight(),
          refDisplayWidth: DISPLAY_SIZE,
        });
      captureArtwork();
    };

    canvasEditor.on('object:modified', handleObjectModifed);
    canvasEditor.on('object:added', captureArtwork);
    canvasEditor.on('object:removed', captureArtwork);
    canvasEditor.on('mouse:down', (e) => {
      if (!e.target) {
        canvasEditor.discardActiveObject();
        canvasEditor.requestRenderAll();
      }
    });

    return () => {
      canvasEditor.off('object:modified', handleObjectModifed);
      canvasEditor.off('object:added', captureArtwork);
      canvasEditor.off('object:removed', captureArtwork);
      canvasEditor.off('mouse:down', () => {});
    };
  }, [canvasEditor]);

  const generatePreview = useCallback(() => {
    if (!canvasEditor || !selectedColor?.mockupUrl) return;

    canvasEditor.discardActiveObject();
    canvasEditor.requestRenderAll();

    const artworkDataUrl = canvasEditor.toDataURL({
      format: 'png',
      multiplier: 1,
      quality: 1.0,
    });
    updatedListingState('artworkUrl', artworkDataUrl);
    setPreviewBlobUrl('');
    const mockupImg = new Image();
    mockupImg.crossOrigin = 'anonymous';
    mockupImg.src = selectedColor.mockupUrl;
    mockupImg.onload = () => {
      const W = mockupImg.naturalWidth;
      const H = mockupImg.naturalHeight;
      const mergeCanvas = document.createElement('canvas');
      mergeCanvas.width = W;
      mergeCanvas.height = H;
      const ctx = mergeCanvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(mockupImg, 0, 0, W, H);

      const artImg = new Image();
      artImg.src = artworkDataUrl;
      artImg.onload = () => {
        const scale = W / DISPLAY_SIZE;
        const dx = printableArea.left * scale;
        const dy = printableArea.top * scale;
        const dw = printableArea.width * scale;
        const dh = printableArea.height * scale;

        ctx.drawImage(artImg, dx, dy, dw, dh);

        mergeCanvas.toBlob(
          (blob) => {
            if (blob) setPreviewBlobUrl(URL.createObjectURL(blob));
          },
          'image/png',
          1.0,
        );
      };
    };
  }, [canvasEditor, selectedColor, printableArea, updatedListingState]);

  useEffect(() => {
    if (!selectedColor || viewMode !== 'preview') return;
    generatePreview();
  }, [selectedColor, viewMode]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-start overflow-hidden bg-[#f6f6f6]"
    >
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-slate-800/80">
          <p>Loading Canvas</p>
        </div>
      )}

      <div className="product-design-area relative -mt-8 flex w-full scale-[95%] transform flex-col items-center justify-start p-9">
        <div
          className="product-preview-base relative aspect-square w-full transition-colors duration-300"
          style={{
            backgroundColor: isMaskLoaded
              ? selectedColor?.color || 'white'
              : 'transparent',
            display: viewMode === 'design' ? 'block' : 'none',
            maxWidth: `${DISPLAY_SIZE}px`,
            height: `${DISPLAY_SIZE}px`,
            lineHeight: `${DISPLAY_SIZE}px`,
          }}
        >
          {!isMaskLoaded && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#f6f6f6]">
              <span className="text-muted-foreground animate-pulse text-base font-medium">
                Loading mask...
              </span>
            </div>
          )}

          <div
            className="absolute z-20"
            ref={printableAreaRef}
            style={{
              top: printableArea.top,
              left: printableArea.left,
              width: printableArea.width,
              height: printableArea.height,
            }}
          >
            <div className="printable-area outlined h-full w-full">
              <canvas ref={canvasRef} className="h-full w-full" />
              <div className="printable-area-info-icon" />
            </div>
          </div>

          <img
            className="product-mask-image"
            src={template.baseUrl}
            alt=""
            decoding="async"
            loading="eager"
            onLoad={() => setIsMaskLoaded(true)}
            style={{
              imageRendering: '-webkit-optimize-contrast',
              background: 'transparent !important',
            }}
          />

          <div className="grid-lines" />
        </div>

        {/* Mockup Preview */}
        <div
          className="mockup-preview aspect-square"
          style={{
            display: viewMode === 'preview' ? 'block' : 'none',
            maxWidth: `${DISPLAY_SIZE}px`,
            height: `${DISPLAY_SIZE}px`,
            lineHeight: `${DISPLAY_SIZE}px`,
          }}
        >
          {previewBlobUrl ? (
            <img src={previewBlobUrl} className="pointer-events-none" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted-foreground animate-pulse text-base">
                Generating mockup...
              </span>
            </div>
          )}
        </div>

        <div className="bg-background border-border z-30 mt-7 mb-3 flex items-center rounded-full border p-1 shadow-sm">
          <Button
            onClick={() => {
              generatePreview();
              setViewMode('preview');
            }}
            className={cn(
              'cursor-pointer rounded-full',
              viewMode === 'preview'
                ? 'bg-foreground text-background'
                : 'text-foreground hover:bg-accent bg-transparent',
            )}
          >
            <Eye className="h-5 w-5" /> Preview
          </Button>

          <Button
            onClick={() => {
              setViewMode('design');
              canvasEditor?.requestRenderAll();
            }}
            className={cn(
              'cursor-pointer rounded-full',
              viewMode === 'design'
                ? 'bg-foreground text-background'
                : 'text-foreground hover:bg-accent bg-transparent',
            )}
          >
            <Pencil className="h-5 w-5" /> Design
          </Button>
        </div>
      </div>

      <div className="absolute top-1/4 right-6 z-30 flex -translate-y-2/3 flex-col gap-2 rounded-full">
        {listingData.selectedColors.map((color) => (
          <button
            key={color._id}
            onClick={() => setSelectedColor(color)}
            className={`h-8 w-8 cursor-pointer rounded-full border-2 transition-all hover:scale-110 ${
              selectedColor?._id === color._id
                ? 'ring-foreground border-transparent ring-1 ring-offset-1'
                : 'border-border'
            }`}
            style={{ backgroundColor: color.color }}
          />
        ))}
      </div>
    </div>
  );
}
