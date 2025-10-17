import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Building2, MapPin, Phone, Mail, ExternalLink, TrendingUp, FileText, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FinancialInstitution, LoanProduct } from "@shared/schema";

const loanApplicationSchema = z.object({
  requestedAmount: z.coerce.number().positive("Amount must be greater than 0"),
  requestedTermMonths: z.coerce.number().int().positive("Term must be a positive number of months"),
  purpose: z.string().min(20, "Please provide at least 20 characters describing the loan purpose"),
  businessRevenue: z.coerce.number().positive().optional().or(z.literal('')),
  yearsInBusiness: z.coerce.number().int().positive().optional().or(z.literal('')),
  employeeCount: z.coerce.number().int().positive().optional().or(z.literal('')),
  collateralDescription: z.string().optional(),
});

export default function LenderDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const { data: lender, isLoading: isLoadingLender } = useQuery<FinancialInstitution>({
    queryKey: [`/api/finance/lenders/${id}`],
  });

  const { data: loanProducts = [], isLoading: isLoadingProducts } = useQuery<LoanProduct[]>({
    queryKey: [`/api/finance/lenders/${id}/loan-products`],
  });

  const form = useForm<z.infer<typeof loanApplicationSchema>>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      requestedAmount: "",
      requestedTermMonths: "",
      purpose: "",
      businessRevenue: "",
      yearsInBusiness: "",
      employeeCount: "",
      collateralDescription: "",
    },
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof loanApplicationSchema>) => {
      if (!selectedProduct) throw new Error("No product selected");
      
      return apiRequest(`/api/finance/loan-applications`, {
        method: "POST",
        body: JSON.stringify({
          loanProductId: selectedProduct.id,
          ...data,
          requestedAmount: parseFloat(data.requestedAmount),
          requestedTermMonths: parseInt(data.requestedTermMonths),
          businessRevenue: data.businessRevenue ? parseFloat(data.businessRevenue) : null,
          yearsInBusiness: data.yearsInBusiness ? parseInt(data.yearsInBusiness) : null,
          employeeCount: data.employeeCount ? parseInt(data.employeeCount) : null,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/finance/loan-applications"] });
      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully. The lender will review it shortly.",
      });
      setShowApplicationForm(false);
      form.reset();
      setSelectedProduct(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit loan application",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof loanApplicationSchema>) => {
    applicationMutation.mutate(data);
  };

  if (isLoadingLender || !lender) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="hover-elevate" data-testid="button-back-to-finance">
        <Link href="/finance">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Finance Directory
        </Link>
      </Button>

      {/* Lender Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Logo */}
            <div className="h-24 w-24 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
              {lender.logoUrl ? (
                <img
                  src={lender.logoUrl}
                  alt={lender.institutionName}
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <Building2 className="h-12 w-12 text-muted-foreground" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h1 className="font-display font-bold text-3xl" data-testid="heading-lender-name">
                  {lender.institutionName}
                </h1>
                {lender.institutionType && (
                  <Badge variant="secondary" className="capitalize">
                    {lender.institutionType}
                  </Badge>
                )}
              </div>

              {lender.description && (
                <p className="text-muted-foreground mb-4">{lender.description}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {lender.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{lender.location}</span>
                  </div>
                )}
                {lender.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{lender.phone}</span>
                  </div>
                )}
                {lender.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>{lender.email}</span>
                  </div>
                )}
                {lender.website && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <a
                      href={lender.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Products */}
      <div>
        <h2 className="font-display font-bold text-2xl mb-4">Loan Products</h2>

        {isLoadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : loanProducts.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No loan products available at this time.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loanProducts.map((product) => (
              <Card key={product.id} data-testid={`card-loan-product-${product.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{product.productName}</CardTitle>
                    {product.loanType && (
                      <Badge variant="outline" className="capitalize">
                        {product.loanType}
                      </Badge>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Loan Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Loan Amount</div>
                      <div className="font-semibold">
                        ${Number(product.minAmount).toLocaleString()} - ${Number(product.maxAmount).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Interest Rate</div>
                      <div className="font-semibold">
                        {product.interestRateMin}% - {product.interestRateMax}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Term</div>
                      <div className="font-semibold">
                        {product.termMonthsMin} - {product.termMonthsMax} months
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Currency</div>
                      <div className="font-semibold">{product.currency}</div>
                    </div>
                  </div>

                  {/* Features */}
                  {product.features && (product.features as string[]).length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Features</div>
                      <div className="space-y-1">
                        {(product.features as string[]).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {product.requirements && (product.requirements as string[]).length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Requirements</div>
                      <div className="flex flex-wrap gap-2">
                        {(product.requirements as string[]).map((req, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Apply Button */}
                  <Button
                    variant="default"
                    className="w-full hover-elevate active-elevate-2"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowApplicationForm(true);
                    }}
                    data-testid={`button-apply-${product.id}`}
                  >
                    Apply for This Loan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Loan Application Form */}
      {showApplicationForm && selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Loan Application - {selectedProduct.productName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete the form below to apply for this loan product
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="requestedAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requested Loan Amount *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            {...field}
                            data-testid="input-loan-amount"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requestedTermMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Term (months) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter term in months"
                            {...field}
                            data-testid="input-loan-term"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Purpose *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe how you plan to use this loan..."
                          className="min-h-24"
                          {...field}
                          data-testid="textarea-loan-purpose"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="businessRevenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Business Revenue</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter annual revenue"
                            {...field}
                            data-testid="input-business-revenue"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearsInBusiness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years in Business</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter years"
                            {...field}
                            data-testid="input-years-in-business"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter employee count"
                            {...field}
                            data-testid="input-employee-count"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="collateralDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collateral Description (if applicable)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe any collateral you can provide..."
                          {...field}
                          data-testid="textarea-collateral"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowApplicationForm(false);
                      setSelectedProduct(null);
                      form.reset();
                    }}
                    data-testid="button-cancel-application"
                    className="hover-elevate"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={applicationMutation.isPending}
                    data-testid="button-submit-application"
                    className="hover-elevate active-elevate-2"
                  >
                    {applicationMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
