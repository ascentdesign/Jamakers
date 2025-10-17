import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, User, Star, DollarSign, MapPin, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Creator } from "@shared/schema";

export default function CreatorsDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableFilter, setAvailableFilter] = useState<string>("all");

  const { data: creators, isLoading } = useQuery<Creator[]>({
    queryKey: ["/api/creators", availableFilter === "available" ? { availableForHire: "true" } : {}],
  });

  const filteredCreators = creators?.filter(creator => {
    const matchesSearch = !searchTerm || 
      creator.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAvailable = availableFilter === "all" || 
      (availableFilter === "available" && creator.availableForHire);

    return matchesSearch && matchesAvailable;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Creators Directory</h1>
          <p className="text-lg opacity-90">
            Connect with talented content creators, brand strategists, and marketing professionals
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-background border-b p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, specialty, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-creators"
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

      {/* Creators Grid */}
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
        ) : filteredCreators && filteredCreators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => (
              <Link key={creator.id} href={`/creators/${creator.id}`}>
                <Card className="h-full hover-elevate active-elevate-2 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={creator.profileImageUrl || undefined} alt={creator.displayName} />
                        <AvatarFallback>
                          {creator.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate" data-testid={`text-creator-name-${creator.id}`}>
                          {creator.displayName}
                        </h3>
                        {creator.tagline && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {creator.tagline}
                          </p>
                        )}
                      </div>
                      {creator.availableForHire && (
                        <Badge variant="secondary" className="shrink-0">
                          Available
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Specialties */}
                    {creator.specialties && creator.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {creator.specialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {creator.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{creator.specialties.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Info Grid */}
                    <div className="space-y-2 text-sm">
                      {creator.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">{creator.location}</span>
                        </div>
                      )}
                      
                      {creator.yearsExperience && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="h-4 w-4 shrink-0" />
                          <span>{creator.yearsExperience} years experience</span>
                        </div>
                      )}

                      {(creator.hourlyRate || creator.projectRate) && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4 shrink-0" />
                          <span>
                            {creator.hourlyRate && `$${creator.hourlyRate}/hr`}
                            {creator.hourlyRate && creator.projectRate && " · "}
                            {creator.projectRate && `$${creator.projectRate}/project`}
                          </span>
                        </div>
                      )}

                      {creator.averageRating && Number(creator.averageRating) > 0 && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{Number(creator.averageRating).toFixed(1)}</span>
                          <span className="text-muted-foreground">({creator.totalReviews} reviews)</span>
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
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No creators found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ? "Try adjusting your search" : "Check back later for new creators"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
