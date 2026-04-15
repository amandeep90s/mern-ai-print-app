import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import { CanvasProvider } from '@/context/canvas-context';
import { getProductTemplateById } from '@/lib/api';
import CanvasEditor from '@/pages/design/components/canvas-editor';
import EditorSidebar from '@/pages/design/components/editor-sidebar';

export default function DesignPage() {
  const { product_id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['design', product_id],
    queryFn: async () => {
      const response = await getProductTemplateById(product_id!);
      return response;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[75vh] w-full flex-col items-center justify-center">
        <Spinner className="size-12" />
        <p className="text-muted-foreground text-sm">
          Loading Design Editor...
        </p>
      </div>
    );
  }

  if (!data?.template) {
    return (
      <div className="flex h-[75vh] w-full flex-col items-center justify-center">
        <p className="text-muted-foreground text-sm">Template not found</p>
      </div>
    );
  }

  const { template, colors } = data;
  const basePrice = template.basePrice ?? 0;

  return (
    <CanvasProvider basePrice={basePrice}>
      <div className="flex h-full w-full">
        <aside className="hidden w-100 shrink-0 overflow-y-auto border-t border-r lg:block">
          <EditorSidebar
            templateId={template._id}
            basePrice={basePrice}
            colors={colors ?? []}
          />
        </aside>

        <div className="flex-1">
          <CanvasEditor template={template} defaultColor={colors?.[0]} />
        </div>
      </div>
    </CanvasProvider>
  );
}
