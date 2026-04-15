import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Logo from '@/components/logo';
import { Skeleton } from '@/components/ui/skeleton';
import { getListingBySlugQueryFn } from '@/lib/api';
import type { ColorIdsType, ListingSingleType } from '@/types/listing';

export default function SingleListingPage() {
  const { slug } = useParams();

  const [selectedSize, setSelectedSize] = useState('S');

  const { data, isLoading } = useQuery({
    queryKey: ['listing', slug],
    queryFn: () => getListingBySlugQueryFn(slug!),
    enabled: !!slug,
  });

  const listing = data?.listing as ListingSingleType;
  const [selectedColor, setSelectedColor] = useState<ColorIdsType | null>(
    listing?.colorIds?.[0] ?? null,
  );

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row">
          <Skeleton className="aspect-5/6 w-full rounded-2xl md:w-125" />
          <div className="max-w-md flex-1 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Listing not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <header className="mb-2 h-12 w-full bg-white shadow-sm dark:bg-black/80">
        <div className="mx-auto w-full max-w-7xl p-2.5">
          <Logo />
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="flex flex-col items-start justify-center gap-8 md:flex-row">
          {/* Media Gallery */}
          <div className="w-full space-y-4 md:w-125">
            <div className="bg-muted aspect-6/6 overflow-hidden rounded-2xl border">
              {selectedColor && (
                <img
                  src={selectedColor.mockupImageUrl}
                  alt={listing.title}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            {/* Color Thumbnails */}
          </div>
        </div>
      </div>
    </div>
  );
}
