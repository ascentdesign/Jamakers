import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2,
  Users,
  Package
} from "lucide-react";

interface Manufacturer {
  id: string;
  businessName: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  verificationStatus: string;
  capacity: string | null;
  certifications: string[] | null;
  userId: string;
}

export default function ManufacturerDetail() {
  const [, params] = useRoute("/directory/:id");
  const manufacturerId = params?.id;

  const { data: manufacturer, isLoading } = useQuery<Manufacturer>({
    queryKey: ['/api/manufacturers', manufacturerId],
    queryFn: async () => {
      const res = await fetch(`/api/manufacturers/${manufacturerId}`);
      if (!res.ok) throw new Error('Failed to fetch manufacturer');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!manufacturer) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>Manufacturer not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isVerified = manufacturer.verificationStatus === 'verified';

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Link href="/manufacturers">
        <Button variant="ghost" size="sm" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Directory
        </Button>
      </Link>

      {/* Manufacturer Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-muted-foreground" />
                <CardTitle className="text-2xl" data-testid="text-manufacturer-name">
                  {manufacturer.businessName}
                </CardTitle>
                {isVerified && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              {manufacturer.industry && (
                <Badge variant="secondary">{manufacturer.industry}</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {manufacturer.description && (
            <div>
              <h3 className="text-sm font-medium mb-2">About</h3>
              <p className="text-muted-foreground">{manufacturer.description}</p>
            </div>
          )}

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium mb-3">Contact Information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {manufacturer.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{manufacturer.location}</span>
                </div>
              )}
              {manufacturer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${manufacturer.email}`}
                    className="text-sm hover:underline"
                    data-testid="link-email"
                  >
                    {manufacturer.email}
                  </a>
                </div>
              )}
              {manufacturer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`tel:${manufacturer.phone}`}
                    className="text-sm hover:underline"
                    data-testid="link-phone"
                  >
                    {manufacturer.phone}
                  </a>
                </div>
              )}
              {manufacturer.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={manufacturer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                    data-testid="link-website"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Capabilities */}
          {(manufacturer.capacity || manufacturer.certifications) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Capabilities</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {manufacturer.capacity && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Production Capacity</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">{manufacturer.capacity}</p>
                    </div>
                  )}
                  {manufacturer.certifications && manufacturer.certifications.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Certifications</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-6">
                        {manufacturer.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
