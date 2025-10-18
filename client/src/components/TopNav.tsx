import { Bell, Search, User, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencySelector } from "./CurrencySelector";
import { useAuth } from "@/hooks/useAuth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface TopNavProps {
  showSearch?: boolean;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export function TopNav({ showSearch = true }: TopNavProps) {
  const { user } = useAuth();

  // Fetch notifications
  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
  const recentNotifications = notifications?.slice(0, 3) || [];

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user?.firstName[0]}${user?.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" className="-ml-1">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </SidebarTrigger>

        {showSearch && (
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search manufacturers, products, or services..."
                className="pl-10 pr-4"
                data-testid="input-search"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <CurrencySelector />
          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover-elevate active-elevate-2"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    data-testid="badge-notification-count"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Link href="/notifications">
                  <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                    View all
                  </Button>
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {recentNotifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  recentNotifications.map((notification) => (
                    <Link key={notification.id} href={notification.linkUrl || "/notifications"}>
                      <DropdownMenuItem className="flex flex-col items-start py-3 hover-elevate cursor-pointer">
                        <div className="flex items-center gap-2 w-full">
                          <div className="font-medium flex-1">{notification.title}</div>
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full hover-elevate active-elevate-2"
                data-testid="button-user-menu"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.profileImageUrl || undefined} className="object-cover" />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none" data-testid="text-user-menu-name">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email?.split('@')[0] || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground" data-testid="text-user-menu-email">
                    {user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem className="hover-elevate cursor-pointer" data-testid="menu-item-profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="hover-elevate cursor-pointer" data-testid="menu-item-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover-elevate cursor-pointer text-destructive"
                onClick={() => window.location.href = "/api/logout"}
                data-testid="menu-item-logout"
              >
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
