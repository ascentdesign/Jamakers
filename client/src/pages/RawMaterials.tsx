import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Package, Users, ImageIcon } from "lucide-react";
import type { RawMaterial } from "@shared/schema";

export default function RawMaterials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: materials, isLoading } = useQuery<RawMaterial[]>({
    queryKey: ['/api/raw-materials'],
  });

  // Get unique categories from materials
  const categories = materials 
    ? Array.from(new Set(materials.map(m => m.category).filter(Boolean)))
    : [];

  // Filter materials based on search and category
  const filteredMaterials = materials?.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || material.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const formatPrice = (price: number | null, currency: string | null) => {
    if (!price) return "Price on request";
    const amount = (price / 100).toFixed(2);
    return `${currency || 'JMD'} $${amount}`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Raw Materials Directory</h1>
          <p className="text-lg opacity-90">
            Browse available raw materials and connect with verified suppliers
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-background border-b p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-materials"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category || ""}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <ScrollArea className="h-[calc(100vh-300px)]">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMaterials.length === 0 ? (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                {materials?.length === 0 
                  ? "No raw materials available at the moment."
                  : "No materials match your search criteria."}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMaterials.map((material) => (
                <Link key={material.id} href={`/raw-materials/${material.id}`}>
                  <Card className="hover-elevate active-elevate-2 h-full cursor-pointer overflow-hidden" data-testid={`card-material-${material.id}`}>
                    {/* Material Image */}
                    <div className="relative w-full h-48 bg-muted">
                      {material.imageUrl ? (
                        <img 
                          src={material.imageUrl} 
                          alt={material.name}
                          className="w-full h-full object-cover"
                          data-testid={`img-material-${material.id}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                      {material.category && (
                        <Badge variant="secondary" className="absolute top-2 right-2">
                          {material.category}
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg truncate" data-testid={`text-material-name-${material.id}`}>
                        {material.name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-3 pt-0">
                      {material.description && (
                        <CardDescription className="line-clamp-2">
                          {material.description}
                        </CardDescription>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{material.supplierCount || 0} suppliers</span>
                        </div>
                        {material.averagePrice && (
                          <span className="font-medium" data-testid={`text-price-${material.id}`}>
                            {formatPrice(material.averagePrice, material.currency)}
                          </span>
                        )}
                      </div>
                      {material.unitOfMeasure && (
                        <div className="text-xs text-muted-foreground">
                          Unit: {material.unitOfMeasure}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
