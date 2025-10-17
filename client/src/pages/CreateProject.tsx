import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

const projectSchema = z.object({
  name: z.string().min(3, "Project name is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  rfqId: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  manufacturerId: z.string().min(1, "Manufacturer is required"),
  totalBudget: z.string().transform(val => parseFloat(val)).pipe(z.number().positive()),
  currency: z.enum(["JMD", "USD"]),
  startDate: z.string().min(1, "Start date is required"),
  expectedEndDate: z.string().min(1, "Expected end date is required"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface Milestone {
  title: string;
  description: string;
  dueDate: string;
  paymentAmount: number;
}

export default function CreateProject() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [, params] = useRoute("/projects/new/:rfqId");
  const rfqId = params?.rfqId;

  const [milestones, setMilestones] = useState<Milestone[]>([
    { title: "", description: "", dueDate: "", paymentAmount: 0 }
  ]);

  // Fetch RFQ details to pre-populate form
  const { data: rfq } = useQuery({
    queryKey: ["/api/rfqs", rfqId],
    enabled: !!rfqId,
  });

  // Fetch manufacturers for selection
  const { data: manufacturers } = useQuery<any[]>({
    queryKey: ["/api/manufacturers"],
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      rfqId: rfqId || "",
      manufacturerId: "",
      totalBudget: "",
      currency: "JMD",
      startDate: "",
      expectedEndDate: "",
    },
  });

  // Pre-populate form when RFQ data loads
  useEffect(() => {
    if (rfq) {
      form.reset({
        name: rfq.title || "",
        description: rfq.description || "",
        rfqId: rfqId || "",
        manufacturerId: "",
        totalBudget: "",
        currency: "JMD",
        startDate: "",
        expectedEndDate: "",
      });
    }
  }, [rfq, rfqId, form]);

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData & { milestones: Milestone[] }) => {
      return await apiRequest("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Created",
        description: "Your project has been created successfully.",
      });
      setLocation("/projects");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    createProjectMutation.mutate({
      ...data,
      milestones,
    });
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", description: "", dueDate: "", paymentAmount: 0 }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string | number) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl mb-2" data-testid="heading-create-project">
          Create New Project
        </h1>
        <p className="text-muted-foreground">
          Set up your manufacturing project with milestones and payment schedule
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Basic information about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Caribbean Beverage Production" {...field} data-testid="input-project-name" />
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
                        placeholder="Detailed project scope and objectives..."
                        className="min-h-24"
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
                name="manufacturerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-manufacturer">
                          <SelectValue placeholder="Select manufacturer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {manufacturers?.map(manufacturer => (
                          <SelectItem key={manufacturer.id} value={manufacturer.id}>
                            {manufacturer.businessName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Budget & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Budget & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Budget</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50000" {...field} data-testid="input-budget" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          <SelectItem value="JMD">JMD</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
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
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-start-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-end-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Milestones</CardTitle>
                  <CardDescription>Break down your project into milestones with payment schedules</CardDescription>
                </div>
                <Button type="button" onClick={addMilestone} variant="outline" size="sm" data-testid="button-add-milestone">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((milestone, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Milestone {index + 1}</h4>
                      {milestones.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMilestone(index)}
                          data-testid={`button-remove-milestone-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Milestone title"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, "title", e.target.value)}
                      data-testid={`input-milestone-title-${index}`}
                    />
                    <Textarea
                      placeholder="Milestone description"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, "description", e.target.value)}
                      data-testid={`input-milestone-description-${index}`}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => updateMilestone(index, "dueDate", e.target.value)}
                        data-testid={`input-milestone-due-date-${index}`}
                      />
                      <Input
                        type="number"
                        placeholder="Payment amount"
                        value={milestone.paymentAmount || ""}
                        onChange={(e) => updateMilestone(index, "paymentAmount", parseFloat(e.target.value) || 0)}
                        data-testid={`input-milestone-payment-${index}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createProjectMutation.isPending}
              data-testid="button-submit"
            >
              {createProjectMutation.isPending ? "Creating..." : "Create Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/projects")}
              disabled={createProjectMutation.isPending}
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
