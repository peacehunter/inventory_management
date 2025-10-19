'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addItem as dbAddItem, deleteItem as dbDeleteItem, recordSale as dbRecordSale, getSales } from './data';
import { analyzeSalesTrends } from '@/ai/flows/analyze-sales-trends';

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  purchasePrice: z.coerce.number().min(0, 'Purchase price must be non-negative'),
  sellingPrice: z.coerce.number().min(0, 'Selling price must be non-negative'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be a non-negative integer'),
  lowStockThreshold: z.coerce.number().int().min(0, 'Threshold must be a non-negative integer'),
});

export async function addItemAction(prevState: any, formData: FormData) {
  const validatedFields = itemSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    await dbAddItem(validatedFields.data);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { errors: { _server: ['Failed to add item.'] } };
  }
}

export async function deleteItemAction(itemId: string) {
    try {
        await dbDeleteItem(itemId);
        revalidatePath('/');
        revalidatePath('/reports');
    } catch (error) {
        console.error('Failed to delete item:', error);
        // In a real app, you'd return an error object
    }
}


const sellItemSchema = z.object({
    itemId: z.string(),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export async function sellItemAction(prevState: any, formData: FormData) {
    const validatedFields = sellItemSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { itemId, quantity } = validatedFields.data;

    try {
        const result = await dbRecordSale(itemId, quantity);
        if (!result) {
            return { errors: { quantity: ["Not enough stock available."] } };
        }
        revalidatePath('/');
        revalidatePath('/reports');
        return { success: true };
    } catch (error) {
        return { errors: { _server: ['Failed to record sale.'] } };
    }
}

export async function generateTrendsAnalysisAction() {
    try {
        const sales = await getSales();
        const salesDataString = sales
            .map(sale => `${sale.itemName}:${sale.quantity}`)
            .join(', ');

        if (!salesDataString) {
            return {
                trendsAnalysis: "Not enough sales data to perform analysis.",
                suggestedActions: "Record more sales to enable this feature."
            }
        }
        
        const analysis = await analyzeSalesTrends({ salesData: salesDataString });
        return analysis;

    } catch (error) {
        console.error("Error generating trends analysis:", error);
        return {
            error: "Failed to generate AI analysis. Please try again later."
        };
    }
}
