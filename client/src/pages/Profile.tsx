import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, Phone, Globe, Mail, Building2, Factory, 
  Award, Edit, Shield, Calendar, Users, TrendingUp 
} from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import type { Manufacturer, Brand } from "@shared/schema";

export default function Profile() {
  const { user } = useAuth();

  // Fetch manufacturer profile if user is a manufacturer
  const { data: manufacturerProfile, isLoading: isLoadingManufacturer } = useQuery<Manufacturer>({
    queryKey: ["/api/profile/manufacturer"],
    enabled: user?.role === "manufacturer",
  });

  // Fetch brand profile if user is a brand
  const { data: brandProfile, isLoading: isLoadingBrand } = useQuery<Brand>({
    queryKey: ["/api/profile/brand"],
    enabled: user?.role === "brand",
  });

  const isLoading = isLoadingManufacturer || isLoadingBrand;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground" data-testid="text-login-prompt">Please log in to view your profile</p>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Manufacturer Profile View
  if (user.role === "manufacturer" && manufacturerProfile) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={manufacturerProfile.logoUrl || undefined} />
                <AvatarFallback className="text-2xl">
                  {manufacturerProfile.businessName?.[0]?.toUpperCase() || "M"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display font-bold text-3xl mb-2" data-testid="heading-business-name">
                      {manufacturerProfile.businessName}
                    </h1>
                    <p className="text-muted-foreground mb-4" data-testid="text-business-description">
                      {manufacturerProfile.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {manufacturerProfile.verificationStatus === "approved" && (
                        <Badge variant="default" className="gap-1" data-testid="badge-verified">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                      {manufacturerProfile.isPremiumVerified && (
                        <Badge variant="default" className="gap-1" data-testid="badge-premium">
                          <Award className="h-3 w-3" />
                          Premium
                        </Badge>
                      )}
                      {manufacturerProfile.verificationStatus === "pending" && (
                        <Badge variant="secondary" data-testid="badge-verification-pending">Verification Pending</Badge>
                      )}
                    </div>
                  </div>
                  <Link href="/manufacturers/edit">
                    <Button variant="outline" className="gap-2" data-testid="button-edit-profile">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {manufacturerProfile.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span data-testid="text-phone">{manufacturerProfile.phone}</span>
                </div>
              )}
              {user.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span data-testid="text-email">{user.email}</span>
                </div>
              )}
              {manufacturerProfile.website && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={manufacturerProfile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    data-testid="link-website"
                  >
                    {manufacturerProfile.website}
                  </a>
                </div>
              )}
              {manufacturerProfile.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span data-testid="text-location">{manufacturerProfile.location}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Production Capacity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Production Capacity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {manufacturerProfile.monthlyCapacity && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Capacity</span>
                  <span className="font-medium" data-testid="text-monthly-capacity">
                    {manufacturerProfile.monthlyCapacity} units
                  </span>
                </div>
              )}
              {manufacturerProfile.workforceSize && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Workforce Size</span>
                  <span className="font-medium" data-testid="text-workforce-size">{manufacturerProfile.workforceSize} employees</span>
                </div>
              )}
              {manufacturerProfile.productionLines && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Production Lines</span>
                  <span className="font-medium" data-testid="text-production-lines">{manufacturerProfile.productionLines}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Industries & Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle>Industries & Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {manufacturerProfile.industries && manufacturerProfile.industries.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Industries</h4>
                <div className="flex flex-wrap gap-2">
                  {manufacturerProfile.industries.map((industry, index) => (
                    <Badge key={industry} variant="secondary" data-testid={`badge-industry-${index}`}>
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {manufacturerProfile.capabilities && manufacturerProfile.capabilities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {manufacturerProfile.capabilities.map((capability, index) => (
                    <Badge key={capability} variant="outline" data-testid={`badge-capability-${index}`}>
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-average-rating">{manufacturerProfile.averageRating || "0.0"}</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-reviews">{manufacturerProfile.totalReviews || "0"}</p>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-bold" data-testid="text-member-since">
                    {manufacturerProfile.createdAt 
                      ? formatDistanceToNow(new Date(manufacturerProfile.createdAt), { addSuffix: true })
                      : "Recently"}
                  </p>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Brand Profile View
  if (user.role === "brand" && brandProfile) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={brandProfile.logoUrl || undefined} />
                <AvatarFallback className="text-2xl">
                  {brandProfile.companyName?.[0]?.toUpperCase() || "B"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display font-bold text-3xl mb-2" data-testid="heading-company-name">
                      {brandProfile.companyName}
                    </h1>
                    <p className="text-muted-foreground mb-4" data-testid="text-company-description">
                      {brandProfile.description}
                    </p>
                    {brandProfile.industry && (
                      <Badge variant="secondary" data-testid="badge-industry">{brandProfile.industry}</Badge>
                    )}
                  </div>
                  <Link href="/brands/edit">
                    <Button variant="outline" className="gap-2" data-testid="button-edit-profile">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {brandProfile.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span data-testid="text-phone">{brandProfile.phone}</span>
                </div>
              )}
              {user.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span data-testid="text-email">{user.email}</span>
                </div>
              )}
              {brandProfile.website && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={brandProfile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    data-testid="link-website"
                  >
                    {brandProfile.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {brandProfile.companySize && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Company Size</span>
                  <span className="font-medium" data-testid="text-company-size">{brandProfile.companySize} employees</span>
                </div>
              )}
              {brandProfile.annualVolume && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Annual Volume</span>
                  <span className="font-medium" data-testid="text-annual-volume">{brandProfile.annualVolume}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Categories & Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Product Categories & Preferred Locations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {brandProfile.productCategories && brandProfile.productCategories.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Product Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {brandProfile.productCategories.map((category, index) => (
                    <Badge key={category} variant="secondary" data-testid={`badge-product-category-${index}`}>
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {brandProfile.preferredLocations && brandProfile.preferredLocations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Preferred Locations</h4>
                <div className="flex flex-wrap gap-2">
                  {brandProfile.preferredLocations.map((location, index) => (
                    <Badge key={location} variant="outline" data-testid={`badge-location-${index}`}>
                      <MapPin className="h-3 w-3 mr-1" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Member Since */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold" data-testid="text-member-since">
                  {brandProfile.createdAt 
                    ? formatDistanceToNow(new Date(brandProfile.createdAt), { addSuffix: true })
                    : "Recently"}
                </p>
                <p className="text-sm text-muted-foreground">Member Since</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No profile exists
  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      <h2 className="font-display font-bold text-2xl mb-4" data-testid="heading-no-profile">No Profile Found</h2>
      <p className="text-muted-foreground mb-6" data-testid="text-no-profile-message">
        You haven't created a profile yet. Get started by creating your {user.role} profile.
      </p>
      {user.role === "manufacturer" && (
        <Link href="/manufacturers/create">
          <Button data-testid="button-create-profile">Create Manufacturer Profile</Button>
        </Link>
      )}
      {user.role === "brand" && (
        <Link href="/brands/create">
          <Button data-testid="button-create-profile">Create Brand Profile</Button>
        </Link>
      )}
    </div>
  );
}
