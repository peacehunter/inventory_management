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
  // Return an <img> tag for API-based/proxied images, <Image> for static/remote whitelisted
  const itemImgUrl = item.imageUrl && item.imageUrl.length > 0 ? item.imageUrl : `/api/item-image?name=${encodeURIComponent(item.name)}`;
  const isApiImg = itemImgUrl.startsWith('/api/item-image');

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
            {isApiImg ? (
              <img 
                src={itemImgUrl}
                alt={item.name}
                width={400} 
                height={300} 
                style={{ objectFit: 'cover', width: '100%', height: 180, borderRadius: 8 }}
                onError={e => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                loading="lazy"
              />
            ) : (
              <Image
                src={itemImgUrl}
                alt={item.name}
                width={400}
                height={300}
                className="rounded-md object-cover w-full h-40"
              />
            )}
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
// Remove second ItemCard export
