// Reference: design_guidelines.md - Shadcn sidebar usage

import { Building2, FileText, Home, MessageSquare, Search, Settings, Users, Briefcase, ShieldCheck, BookOpen, TrendingUp, FilePlus, Factory, DollarSign, GraduationCap, Package, Lightbulb, Palette } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export function AppSidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { title: "Home", url: "/", icon: Home },
      { title: "Manufacturers", url: "/manufacturers", icon: Factory },
      { title: "Raw Materials", url: "/raw-materials", icon: Package },
      { title: "Projects", url: "/projects", icon: Briefcase },
      { title: "Finance", url: "/finance", icon: DollarSign },
      { title: "Creators", url: "/creators", icon: Lightbulb },
      { title: "Designers", url: "/designers", icon: Palette },
      { title: "Training", url: "/training", icon: GraduationCap },
      { title: "Messages", url: "/messages", icon: MessageSquare },
      { title: "Resources", url: "/resources", icon: BookOpen },
    ];

    if (user?.role === "brand") {
      return [
        ...commonItems.slice(0, 8), // Home + Directory + Raw Materials + Projects + Finance + Creators + Designers + Training
        { title: "My RFQs", url: "/rfqs", icon: FileText },
        ...commonItems.slice(8), // Messages + Resources
      ];
    }

    if (user?.role === "manufacturer") {
      return [
        ...commonItems.slice(0, 8), // Home + Directory + Raw Materials + Projects + Finance + Creators + Designers + Training
        { title: "My Profile", url: "/manufacturer/profile", icon: Building2 },
        { title: "Opportunities", url: "/opportunities", icon: Search },
        { title: "Verification", url: "/verification", icon: ShieldCheck },
        ...commonItems.slice(8), // Messages + Resources
      ];
    }

    if (user?.role === "financial_institution") {
      return [
        ...commonItems.slice(0, 8), // Home + Directory + Raw Materials + Projects + Finance + Creators + Designers + Training
        { title: "Financing Leads", url: "/financing/leads", icon: TrendingUp },
        { title: "Applications", url: "/financing/applications", icon: FileText },
        ...commonItems.slice(8), // Messages + Resources
      ];
    }

    if (user?.role === "admin") {
      return [
        ...commonItems.slice(0, 8), // Home + Directory + Raw Materials + Projects + Finance + Creators + Designers + Training
        { title: "Verifications", url: "/admin/verifications", icon: ShieldCheck },
        { title: "Users", url: "/admin/users", icon: Users },
        { title: "Analytics", url: "/admin/analytics", icon: TrendingUp },
        ...commonItems.slice(8), // Messages + Resources
      ];
    }

    return commonItems;
  };

  const items = getNavigationItems();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <Sidebar collapsible="icon" data-testid="app-sidebar">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
          <div className="flex items-center justify-center h-10 w-10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 rounded-md bg-primary text-primary-foreground font-display font-bold text-lg">
            JM
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-display font-semibold text-base"> JA Makers</span>
            <span className="text-xs text-muted-foreground">Manufacturing Hub</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Create RFP/RFQ Button - Only for brands */}
        {user?.role === "brand" && (
          <SidebarGroup>
            <SidebarGroupContent>
               <Button 
                 asChild 
                 className="w-full h-9 px-3 justify-start gap-2 bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary-border group-data-[collapsible=icon]:!w-8 group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0" 
                 data-testid="button-create-rfp"
               >
                 <Link href="/rfqs/new" aria-label="Create RFP">
                   <FilePlus className="h-4 w-4" />
                   <span className="truncate group-data-[collapsible=icon]:hidden">Create RFP</span>
                 </Link>
               </Button>
             </SidebarGroupContent>
           </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`nav-${typeof item.title === 'string' ? item.title.toLowerCase().replace(/\s+/g, '-') : 'item'}`}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/settings"} data-testid="nav-settings">
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9" data-testid="avatar-user">
            <AvatarImage src={user?.profileImageUrl || undefined} className="object-cover" />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate" data-testid="text-user-name">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.email?.split('@')[0] || "User"}
            </span>
            <span className="text-xs text-muted-foreground truncate capitalize" data-testid="text-user-role">
              {user?.role?.replace('_', ' ') || "Member"}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
