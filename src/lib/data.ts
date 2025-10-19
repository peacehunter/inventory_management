import 'server-only';
import type { Item, Sale } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Pool } from 'pg';

const defaultImage = PlaceHolderImages.find(img => img.id === 'product-default')!;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function getItems(): Promise<Item[]> {
  const result = await pool.query('SELECT * FROM items ORDER BY id DESC');
  return result.rows.map((r: any) => ({
    ...r,
    purchasePrice: Number(r.purchaseprice),
    sellingPrice: Number(r.sellingprice),
    quantity: Number(r.quantity),
    lowStockThreshold: Number(r.lowstockthreshold),
  }));
}

export async function getItem(id: string): Promise<Item | undefined> {
  const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
  const row = result.rows[0];
  if (!row) return undefined;
  return {
    ...row,
    purchasePrice: Number(row.purchaseprice),
    sellingPrice: Number(row.sellingprice),
    quantity: Number(row.quantity),
    lowStockThreshold: Number(row.lowstockthreshold),
  };
}

export async function addItem(item: Omit<Item, 'id' | 'imageUrl' | 'imageHint'>): Promise<Item> {
  const insert = await pool.query(
    'INSERT INTO items (name, description, purchasePrice, sellingPrice, quantity, lowStockThreshold, imageUrl, imageHint) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [
      item.name,
      item.description,
      item.purchasePrice,
      item.sellingPrice,
      item.quantity,
      item.lowStockThreshold,
      defaultImage.imageUrl,
      defaultImage.imageHint,
    ]
  );
  return insert.rows[0];
}

export async function deleteItem(id: string): Promise<void> {
  await pool.query('DELETE FROM items WHERE id = $1', [id]);
}

export async function getSales(): Promise<Sale[]> {
  const result = await pool.query('SELECT * FROM sales ORDER BY date DESC');
  return result.rows;
}

export async function recordSale(itemId: string, quantitySold: number): Promise<Sale | null> {
  const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [itemId]);
  const item = itemResult.rows[0];
  if (!item || item.quantity < quantitySold) {
    return null;
  }
  // Update item quantity
  await pool.query('UPDATE items SET quantity = quantity - $1 WHERE id = $2', [quantitySold, itemId]);

  const newSale = await pool.query(
    'INSERT INTO sales (itemId, itemName, quantity, pricePerItem, totalPrice, date) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
    [itemId, item.name, quantitySold, item.sellingPrice, item.sellingPrice * quantitySold]
  );
  return newSale.rows[0];
}
