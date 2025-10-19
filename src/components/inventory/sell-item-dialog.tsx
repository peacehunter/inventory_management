'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sellItemAction } from '@/lib/actions';
import type { Item } from '@/lib/types';
import { cn } from '@/lib/utils';

const sellItemSchema = z.object({
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1.'),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Recording Sale...' : 'Confirm Sale'}
    </Button>
  );
}

export function SellItemDialog({
  item,
  open,
  onOpenChange,
}: {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, formAction] = useActionState(sellItemAction, { errors: {} });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<{ quantity: number }>({
    resolver: zodResolver(sellItemSchema),
  });

  useEffect(() => {
    if (open) {
      reset(); // Reset form when dialog opens
    }
  }, [open, reset]);
  
  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Sale Recorded!',
        description: `Sold ${formRef.current?.quantity.value} of ${item?.name}.`,
      });
      onOpenChange(false);
    } else if (state.errors) {
       Object.entries(state.errors).forEach(([key, value]) => {
        if (key === 'quantity' && value) {
            setError('quantity', { type: 'server', message: value[0] });
        }
      });
    }
  }, [state, onOpenChange, toast, item?.name, setError]);

  if (!item) return null;
  
  const allErrors = { ...errors, ...state.errors };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sell: {item.name}</DialogTitle>
          <DialogDescription>
            Enter the quantity to sell. Available: {item.quantity}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="itemId" value={item.id} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <div className="col-span-3">
                <Input
                  id="quantity"
                  type="number"
                  defaultValue="1"
                  min="1"
                  max={item.quantity}
                  {...register('quantity')}
                  className={cn(allErrors.quantity && 'border-destructive')}
                />
                 {allErrors?.quantity && <p className="text-destructive text-sm mt-1">{Array.isArray(allErrors.quantity) ? allErrors.quantity[0] : allErrors.quantity.message}</p>}
                 {allErrors?._server && <p className="text-destructive text-sm mt-1">{allErrors._server[0]}</p>}
              </div>
            </div>
          </div>
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
