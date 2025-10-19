import { ReportsClient } from '@/components/reports/reports-client';
import { getItems, getSales } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const sales = await getSales();
  const items = await getItems();
  
  return (
    <div className="flex flex-col h-full">
      <ReportsClient sales={sales} items={items} />
    </div>
  );
}
