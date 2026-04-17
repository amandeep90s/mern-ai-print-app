import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { createOrderSession } from '@/lib/api';
import type { ColorIdsType, ListingSingleType } from '@/types/listing';

const checkoutSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  name: z.string().min(1, 'Full name is required'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
});

type CheckoutFormType = z.infer<typeof checkoutSchema>;

const customerFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
  },
  { name: 'name', label: 'Full name', placeholder: 'John Doe' },
];

const shippingFields = [
  { name: 'street', label: 'Street Address', placeholder: '123 Main St' },
  { name: 'city', label: 'City', placeholder: 'New York' },
  { name: 'state', label: 'State', placeholder: 'NY' },
  { name: 'postal', label: 'Postal Code', placeholder: '100001' },
  { name: 'country', label: 'Country', placeholder: 'US' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1' },
];

type CheckoutDialogProps = {
  listing: ListingSingleType;
  selectedSize: string;
  selectedColor: ColorIdsType | null;
};

const CheckoutDialog = ({
  listing,
  selectedSize,
  selectedColor,
}: CheckoutDialogProps) => {
  const form = useForm<CheckoutFormType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      name: '',
      street: '',
      city: '',
      state: '',
      postal: '',
      country: '',
      phone: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createOrderSession,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      toast.error('Failed to create checkout session. Please try again.');
    },
  });

  const onSubmit = async (data: CheckoutFormType) => {
    mutate({
      listingId: listing._id,
      colorId: selectedColor?._id ?? '',
      size: selectedSize,
      customerEmail: data.email,
      customerName: data.name,
      shippingAddress: {
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postal,
        country: data.country,
        phoneNumber: data.phone,
      },
    });
  };

  const renderField = ({
    name,
    label,
    type,
    placeholder,
  }: (typeof customerFields)[0]) => (
    <FormField
      key={name}
      control={form.control}
      name={name as keyof CheckoutFormType}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type ?? 'text'}
              placeholder={placeholder}
              {...field}
              className="py-4"
              // autoComplete='off'
              // autoCorrect='off'
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-14 w-full rounded-xl text-lg font-bold">
          Buy now
        </Button>
      </DialogTrigger>

      <DialogContent className="dark:bg-background overflow-hidden bg-white p-0 sm:max-w-120">
        <DialogHeader className="p-6 pb-2!">
          <DialogTitle className="text-2xl font-bold">Checkout</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[72vh] overflow-y-auto px-6">
              <div className="space-y-4 px-1">
                {/* Product Summary */}
                <div className="bg-muted flex gap-4 rounded-lg border p-3">
                  <div className="bg-background h-16 w-16 shrink-0 rounded border">
                    {selectedColor && (
                      <img
                        src={selectedColor.mockupImageUrl}
                        fetchPriority="high"
                        decoding="async"
                        className="h-full w-full object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{listing.title}</p>
                    <p className="text-muted-foreground text-xs">
                      Size: {selectedSize}
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      ${listing.sellingPrice}
                    </p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-[10px] text-white">
                    1
                  </span>
                  <h3 className="text-sm font-semibold tracking-tight uppercase">
                    Customer Details
                  </h3>
                </div>
                {customerFields.map(renderField)}

                <Separator />

                {/* Shipping Address */}
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-[10px] text-white">
                    2
                  </span>
                  <h3 className="text-sm font-semibold tracking-tight uppercase">
                    Shipping Address
                  </h3>
                </div>
                <div className="space-y-4 pb-4">
                  {shippingFields.map(renderField)}
                </div>
              </div>
            </ScrollArea>

            <div className="border-t p-6">
              <Button
                type="submit"
                className="h-12 w-full font-bold"
                disabled={isPending}
              >
                {isPending && <Spinner />}
                {isPending ? 'Processing...' : `Pay $${listing.sellingPrice}`}
              </Button>
              <p className="text-muted-foreground mt-3 text-center text-[10px]">
                By clicking, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
