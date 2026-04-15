import type { ProductColorType } from '@/types/product';

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
  return <div>EditorSidebar</div>;
}
