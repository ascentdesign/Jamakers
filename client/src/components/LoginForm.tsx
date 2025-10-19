import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLogin } from "@/hooks/useLogin";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";

export function LoginForm() {
  const { toast } = useToast();
  const login = useLogin();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"brand" | "manufacturer" | "admin" | "creator" | "designer">("brand");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ username, password, role });
      toast({ title: "Signed in", description: `Logged in as ${role}` });
      // Small delay to ensure auth state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = "/";
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message || "Please try again.", variant: "destructive" });
    }
  };

  const onDemoLogin = async () => {
    try {
      await login.mutateAsync({ username: "admin", password: "admin", role: "brand" });
      toast({ title: "Signed in", description: "Logged in as demo admin (brand)" });
      // Small delay to ensure auth state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = "/";
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message || "Please try again.", variant: "destructive" });
    }
  };

  const onForgotPassword = () => {
    toast({
      title: "Password reset",
      description: "Password reset is not yet configured. Please use demo login or register a new account.",
    });
  };

  return (
    <Card className="max-w-md w-full">
   <CardHeader>

      <CardDescription>Sign in with a role to explore the app.</CardDescription>
      <CardDescription></CardDescription>
  </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="alice" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="manufacturer">Manufacturer</SelectItem>
                <SelectItem value="creator">Creator</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={login.isPending} data-testid="button-sign-in">
            {login.isPending ? "Signing in..." : "Sign In"}
          </Button>

          {/* Secondary actions */}
          <div className="mt-2">
            <Button type="button" variant="secondary" className="w-full" onClick={onDemoLogin} disabled={login.isPending} data-testid="button-demo-login">
              Sign in with Demo
            </Button>
          </div>
          <div className="flex justify-between mt-2">
            <Button type="button" variant="ghost" onClick={onForgotPassword} data-testid="button-forgot-password">
              Forgot Password
            </Button>
            <Button asChild variant="outline" data-testid="button-register">
              <Link href="/signup">Register New User</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}