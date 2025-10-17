import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Star, ShieldCheck, MessageSquare, FileText, TrendingUp, Users, Factory } from "lucide-react";
import type { Manufacturer } from "@shared/schema";
import { Link } from "wouter";

interface ManufacturerCardProps {
  manufacturer: Manufacturer & { capabilities?: string[] | null, industries?: string[] | null };
}

export function ManufacturerCard({ manufacturer }: ManufacturerCardProps) {
  const displayCapabilities = manufacturer.capabilities?.slice(0, 5) || [];
  const remainingCount = (manufacturer.capabilities?.length || 0) - 5;

  return (
    <Card className="hover-elevate active-elevate-2 transition-all duration-200 relative" data-testid={`card-manufacturer-${manufacturer.id}`}>
      {/* Verification Badge Overlay */}
      {manufacturer.verificationStatus === 'approved' && (
        <div className="absolute top-3 right-3 z-10">
          <Badge
            variant="default"
            className="gap-1 bg-primary text-primary-foreground"
            data-testid={`badge-verified-${manufacturer.id}`}
          >
            <ShieldCheck className="h-3 w-3" />
            {manufacturer.isPremiumVerified ? "Premium Verified" : "Verified"}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex gap-4">
          {/* Logo Thumbnail */}
          <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
            {manufacturer.logoUrl ? (
              <img
                src={manufacturer.logoUrl}
                alt={manufacturer.businessName}
                className="h-full w-full object-cover rounded-md"
              />
            ) : (
              <Factory className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          {/* Name and Location */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate mb-1" data-testid={`text-manufacturer-name-${manufacturer.id}`}>
              {manufacturer.businessName}
            </h3>
            {manufacturer.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{manufacturer.location}</span>
              </div>
            )}
            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium" data-testid={`text-rating-${manufacturer.id}`}>
                {manufacturer.averageRating || "0.00"}
              </span>
              <span className="text-sm text-muted-foreground">
                ({manufacturer.totalReviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Production Capacity Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-muted/30 rounded-md">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs">Monthly</span>
            </div>
            <div className="text-sm font-semibold" data-testid={`text-capacity-${manufacturer.id}`}>
              {manufacturer.monthlyCapacity ? `${manufacturer.monthlyCapacity.toLocaleString()} units` : "N/A"}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Factory className="h-3 w-3" />
              <span className="text-xs">Lines</span>
            </div>
            <div className="text-sm font-semibold">
              {manufacturer.productionLines || "N/A"}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Users className="h-3 w-3" />
              <span className="text-xs">Team</span>
            </div>
            <div className="text-sm font-semibold">
              {manufacturer.workforceSize || "N/A"}
            </div>
          </div>
        </div>

        {/* Capabilities Tags */}
        {displayCapabilities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayCapabilities.map((capability, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{remainingCount} more
              </Badge>
            )}
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 hover-elevate active-elevate-2"
            asChild
            data-testid={`button-view-profile-${manufacturer.id}`}
          >
            <Link href={`/directory/${manufacturer.id}`}>
              View Profile
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hover-elevate active-elevate-2"
            data-testid={`button-send-rfq-${manufacturer.id}`}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hover-elevate active-elevate-2"
            data-testid={`button-message-${manufacturer.id}`}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
