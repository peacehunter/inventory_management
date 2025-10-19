'use client';

import Image from 'next/image';
import { AlertTriangle, DollarSign, MoreVertical, Package, ShoppingCart, Trash2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Item } from '@/lib/types';
import { cn } from '@/lib/utils';
import { deleteItemAction } from '@/lib/actions';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

type ItemCardProps = {
  item: Item;
  onSell: (item: Item) => void;
};

export function ItemCard({ item, onSell }: ItemCardProps) {
  const isLowStock = item.quantity <= item.lowStockThreshold;

  return (
    <Card className={cn('flex flex-col transition-all hover:shadow-lg', isLowStock && 'border-destructive/50 ring-2 ring-destructive/20')}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-xl">{item.name}</CardTitle>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                item and all associated sales data.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteItemAction(item.id)}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                                Continue
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden mb-4">
            <Image 
                src={item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : "https://images.unsplash.com/photo-1613574203646-ffdae46ce3e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwcm9kdWN0JTIwYm94fGVufDB8fHx8MTc2MDczMjM4N3ww&ixlib=rb-4.1.0&q=80&w=1080"}
                alt={item.name}
                fill
                className="object-cover"
                data-ai-hint={item.imageHint}
            />
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Selling at {item.sellingPrice ? `$${item.sellingPrice}` : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span>{item.quantity} in stock</span>
            </div>
        </div>

      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
        {isLowStock && (
            <Badge variant="destructive" className="justify-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Low Stock
            </Badge>
        )}
        <Button onClick={() => onSell(item)} disabled={item.quantity === 0}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Sell Item
        </Button>
      </CardFooter>
    </Card>
  );
}
