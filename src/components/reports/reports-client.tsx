'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalesSummary } from './sales-summary';
import { SalesHistoryTable } from './sales-history-table';
import { TrendsAnalysis } from './trends-analysis';
import type { Item, Sale } from '@/lib/types';
import { PageHeader } from '../page-header';

type ReportsClientProps = {
    sales: Sale[];
    items: Item[];
};

export function ReportsClient({ sales, items }: ReportsClientProps) {
  return (
    <>
        <PageHeader 
            title="Reports & Trends" 
            description="Analyze your sales data and get AI-powered insights." 
        />
        <main className="flex-1 p-6">
            <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Sales Overview</TabsTrigger>
                <TabsTrigger value="trends">AI Trends Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
                <SalesSummary sales={sales} items={items} />
                <SalesHistoryTable sales={sales} />
            </TabsContent>
            <TabsContent value="trends" className="mt-4">
                <TrendsAnalysis />
            </TabsContent>
            </Tabs>
        </main>
    </>
  );
}
