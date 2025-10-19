import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const brandSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  productCategories: z.string().min(1, "Product categories are required"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required"),
});

type BrandFormData = z.infer<typeof brandSchema>;

export default function CreateBrandProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      companyName: "",
      description: "",
      productCategories: "",
      website: "",
      phone: "",
    },
  });

  const createBrandMutation = useMutation({
    mutationFn: async (data: BrandFormData) => {
      try {
        const payload: any = {
          companyName: data.companyName,
        };
        
        // Add optional fields only if they have values
        if (data.description) payload.description = data.description;
        if (data.productCategories) {
          const categories = data.productCategories.split(',').map(c => c.trim()).filter(c => c);
          if (categories.length > 0) {
            payload.industry = categories[0];
            payload.productCategories = categories;
          }
        }
        if (data.website) payload.website = data.website;
        if (data.phone) payload.phone = data.phone;
        
        const response = await apiRequest("POST", "/api/brands", payload);
        return await response.json();
      } catch (err: any) {
        console.error("Error creating brand:", err);
        throw err;
      }
    },
    onSuccess: (brand: any) => {
      // Ensure Profile page shows the new brand immediately
      queryClient.setQueryData(["/api/profile/brand"], brand);
      queryClient.invalidateQueries({ queryKey: ["/api/profile/brand"] });
      toast({
        title: "Profile Created",
        description: "Your brand profile has been created successfully.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      console.error("Brand creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BrandFormData) => {
    createBrandMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl mb-2" data-testid="heading-create-brand">
          Create Brand Profile
        </h1>
        <p className="text-muted-foreground">
          Complete your profile to start creating RFQs and finding manufacturers
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Tell us about your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Island Beverages Ltd." {...field} data-testid="input-company-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your brand, products, and manufacturing needs..."
                        className="min-h-32"
                        {...field}
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productCategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Categories</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Beverages, Snacks, Personal Care"
                        {...field}
                        data-testid="input-product-categories"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 876 123 4567" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} data-testid="input-website" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createBrandMutation.isPending}
              data-testid="button-submit"
            >
              {createBrandMutation.isPending ? "Creating..." : "Create Profile"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/")}
              disabled={createBrandMutation.isPending}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
