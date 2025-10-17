import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package, Plus, Trash2, ChevronLeft, DollarSign } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Project, RawMaterial, RawMaterialSupplier } from "@shared/schema";

const addMaterialSchema = z.object({
  rawMaterialId: z.string().min(1, "Please select a material"),
  supplierId: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.coerce.number().min(0, "Price must be positive").optional(),
  currency: z.string().default("JMD"),
  notes: z.string().optional(),
});

type AddMaterialForm = z.infer<typeof addMaterialSchema>;

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");

  // Fetch project
  const { data: project, isLoading: isLoadingProject } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error("Failed to fetch project");
      return res.json();
    },
  });

  // Fetch project materials
  const { data: projectMaterials = [], isLoading: isLoadingMaterials } = useQuery({
    queryKey: ["/api/projects", id, "materials"],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}/materials`);
      if (!res.ok) throw new Error("Failed to fetch materials");
      return res.json();
    },
  });

  // Fetch materials cost
  const { data: materialsCost } = useQuery({
    queryKey: ["/api/projects", id, "materials/cost"],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}/materials/cost`);
      if (!res.ok) throw new Error("Failed to fetch cost");
      return res.json();
    },
  });

  // Fetch all raw materials for selection
  const { data: allMaterials = [] } = useQuery<RawMaterial[]>({
    queryKey: ["/api/raw-materials"],
  });

  // Fetch suppliers for selected material
  const { data: suppliers = [] } = useQuery<Array<RawMaterialSupplier & { manufacturer: any }>>({
    queryKey: ["/api/raw-materials", selectedMaterialId, "suppliers"],
    enabled: !!selectedMaterialId,
  });

  const form = useForm<AddMaterialForm>({
    resolver: zodResolver(addMaterialSchema),
    defaultValues: {
      quantity: 1,
      currency: "JMD",
    },
  });

  // Add material mutation
  const addMaterialMutation = useMutation({
    mutationFn: async (data: AddMaterialForm) => {
      const res = await fetch(`/api/projects/${id}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add material");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "materials/cost"] });
      toast({
        title: "Material Added",
        description: "Material has been added to the project",
      });
      setDialogOpen(false);
      form.reset();
      setSelectedMaterialId("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add material",
        variant: "destructive",
      });
    },
  });

  // Remove material mutation
  const removeMaterialMutation = useMutation({
    mutationFn: async (materialId: string) => {
      const res = await fetch(`/api/project-materials/${materialId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove material");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "materials"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "materials/cost"] });
      toast({
        title: "Material Removed",
        description: "Material has been removed from the project",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove material",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddMaterialForm) => {
    addMaterialMutation.mutate(data);
  };

  // Watch for material selection to fetch suppliers and set price
  const watchMaterialId = form.watch("rawMaterialId");
  const watchSupplierId = form.watch("supplierId");

  // Update selected material when form value changes
  useEffect(() => {
    if (watchMaterialId !== selectedMaterialId) {
      setSelectedMaterialId(watchMaterialId);
    }
  }, [watchMaterialId, selectedMaterialId]);

  // Auto-populate price when supplier is selected
  useEffect(() => {
    if (watchSupplierId && suppliers.length > 0) {
      const selectedSupplier = suppliers.find(s => s.id === watchSupplierId);
      if (selectedSupplier && selectedSupplier.pricePerUnit) {
        const currentPrice = form.getValues("unitPrice");
        if (currentPrice !== selectedSupplier.pricePerUnit) {
          form.setValue("unitPrice", selectedSupplier.pricePerUnit);
          form.setValue("currency", selectedSupplier.currency || "JMD");
        }
      }
    }
  }, [watchSupplierId, suppliers, form]);

  const formatCurrency = (amount: number | null | undefined, currency: string = "JMD") => {
    if (!amount) return `${currency} 0.00`;
    return `${currency} ${(amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (isLoadingProject) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/projects")}
          data-testid="button-back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display font-bold text-3xl" data-testid="heading-project-title">
            {project.title || `Project ${project.id.slice(0, 8)}`}
          </h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default" data-testid="badge-project-status">
              {project.status?.replace('_', ' ') || 'Unknown'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-project-budget">
              {formatCurrency(project.budget ? parseFloat(project.budget) * 100 : null, project.currency || 'JMD')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials Cost</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-materials-cost">
              {materialsCost ? formatCurrency(materialsCost.totalCost, materialsCost.currency) : "JMD 0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materials Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Project Materials</CardTitle>
              <CardDescription>Manage raw materials for this project</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-material">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Material to Project</DialogTitle>
                  <DialogDescription>
                    Select a raw material and specify the quantity needed
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="rawMaterialId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-material">
                                <SelectValue placeholder="Select a material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {allMaterials.map((material) => (
                                <SelectItem key={material.id} value={material.id}>
                                  {material.name} ({material.unitOfMeasure})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {suppliers.length > 0 && (
                      <FormField
                        control={form.control}
                        name="supplierId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supplier (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-supplier">
                                  <SelectValue placeholder="Select a supplier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {suppliers.map((supplier) => (
                                  <SelectItem key={supplier.id} value={supplier.id}>
                                    {supplier.manufacturer?.businessName} - {formatCurrency(supplier.pricePerUnit, supplier.currency || 'JMD')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              data-testid="input-quantity"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unitPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Price (in cents)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              data-testid="input-unit-price"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-notes" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={addMaterialMutation.isPending}
                        data-testid="button-submit-material"
                      >
                        {addMaterialMutation.isPending ? "Adding..." : "Add Material"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingMaterials ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : projectMaterials.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground" data-testid="empty-state-materials">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Materials Added</p>
              <p className="text-sm">Add raw materials to track costs and requirements</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projectMaterials.map((pm: any) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                  data-testid={`material-item-${pm.id}`}
                >
                  <div className="flex-1">
                    <div className="font-medium" data-testid={`text-material-name-${pm.id}`}>
                      {pm.material?.name || "Unknown Material"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quantity: {pm.quantity} {pm.material?.unitOfMeasure}
                      {pm.supplier && (
                        <span className="ml-2">
                          • Supplier: {pm.supplier.manufacturer?.businessName}
                        </span>
                      )}
                    </div>
                    {pm.notes && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Note: {pm.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold" data-testid={`text-material-cost-${pm.id}`}>
                        {formatCurrency(pm.totalCost, pm.currency)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(pm.unitPrice, pm.currency || 'JMD')} per {pm.material?.unitOfMeasure}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMaterialMutation.mutate(pm.id)}
                      disabled={removeMaterialMutation.isPending}
                      data-testid={`button-remove-material-${pm.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
