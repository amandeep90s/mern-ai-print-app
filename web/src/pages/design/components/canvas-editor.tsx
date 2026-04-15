import type { ProductColorType, ProductType } from '@/types/product';

interface CanvasEditorProps {
  template: ProductType;
  defaultColor?: ProductColorType;
}

export default function CanvasEditor({
  template,
  defaultColor,
}: CanvasEditorProps) {
  return <div></div>;
}
