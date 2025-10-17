import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Calendar, DollarSign, Package, Clock, FileText } from "lucide-react";
import type { Rfq } from "@shared/schema";

const responseFormSchema = z.object({
  proposedPrice: z.string().min(1, "Price is required"),
  currency: z.enum(["USD", "JMD"]),
  proposedTimeline: z.string().min(1, "Timeline is required"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ResponseFormData = z.infer<typeof responseFormSchema>;

interface RFQResponse {
  id: string;
  rfqId: string;
  manufacturerId: string;
  proposedPrice: string;
  currency: string;
  proposedTimeline: string;
  message: string;
  isAwarded: boolean;
  createdAt: string;
}

export default function RFQDetail() {
  const [, params] = useRoute("/rfqs/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showResponseForm, setShowResponseForm] = useState(false);

  const rfqId = params?.id;

  // Fetch RFQ details
  const { data: rfq, isLoading: isLoadingRFQ } = useQuery<Rfq>({
    queryKey: ["/api/rfqs", rfqId],
    enabled: !!rfqId,
  });

  // Fetch RFQ responses
  const { data: responses = [], isLoading: isLoadingResponses } = useQuery<RFQResponse[]>({
    queryKey: [`/api/rfqs/${rfqId}/responses`],
    enabled: !!rfqId,
  });

  const form = useForm<ResponseFormData>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      proposedPrice: "",
      currency: "USD",
      proposedTimeline: "",
      message: "",
    },
  });

  const submitResponseMutation = useMutation({
    mutationFn: async (data: ResponseFormData) => {
      return await apiRequest(`/api/rfqs/${rfqId}/responses`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/rfqs/${rfqId}/responses`] });
      queryClient.invalidateQueries({ queryKey: ["/api/rfqs", rfqId] });
      toast({
        title: "Response Submitted",
        description: "Your proposal has been submitted successfully.",
      });
      setShowResponseForm(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ResponseFormData) => {
    submitResponseMutation.mutate(data);
  };

  if (isLoadingRFQ) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">RFQ Not Found</p>
            <p className="text-sm">The requested RFQ could not be found.</p>
          </div>
        </Card>
      </div>
    );
  }

  const isManufacturer = user?.role === "manufacturer";
  const isBrand = user?.role === "brand";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/rfqs")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-bold text-3xl" data-testid="heading-rfq-title">
              {rfq.title}
            </h1>
            <Badge variant="default">{rfq.status}</Badge>
          </div>
          <p className="text-muted-foreground">
            Posted {new Date(rfq.createdAt).toLocaleDateString()} • {rfq.responseCount || 0} responses
          </p>
        </div>
      </div>

      {/* RFQ Details */}
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{rfq.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Budget</span>
              </div>
              <div className="font-semibold">{rfq.currency} ${rfq.budget}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Package className="h-4 w-4" />
                <span className="text-sm">Quantity</span>
              </div>
              <div className="font-semibold">{rfq.quantity?.toLocaleString() || "N/A"}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Timeline</span>
              </div>
              <div className="font-semibold">{rfq.timeline || "N/A"}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Expires</span>
              </div>
              <div className="font-semibold">
                {rfq.expiresAt ? new Date(rfq.expiresAt).toLocaleDateString() : "N/A"}
              </div>
            </div>
          </div>

          {rfq.requirements && Object.keys(rfq.requirements).length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <div className="space-y-2">
                  {rfq.requirements.certifications && rfq.requirements.certifications.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Certifications: </span>
                      <span className="text-sm">{rfq.requirements.certifications.join(", ")}</span>
                    </div>
                  )}
                  {rfq.requirements.packaging && (
                    <div>
                      <span className="text-sm text-muted-foreground">Packaging: </span>
                      <span className="text-sm">{rfq.requirements.packaging}</span>
                    </div>
                  )}
                  {rfq.requirements.labeling && (
                    <div>
                      <span className="text-sm text-muted-foreground">Labeling: </span>
                      <span className="text-sm">{rfq.requirements.labeling}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Manufacturer Response Form */}
      {isManufacturer && rfq.status === "active" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Submit Proposal</CardTitle>
                <CardDescription>Provide your best quote for this opportunity</CardDescription>
              </div>
              {!showResponseForm && (
                <Button onClick={() => setShowResponseForm(true)} data-testid="button-show-response-form">
                  Submit Response
                </Button>
              )}
            </div>
          </CardHeader>
          {showResponseForm && (
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="proposedPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proposed Price</FormLabel>
                            <FormControl>
                              <Input placeholder="25000" {...field} data-testid="input-proposed-price" />
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
                          <FormControl>
                            <Input value={field.value} readOnly data-testid="input-currency" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="proposedTimeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposed Timeline</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 3 months" {...field} data-testid="input-proposed-timeline" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposal Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain your approach, capabilities, and why you're the best fit..."
                            className="min-h-32"
                            {...field}
                            data-testid="input-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={submitResponseMutation.isPending}
                      data-testid="button-submit-response"
                    >
                      {submitResponseMutation.isPending ? "Submitting..." : "Submit Proposal"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowResponseForm(false);
                        form.reset();
                      }}
                      disabled={submitResponseMutation.isPending}
                      data-testid="button-cancel-response"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          )}
        </Card>
      )}

      {/* Responses List */}
      {isBrand && (
        <Card>
          <CardHeader>
            <CardTitle>Responses ({responses.length})</CardTitle>
            <CardDescription>Review proposals from manufacturers</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingResponses ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : responses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="empty-state-responses">
                <p>No responses yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {responses.map((response) => (
                  <Card key={response.id} className="hover-elevate" data-testid={`card-response-${response.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="font-semibold text-lg mb-1">
                            {response.currency} ${response.proposedPrice}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Timeline: {response.proposedTimeline}
                          </div>
                        </div>
                        {response.isAwarded && (
                          <Badge variant="default">Awarded</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">
                        {response.message}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Submitted {new Date(response.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
