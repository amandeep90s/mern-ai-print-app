import { useQuery } from '@tanstack/react-query';
import { Ruler, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Logo from '@/components/logo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getListingBySlugQueryFn } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { ColorIdsType, ListingSingleType } from '@/types/listing';

import CheckoutDialog from './components/checkout-dialog';

export default function SingleListingPage() {
  const { slug } = useParams();

  const [selectedSize, setSelectedSize] = useState('S');

  const { data, isLoading } = useQuery({
    queryKey: ['listing', slug],
    queryFn: () => getListingBySlugQueryFn(slug!),
    enabled: !!slug,
  });

  const listing = data?.listing as ListingSingleType;
  const [selectedColor, setSelectedColor] = useState<ColorIdsType | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (listing?.colorIds?.length) setSelectedColor(listing.colorIds[0]);
  }, [listing]);

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
      <header className="mb-2 h-14 w-full bg-white shadow-sm dark:bg-black/80">
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
                  onError={(e) => {
                    e.currentTarget.src = listing.artworkUrl;
                  }}
                />
              )}
            </div>

            {/* Color thumbnails */}
            <div className="flex justify-center gap-3">
              {listing.colorIds.map((color: ColorIdsType) => (
                <button
                  key={color._id}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'bg-muted h-20 w-20 overflow-hidden rounded-lg border-2 transition-all',
                    selectedColor?._id === color._id
                      ? 'border-primary'
                      : 'border-transparent',
                  )}
                >
                  <img
                    src={color.mockupImageUrl}
                    className="h-full w-full object-cover"
                    fetchPriority="high"
                    decoding="async"
                    alt={color.name}
                    onError={(e) => {
                      e.currentTarget.src = listing.artworkUrl;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex max-w-md flex-1 flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-medium">{listing.title}</h1>
                <p className="text-muted-foreground">{listing.templateName}</p>
              </div>
              <span className="text-2xl font-bold">
                ${listing.sellingPrice}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Color: {selectedColor?.name}
                </span>
                <div className="flex gap-2">
                  {listing.colorIds.map((color: ColorIdsType) => (
                    <button
                      key={color._id}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className={cn(
                        'h-8 w-8 rounded-full border-2 transition-all',
                        selectedColor?._id === color._id
                          ? 'border-primary'
                          : 'border-border',
                      )}
                      style={{ backgroundColor: color.color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Size</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto gap-1 p-0 text-slate-500 hover:bg-transparent"
                  >
                    <Ruler className="h-4 w-4" /> Size guide
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {listing.sizes?.map((size: string) => (
                    <Button
                      key={size}
                      variant="outline"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'h-12 font-medium transition-all',
                        selectedSize === size
                          ? 'border-primary text-primary'
                          : 'border-border',
                      )}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <CheckoutDialog
                listing={listing}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
              />
              <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-green-600">
                <ShieldCheck className="h-4 w-4" />
                30 Day Make It Right Policy
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full border-t">
              <AccordionItem value="description">
                <AccordionTrigger className="text-muted-foreground text-sm">
                  Description
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  {listing.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="details">
                <AccordionTrigger className="text-muted-foreground text-sm">
                  Product Details
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  <ul className="list-disc space-y-1 pl-4">
                    <li>100% Combed Ring-Spun Cotton</li>
                    <li>Heavyweight fabric (6.1 oz)</li>
                    <li>Relaxed fit</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-muted-foreground text-sm">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  Ships within 3-5 business days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <footer className="text-center">
              <Button variant="link" className="text-xs text-slate-400">
                Report this product
              </Button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
