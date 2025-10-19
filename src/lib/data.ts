import 'server-only';
import type { Item, Sale } from './types';
import { PlaceHolderImages } from './placeholder-images';

const defaultImage = PlaceHolderImages.find(img => img.id === 'product-default')!;

let items: Item[] = [];

let sales: Sale[] = [];

// Simulate database latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getItems(): Promise<Item[]> {
  await delay(100);
  return items;
}

export async function getItem(id: string): Promise<Item | undefined> {
  await delay(100);
  return items.find(item => item.id === id);
}

export async function getSales(): Promise<Sale[]> {
  await delay(100);
  return sales;
}

export async function addItem(item: Omit<Item, 'id' | 'imageUrl' | 'imageHint'>): Promise<Item> {
  await delay(200);
  const newItem: Item = {
    ...item,
    id: `item-${Date.now()}`,
    imageUrl: defaultImage.imageUrl,
    imageHint: defaultImage.imageHint,
  };
  items.unshift(newItem);
  return newItem;
}

export async function deleteItem(id: string): Promise<void> {
    await delay(200);
    items = items.filter(item => item.id !== id);
}

export async function recordSale(itemId: string, quantitySold: number): Promise<Sale | null> {
    await delay(200);
    const item = items.find(i => i.id === itemId);
    if (!item || item.quantity < quantitySold) {
        return null;
    }
    item.quantity -= quantitySold;
    const newSale: Sale = {
        id: `sale-${Date.now()}`,
        itemId: item.id,
        itemName: item.name,
        quantity: quantitySold,
        pricePerItem: item.sellingPrice,
        totalPrice: item.sellingPrice * quantitySold,
        date: new Date().toISOString(),
    };
    sales.unshift(newSale);
    return newSale;
}
