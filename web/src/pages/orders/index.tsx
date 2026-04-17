import { useQuery } from '@tanstack/react-query';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getUserOrders } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { GetUserOrdersResponse } from '@/types/order';

export default function OrdersPage() {
  const { data, isLoading } = useQuery<GetUserOrdersResponse>({
    queryKey: ['orders'],
    queryFn: getUserOrders,
  });

  const orders = data?.orders ?? [];

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto w-full space-y-6 px-3 lg:p-0">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground text-sm">
            Orders placed for your listings.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-10 w-full rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                orders.map((order: any) => (
                  <TableRow key={order._id}>
                    <TableCell className="flex items-center gap-3">
                      <div className="rounded-sm border px-2 pt-2">
                        <img
                          src={order.listingId.artworkUrl}
                          alt={order.listingId.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium">{order.listingId.title}</h5>
                        <p className="text-muted-foreground text-xs">
                          {order.colorId.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">
                        {order.customerName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {order.customerEmail}
                      </p>
                    </TableCell>
                    <TableCell>{order.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: order.colorId.color }}
                        />
                        <p>{order.colorId.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'capitalize',
                          order.status === 'pending' && 'bg-yellow-500',
                          order.status === 'awaiting_shipment' &&
                            'bg-green-400',
                          order.status === 'shipped' && 'bg-blue-400',
                          order.status === 'fulfilled' && 'bg-purple-400',
                          order.status === 'failed' && 'bg-red-400',
                        )}
                      >
                        {order?.status?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
