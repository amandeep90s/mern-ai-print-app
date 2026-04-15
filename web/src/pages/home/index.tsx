import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import bannerImage from '@/assets/banner.png';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getListingQueryFn, getProducts } from '@/lib/api';
import { ENV } from '@/lib/env';
import { PROTECTED_ROUTES } from '@/routes/routes';

export default function HomePage() {
  const { data: productData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: listingData, isLoading: isListingLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: getListingQueryFn,
  });

  const listings = listingData?.listings ?? [];
  const catalogProducts = productData?.products?.catalog || [];
  const featuredProducts = productData?.products?.featured || [];

  return (
    <div className="min-h-screen w-full py-5">
      <div className="w-full space-y-6 px-6 pb-10">
        {/* Hero / Banner Section */}
        <section className="bg-muted mb-5 overflow-hidden">
          <div
            className="block h-50 flex-1 rounded-lg"
            style={{ background: `url(${bannerImage}) center/cover no-repeat` }}
          />
        </section>

        {/* Starter Essentials Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Starter Essentials</h2>
              <p className="text-muted-foreground text-sm">
                Kickstart your business with these handpicked products that are
                ideal for new sellers.
              </p>
            </div>
            <span className="cursor-pointer text-sm font-medium underline">
              View all
            </span>
          </div>

          {/* Large Card Grid */}
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="aspect-square w-full rounded-xl"
                  />
                ))
              : catalogProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="ring=0 group aspect-5/6 cursor-pointer rounded-xl border-none! p-0 shadow-lg"
                  >
                    <Link
                      to={PROTECTED_ROUTES.DESIGN.replace(
                        ':product_id',
                        product._id,
                      )}
                      className="relative h-full overflow-hidden rounded-xl"
                    >
                      <img
                        src={product.displayUrl}
                        alt={product.name}
                        className="object-fit h-full w-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                  </Card>
                ))}
          </div>

          {/* Small Card Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="aspect-square w-full rounded-xl"
                  />
                ))
              : featuredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="group cursor-pointer overflow-hidden rounded-lg border-none! p-0 shadow-sm"
                  >
                    <Link
                      to={PROTECTED_ROUTES.DESIGN.replace(
                        ':product_id',
                        product._id,
                      )}
                    >
                      <div className="bg-muted aspect-square overflow-hidden">
                        <img
                          src={product.displayUrl}
                          alt={product.name}
                          className="h-full w-full object-cover object-top group-hover:opacity-90"
                        />
                      </div>
                      <div className="px-4 py-2">
                        <h3 className="truncate text-base font-medium">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground mb-1 text-sm">
                          {product.body}
                        </p>
                      </div>
                    </Link>
                  </Card>
                ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Listings</h2>
              <p className="text-muted-foreground text-sm">
                Manage your active listings and track their performance.
              </p>
            </div>
            <Link
              to={PROTECTED_ROUTES.LISTINGS}
              className="text-sm font-medium underline"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {isListingLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="aspect-square w-full rounded-xl"
                />
              ))
            ) : listings?.length === 0 ? (
              <p>No listings found</p>
            ) : (
              listings.slice(0, 8).map((listing) => (
                <Card
                  key={listing._id}
                  className="group cursor-pointer overflow-hidden rounded-lg border-none! p-0 shadow-sm"
                >
                  <a href={`/listing/${listing.slug}`} target="_blank">
                    <div className="bg-muted aspect-square overflow-hidden">
                      <img
                        src={`${ENV.BASE_API_URL}/api/listing/mockup/${listing.slug}/${listing.colorIds[0]?.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                        alt={listing.title}
                        className="h-full w-full object-contain group-hover:opacity-90"
                        fetchPriority="high"
                        decoding="async"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = listing.artworkUrl;
                        }}
                      />
                    </div>
                    <div className="space-y-1 px-3 py-3">
                      <h3 className="truncate text-sm font-medium">
                        {listing.title}
                      </h3>
                      <p className="text-muted-foreground text-sm font-light">
                        Sale price ${listing.sellingPrice}
                      </p>
                      <div className="flex gap-1">
                        {listing.colorIds?.map((color) => (
                          <div
                            key={color._id}
                            className="size-4 rounded-full border"
                            style={{ backgroundColor: color.color }}
                          />
                        ))}
                      </div>
                    </div>
                  </a>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
