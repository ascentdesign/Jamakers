import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface LandingConfig {
  header: { brandName: string; showSignIn: boolean; showRegister: boolean };
  hero: { enabled: boolean; title?: string; subtitle?: string; ctaText?: string; ctaLink?: string };
  sections: { loginEnabled: boolean; featuresEnabled: boolean; howItWorksEnabled: boolean; footerEnabled: boolean };
  cta: { joinEnabled: boolean; joinLink: string };
}

export default function LandingCMS() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState<LandingConfig | null>(null);

  const { data, isLoading } = useQuery<LandingConfig>({
    queryKey: ["/api/cms/landing"],
  });

  useEffect(() => {
    if (data) setConfig(data);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: LandingConfig) => {
      const res = await apiRequest("PUT", "/api/cms/landing", payload);
      return await res.json();
    },
    onSuccess: (updated: LandingConfig) => {
      setConfig(updated);
      queryClient.invalidateQueries({ queryKey: ["/api/cms/landing"] });
      toast({ title: "Saved", description: "Landing configuration updated." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error?.message || "Failed to save.", variant: "destructive" });
    },
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Only administrators can manage the landing page content.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading || !config) {
    return <div className="p-6">Loading configuration…</div>;
  }

  const update = <K extends keyof LandingConfig>(key: K, value: LandingConfig[K]) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-4xl mb-2">Landing CMS</h1>
        <p className="text-muted-foreground text-lg">Control visibility and content for the public landing page.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Header</CardTitle>
          <CardDescription>Brand name and top-right actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Brand Name</label>
              <Input
                value={config.header.brandName || ""}
                onChange={(e) => update("header", { ...config.header, brandName: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Switch
                checked={config.header.showSignIn}
                onCheckedChange={(v) => update("header", { ...config.header, showSignIn: v })}
              />
              <span>Show "Sign In" button</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={config.header.showRegister}
                onCheckedChange={(v) => update("header", { ...config.header, showRegister: v })}
              />
              <span>Show "Register" button</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
          <CardDescription>Toggle major sections on the landing page</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={config.sections.loginEnabled}
              onCheckedChange={(v) => update("sections", { ...config.sections, loginEnabled: v })}
            />
            <span>Show Login Section</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={config.sections.featuresEnabled}
              onCheckedChange={(v) => update("sections", { ...config.sections, featuresEnabled: v })}
            />
            <span>Show Features</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={config.sections.howItWorksEnabled}
              onCheckedChange={(v) => update("sections", { ...config.sections, howItWorksEnabled: v })}
            />
            <span>Show "How It Works"</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={config.sections.footerEnabled}
              onCheckedChange={(v) => update("sections", { ...config.sections, footerEnabled: v })}
            />
            <span>Show Footer</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>Optional hero banner (currently disabled in UI)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={config.hero.enabled}
              onCheckedChange={(v) => update("hero", { ...config.hero, enabled: v })}
            />
            <span>Enable Hero Section (not rendered yet)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Hero Title</label>
              <Input
                value={config.hero.title || ""}
                onChange={(e) => update("hero", { ...config.hero, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hero Subtitle</label>
              <Textarea
                value={config.hero.subtitle || ""}
                onChange={(e) => update("hero", { ...config.hero, subtitle: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">CTA Text</label>
              <Input
                value={config.hero.ctaText || ""}
                onChange={(e) => update("hero", { ...config.hero, ctaText: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">CTA Link</label>
              <Input
                value={config.hero.ctaLink || ""}
                onChange={(e) => update("hero", { ...config.hero, ctaLink: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CTA</CardTitle>
          <CardDescription>Join button configuration</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={config.cta.joinEnabled}
              onCheckedChange={(v) => update("cta", { ...config.cta, joinEnabled: v })}
            />
            <span>Show Join CTA</span>
          </div>
          <div>
            <label className="text-sm font-medium">Join Link</label>
            <Input
              value={config.cta.joinLink || ""}
              onChange={(e) => update("cta", { ...config.cta, joinLink: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={() => config && saveMutation.mutate(config)}
          disabled={saveMutation.isPending}
          className="hover-elevate active-elevate-2"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}