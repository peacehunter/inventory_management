import { getItems } from '@/lib/data';
import { InventoryClient } from '@/components/inventory/inventory-client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const items = await getItems();

  return (
    <div className="flex flex-col h-full">
      <InventoryClient items={items} />
    </div>
  );
}
