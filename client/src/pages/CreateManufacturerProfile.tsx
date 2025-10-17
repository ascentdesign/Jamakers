import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileUploader } from "@/components/FileUploader";
import { useState } from "react";

const manufacturerSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  industry: z.string().min(1, "Industry is required"),
  address: z.string().min(5, "Address is required"),
  parish: z.string().min(1, "Parish is required"),
  phone: z.string().min(1, "Phone is required"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  productionCapacityPerMonth: z.string().transform(val => parseInt(val, 10)).pipe(z.number().positive()),
  minimumOrderQuantity: z.string().transform(val => parseInt(val, 10)).pipe(z.number().positive()),
  leadTime: z.string().min(1, "Lead time is required"),
});

type ManufacturerFormData = z.infer<typeof manufacturerSchema>;

const parishes = [
  "Kingston", "St. Andrew", "St. Catherine", "Clarendon", "Manchester",
  "St. Elizabeth", "Westmoreland", "Hanover", "St. James", "Trelawny",
  "St. Ann", "St. Mary", "Portland", "St. Thomas"
];

const industries = [
  "Food & Beverage",
  "Personal Care & Cosmetics",
  "Textiles & Apparel",
  "Packaging",
  "Industrial Manufacturing",
  "Agro-Processing",
  "Other"
];

export default function CreateManufacturerProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Array<{name: string, url: string}>>([]);

  const form = useForm<ManufacturerFormData>({
    resolver: zodResolver(manufacturerSchema),
    defaultValues: {
      businessName: "",
      description: "",
      industry: "",
      address: "",
      parish: "",
      phone: "",
      website: "",
      productionCapacityPerMonth: "",
      minimumOrderQuantity: "",
      leadTime: "",
    },
  });

  const createManufacturerMutation = useMutation({
    mutationFn: async (data: ManufacturerFormData) => {
      const payload = {
        ...data,
        photos: photos.map(p => p.url),
      };
      return await apiRequest("/api/manufacturers", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/manufacturers"] });
      toast({
        title: "Profile Created",
        description: "Your manufacturer profile has been created successfully.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ManufacturerFormData) => {
    createManufacturerMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl mb-2" data-testid="heading-create-manufacturer">
          Create Manufacturer Profile
        </h1>
        <p className="text-muted-foreground">
          Complete your profile to start receiving RFQs from brands
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell us about your manufacturing business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Caribbean Manufacturing Solutions" {...field} data-testid="input-business-name" />
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
                        placeholder="Describe your manufacturing capabilities, experience, and specializations..."
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
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-industry">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact & Location */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Industrial Estate, Kingston" {...field} data-testid="input-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="parish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parish</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-parish">
                            <SelectValue placeholder="Select parish" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parishes.map(parish => (
                            <SelectItem key={parish} value={parish}>{parish}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

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
            </CardContent>
          </Card>

          {/* Production Capacity */}
          <Card>
            <CardHeader>
              <CardTitle>Production Capacity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="productionCapacityPerMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Capacity (units/month)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10000" {...field} data-testid="input-capacity" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumOrderQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Order Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000" {...field} data-testid="input-moq" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leadTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 4-6 weeks" {...field} data-testid="input-lead-time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Facility Photos</CardTitle>
              <CardDescription>Upload photos of your manufacturing facility</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader
                maxFiles={10}
                acceptedFileTypes={["image/*"]}
                onUploadComplete={(files) => setPhotos(files)}
                isPublic={true}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createManufacturerMutation.isPending}
              data-testid="button-submit"
            >
              {createManufacturerMutation.isPending ? "Creating..." : "Create Profile"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/")}
              disabled={createManufacturerMutation.isPending}
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
