import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Palette, Star, DollarSign, MapPin, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Designer } from "@shared/schema";

export default function DesignersDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableFilter, setAvailableFilter] = useState<string>("all");

  const { data: designers, isLoading } = useQuery<Designer[]>({
    queryKey: ["/api/designers", availableFilter === "available" ? { availableForHire: "true" } : {}],
  });

  const filteredDesigners = designers?.filter(designer => {
    const matchesSearch = !searchTerm || 
      designer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designer.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designer.designSpecialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAvailable = availableFilter === "all" || 
      (availableFilter === "available" && designer.availableForHire);

    return matchesSearch && matchesAvailable;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Designers Directory</h1>
          <p className="text-lg opacity-90">
            Connect with expert designers for packaging, product design, branding, and more
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-background border-b p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, specialty, or software..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-designers"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={availableFilter === "all" ? "default" : "outline"}
                onClick={() => setAvailableFilter("all")}
                data-testid="button-filter-all"
              >
                All
              </Button>
              <Button
                variant={availableFilter === "available" ? "default" : "outline"}
                onClick={() => setAvailableFilter("available")}
                data-testid="button-filter-available"
              >
                Available for Hire
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Designers Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDesigners && filteredDesigners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigners.map((designer) => (
              <Link key={designer.id} href={`/designers/${designer.id}`}>
                <Card className="h-full hover-elevate active-elevate-2 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={designer.profileImageUrl || undefined} alt={designer.displayName} />
                        <AvatarFallback>
                          {designer.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate" data-testid={`text-designer-name-${designer.id}`}>
                          {designer.displayName}
                        </h3>
                        {designer.tagline && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {designer.tagline}
                          </p>
                        )}
                      </div>
                      {designer.availableForHire && (
                        <Badge variant="secondary" className="shrink-0">
                          Available
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Design Specialties */}
                    {designer.designSpecialties && designer.designSpecialties.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {designer.designSpecialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {designer.designSpecialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{designer.designSpecialties.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Info Grid */}
                    <div className="space-y-2 text-sm">
                      {designer.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">{designer.location}</span>
                        </div>
                      )}
                      
                      {designer.yearsExperience && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="h-4 w-4 shrink-0" />
                          <span>{designer.yearsExperience} years experience</span>
                        </div>
                      )}

                      {(designer.hourlyRate || designer.projectRate) && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4 shrink-0" />
                          <span>
                            {designer.hourlyRate && `$${designer.hourlyRate}/hr`}
                            {designer.hourlyRate && designer.projectRate && " · "}
                            {designer.projectRate && `$${designer.projectRate}/project`}
                          </span>
                        </div>
                      )}

                      {designer.averageRating && Number(designer.averageRating) > 0 && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{Number(designer.averageRating).toFixed(1)}</span>
                          <span className="text-muted-foreground">({designer.totalReviews} reviews)</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Palette className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No designers found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ? "Try adjusting your search" : "Check back later for new designers"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
