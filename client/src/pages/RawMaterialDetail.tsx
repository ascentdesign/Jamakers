import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, MapPin, Phone, Mail, Clock, TrendingUp, CheckCircle2, Building2, ImageIcon } from "lucide-react";
import type { RawMaterial } from "@shared/schema";

interface Supplier {
  id: string;
  pricePerUnit: number | null;
  currency: string | null;
  minimumOrderQuantity: number | null;
  leadTimeDays: number | null;
  isVerified: boolean;
  notes: string | null;
  manufacturerId: string;
  manufacturer: {
    id: string;
    businessName: string;
    location: string | null;
    email: string | null;
    phone: string | null;
    verificationStatus: string;
  };
}

export default function RawMaterialDetail() {
  const [, params] = useRoute("/raw-materials/:id");
  const materialId = params?.id;

  const { data: material, isLoading: materialLoading } = useQuery<RawMaterial>({
    queryKey: ['/api/raw-materials', materialId],
    queryFn: async () => {
      const res = await fetch(`/api/raw-materials/${materialId}`);
      if (!res.ok) throw new Error('Failed to fetch material');
      return res.json();
    },
  });

  const { data: suppliers, isLoading: suppliersLoading } = useQuery<Supplier[]>({
    queryKey: ['/api/raw-materials', materialId, 'suppliers'],
    queryFn: async () => {
      const res = await fetch(`/api/raw-materials/${materialId}/suppliers`);
      if (!res.ok) throw new Error('Failed to fetch suppliers');
      return res.json();
    },
  });

  const formatPrice = (price: number | null, currency: string | null) => {
    if (!price) return "Contact for pricing";
    const amount = (price / 100).toFixed(2);
    return `${currency || 'JMD'} $${amount}`;
  };

  if (materialLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>Raw material not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Link href="/raw-materials">
        <Button variant="ghost" size="sm" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Materials
        </Button>
      </Link>

      {/* Material Details */}
      <Card className="overflow-hidden">
        {/* Material Image */}
        {material.imageUrl ? (
          <div className="relative w-full h-64 bg-muted">
            <img 
              src={material.imageUrl} 
              alt={material.name}
              className="w-full h-full object-cover"
              data-testid="img-material"
            />
            {material.category && (
              <Badge variant="secondary" className="absolute top-4 right-4">
                {material.category}
              </Badge>
            )}
          </div>
        ) : (
          material.category && (
            <div className="p-4 bg-muted/20">
              <Badge variant="secondary">{material.category}</Badge>
            </div>
          )
        )}
        
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl" data-testid="text-material-name">
                {material.name}
              </CardTitle>
            </div>
            {material.averagePrice && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Average Price</div>
                <div className="text-xl font-semibold" data-testid="text-average-price">
                  {formatPrice(material.averagePrice, material.currency)}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {material.description && (
            <div>
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-muted-foreground">{material.description}</p>
            </div>
          )}
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {material.unitOfMeasure && (
              <div>
                <h3 className="text-sm font-medium mb-1">Unit of Measure</h3>
                <p className="text-muted-foreground">{material.unitOfMeasure}</p>
              </div>
            )}
            {material.minimumOrderQuantity && (
              <div>
                <h3 className="text-sm font-medium mb-1">Minimum Order Quantity</h3>
                <p className="text-muted-foreground">{material.minimumOrderQuantity}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium mb-1">Available Suppliers</h3>
              <p className="text-muted-foreground">{material.supplierCount || 0}</p>
            </div>
          </div>

          {material.specifications && (
            <div>
              <h3 className="text-sm font-medium mb-1">Specifications</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{material.specifications}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suppliers Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Suppliers</h2>
        </div>

        <ScrollArea className="h-[calc(100vh-500px)]">
          {suppliersLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : suppliers && suppliers.length === 0 ? (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                No suppliers available for this material yet.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {suppliers?.map((supplier) => (
                <Card key={supplier.id} data-testid={`card-supplier-${supplier.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle data-testid={`text-supplier-name-${supplier.id}`}>
                            {supplier.manufacturer.businessName}
                          </CardTitle>
                          {supplier.isVerified && (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        {supplier.manufacturer.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {supplier.manufacturer.location}
                          </div>
                        )}
                      </div>
                      {supplier.pricePerUnit && (
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Price per unit</div>
                          <div className="text-lg font-semibold" data-testid={`text-price-${supplier.id}`}>
                            {formatPrice(supplier.pricePerUnit, supplier.currency)}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {supplier.minimumOrderQuantity && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Min. Order</div>
                            <div className="font-medium">{supplier.minimumOrderQuantity} {material.unitOfMeasure || 'units'}</div>
                          </div>
                        </div>
                      )}
                      {supplier.leadTimeDays && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Lead Time</div>
                            <div className="font-medium">{supplier.leadTimeDays} days</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {supplier.notes && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Additional Notes</div>
                        <p className="text-sm">{supplier.notes}</p>
                      </div>
                    )}

                    <Separator />

                    <div className="flex flex-wrap gap-4">
                      {supplier.manufacturer.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={`mailto:${supplier.manufacturer.email}`}
                            className="hover:underline"
                            data-testid={`link-email-${supplier.id}`}
                          >
                            {supplier.manufacturer.email}
                          </a>
                        </div>
                      )}
                      {supplier.manufacturer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={`tel:${supplier.manufacturer.phone}`}
                            className="hover:underline"
                            data-testid={`link-phone-${supplier.id}`}
                          >
                            {supplier.manufacturer.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    <Link href={`/directory/${supplier.manufacturer.id}`}>
                      <Button variant="outline" className="w-full" data-testid={`button-view-profile-${supplier.id}`}>
                        View Full Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
