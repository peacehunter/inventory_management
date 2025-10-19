import type { Metadata } from 'next';
import Link from 'next/link';
import { BrainCircuit, FileText, LayoutDashboard } from 'lucide-react';
import './globals.css';
import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
  title: 'StockPilot',
  description: 'Your smart inventory management co-pilot.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased h-full')}>
        <SidebarProvider>
          <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
              <Logo className="text-sidebar-foreground" />
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={{ children: 'Dashboard' }}
                  >
                    <Link href="/">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={{ children: 'Reports' }}
                  >
                    <Link href="/reports">
                      <FileText />
                      <span>Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter />
          </Sidebar>
          <SidebarInset>
            <div className="h-full bg-background">{children}</div>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
