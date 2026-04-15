import { useQuery } from '@tanstack/react-query';
import { Link2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getListingQueryFn } from '@/lib/api';

export default function ListingsPage() {
  const { data: listingData, isLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: getListingQueryFn,
  });

  const listings = listingData?.listings || [];

  return (
    <div className="min-h-screen w-full">
      <div className="w-full space-y-6 px-6">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your active listings.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead colSpan={2}>Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={3}>
                      <div className="bg-muted h-10 animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : listings.map((listing) => (
                  <TableRow key={listing._id}>
                    <TableCell className="flex items-center gap-3">
                      <div className="rounded-sm border p-2">
                        <img
                          src={listing.artworkUrl}
                          alt={listing.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      </div>

                      <div>
                        <h5 className="font-medium">{listing.title}</h5>
                        <p className="text-muted-foreground mt-px w-full max-w-75 truncate text-xs">
                          {listing.description}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>${listing.sellingPrice}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/listing/${listing.slug}`} target="_blank">
                          <Link2 className="mr-1 h-4 w-4" />
                          Share Link
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
