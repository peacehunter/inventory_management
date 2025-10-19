export type Item = {
  id: string;
  name: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  imageUrl: string;
  imageHint: string;
};

export type Sale = {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  pricePerItem: number;
  totalPrice: number;
  date: string;
};
