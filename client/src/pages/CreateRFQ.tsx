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
import { ArrowLeft } from "lucide-react";

const rfqFormSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string().min(1, "Category is required"),
  budget: z.string().min(1, "Budget is required"),
  currency: z.enum(["USD", "JMD"]),
  // Accept both string and number input, coerce to a positive integer
  quantity: z.coerce.number().int().positive(),
  timeline: z.string().min(1, "Timeline is required"),
  certifications: z.string().optional(),
  packaging: z.string().optional(),
  labeling: z.string().optional(),
  expiresAt: z.string().min(1, "Expiration date is required"),
});

type RFQFormData = z.infer<typeof rfqFormSchema>;

export default function CreateRFQ() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<RFQFormData>({
    resolver: zodResolver(rfqFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      budget: "",
      currency: "USD",
      quantity: 1,
      timeline: "",
      certifications: "",
      packaging: "",
      labeling: "",
      expiresAt: "",
    },
  });

  const createRFQMutation = useMutation({
    mutationFn: async (data: RFQFormData) => {
      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        budget: data.budget,
        currency: data.currency,
        quantity: parseInt(data.quantity.toString(), 10),
        timeline: data.timeline,
        requirements: {
          certifications: data.certifications ? data.certifications.split(',').map(c => c.trim()) : [],
          packaging: data.packaging,
          labeling: data.labeling,
        },
        expiresAt: new Date(data.expiresAt).toISOString(),
        status: "draft",
      };
      const response = await apiRequest("POST", "/api/rfqs", payload);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rfqs"] });
      toast({
        title: "RFQ Created",
        description: "Your Request for Quote has been created successfully.",
      });
      setLocation("/rfqs");
    },
  });

  return (
    <div className="container mx-auto p-4 min-h-0">
      <Button variant="ghost" className="mb-4" onClick={() => setLocation('/rfqs')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to RFQs
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create RFQ</CardTitle>
          <CardDescription>
            Fill out the form below to create a Request for Quote and connect with qualified manufacturers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => createRFQMutation.mutate(data))}
              className="space-y-8"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Custom Hot Sauce Production - 10,000 bottles"
                          {...field}
                          data-testid="input-title"
                        />
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
                          placeholder="Provide detailed information about your manufacturing requirements..."
                          className="min-h-32"
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormDescription>
                        Include specifications, quality requirements, and any special considerations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Food & Beverage" {...field} data-testid="input-category" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10000"
                            {...field}
                            data-testid="input-quantity"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Budget & Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Budget & Timeline</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="25000"
                              {...field}
                              data-testid="input-budget"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-currency">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="JMD">JMD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeline</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 3 months"
                            {...field}
                            data-testid="input-timeline"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            data-testid="input-expires-at"
                          />
                        </FormControl>
                        <FormDescription>
                          Last date to receive responses
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Requirements</h3>

                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Certifications</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., HACCP, GMP, ISO 9001"
                          {...field}
                          data-testid="input-certifications"
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of required certifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="packaging"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Packaging Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your packaging requirements..."
                          {...field}
                          data-testid="input-packaging"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="labeling"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Labeling Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your labeling requirements..."
                          {...field}
                          data-testid="input-labeling"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="submit" data-testid="button-submit-rfq" disabled={createRFQMutation.isPending}>
                  {createRFQMutation.isPending ? "Creating..." : "Create RFQ"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
