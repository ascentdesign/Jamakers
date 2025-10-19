import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CurrencySelector } from "@/components/CurrencySelector";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { user, isLoading } = useAuth();

  const [notifEnabled, setNotifEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem("jammakers-notifications-enabled");
    return stored === "1";
  });

  const handleNotificationsChange = (checked: boolean) => {
    setNotifEnabled(checked);
    localStorage.setItem("jammakers-notifications-enabled", checked ? "1" : "0");
  };

  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.email?.split("@")[0] || "User";

  return (
    <div className="mx-auto max-w-4xl space-y-6" data-testid="page-settings">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-semibold tracking-tight">Settings</h1>
        <Button variant="outline" size="sm" data-testid="button-go-profile" asChild>
          <Link href="/profile">
            Go to Profile
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card data-testid="card-account">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="text-sm font-medium">{displayName}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-sm font-medium">{user?.email || ""}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="text-sm font-medium capitalize">{user?.role?.replace("_", " ") || "Member"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-preferences">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Theme, currency and notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">Theme</div>
                  <div className="text-sm text-muted-foreground">Toggle light/dark mode.</div>
                </div>
                <ThemeToggle />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">Currency</div>
                  <div className="text-sm text-muted-foreground">Preferred display currency.</div>
                </div>
                <CurrencySelector />
              </div>

              <div className="flex items-center justify-between gap-4 flex-nowrap">
                <label htmlFor="notifications" className="min-w-0 flex-1 cursor-pointer select-none">
                  <div className="font-medium">Email notifications</div>
                  <div className="text-sm text-muted-foreground">Receive activity updates by email.</div>
                </label>
                 <Switch
                  id="notifications"
                   checked={notifEnabled}
                   onCheckedChange={handleNotificationsChange}
                   data-testid="switch-notifications"
                   className="shrink-0"
                 />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-security">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Basic security shortcuts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" data-testid="button-change-password" asChild>
              <Link href="/profile" className="inline-flex">
                Change password
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => window.location.href = "/api/logout"}
              data-testid="button-logout"
            >
              Log out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}