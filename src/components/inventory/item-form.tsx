'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addItemAction } from '@/lib/actions';
import type { Item } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const itemSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  purchasePrice: z.coerce.number().min(0, 'Purchase price cannot be negative.'),
  sellingPrice: z.coerce.number().min(0, 'Selling price cannot be negative.'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative.'),
  lowStockThreshold: z.coerce.number().int().min(0, 'Threshold cannot be negative.'),
});

type ItemFormData = z.infer<typeof itemSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Item'}
    </Button>
  );
}

export function ItemForm({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [state, formAction] = useActionState(addItemAction, { errors: {} });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const {
    register,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
  });

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success!',
        description: 'New item has been added to your inventory.',
      });
      onOpenChange(false);
      formRef.current?.reset();
    }
  }, [state.success, onOpenChange, toast]);
  
  const allErrors = { ...errors, ...state.errors };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <div className="col-span-3">
              <Input id="name" {...register('name')} />
              {allErrors?.name && <p className="text-destructive text-sm mt-1">{allErrors.name[0]}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <div className="col-span-3">
              <Textarea id="description" {...register('description')} />
              {allErrors?.description && <p className="text-destructive text-sm mt-1">{allErrors.description[0]}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="purchasePrice" className="text-right">Purchase Price</Label>
              <Input id="purchasePrice" type="number" step="0.01" {...register('purchasePrice')} />
              {allErrors?.purchasePrice && <p className="text-destructive text-sm mt-1 col-span-2 text-right">{allErrors.purchasePrice[0]}</p>}
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="sellingPrice" className="text-right">Selling Price</Label>
              <Input id="sellingPrice" type="number" step="0.01" {...register('sellingPrice')} />
              {allErrors?.sellingPrice && <p className="text-destructive text-sm mt-1 col-span-2 text-right">{allErrors.sellingPrice[0]}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input id="quantity" type="number" {...register('quantity')} />
              {allErrors?.quantity && <p className="text-destructive text-sm mt-1 col-span-2 text-right">{allErrors.quantity[0]}</p>}
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="lowStockThreshold" className="text-right">Low Stock Alert</Label>
              <Input id="lowStockThreshold" type="number" {...register('lowStockThreshold')} />
              {allErrors?.lowStockThreshold && <p className="text-destructive text-sm mt-1 col-span-2 text-right">{allErrors.lowStockThreshold[0]}</p>}
            </div>
          </div>
          {state.errors?._server && <p className="text-destructive text-sm">{state.errors._server[0]}</p>}
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
