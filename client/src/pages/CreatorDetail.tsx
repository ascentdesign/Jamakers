import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Briefcase, Star, DollarSign, Link as LinkIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Creator } from "@shared/schema";

export default function CreatorDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: creator, isLoading } = useQuery<Creator>({
    queryKey: [`/api/creators/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="bg-primary text-primary-foreground py-8 px-6">
          <div className="max-w-5xl mx-auto">
            <Skeleton className="h-8 w-32 mb-6 bg-primary-foreground/20" />
            <div className="flex items-start gap-6">
              <Skeleton className="h-24 w-24 rounded-full bg-primary-foreground/20" />
              <div className="flex-1">
                <Skeleton className="h-8 w-48 mb-3 bg-primary-foreground/20" />
                <Skeleton className="h-5 w-64 bg-primary-foreground/20" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto p-6">
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Creator Not Found</h2>
            <p className="text-muted-foreground mb-6">The creator you're looking for doesn't exist.</p>
            <Link href="/creators">
              <Button data-testid="button-back-creators">Back to Creators</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header with Cover Image */}
      <div className="bg-primary text-primary-foreground py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/creators">
            <Button variant="ghost" className="mb-6 -ml-2 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Creators
            </Button>
          </Link>

          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={creator.profileImageUrl || undefined} alt={creator.displayName} />
              <AvatarFallback className="text-2xl">
                {creator.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <h1 className="text-3xl font-bold mb-2" data-testid="text-creator-name">{creator.displayName}</h1>
                  {creator.tagline && <p className="text-lg opacity-90">{creator.tagline}</p>}
                </div>
                {creator.availableForHire && (
                  <Badge variant="secondary" className="shrink-0">Available for Hire</Badge>
                )}
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                {creator.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{creator.location}</span>
                  </div>
                )}
                {creator.yearsExperience && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    <span>{creator.yearsExperience} years experience</span>
                  </div>
                )}
                {creator.averageRating && Number(creator.averageRating) > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{Number(creator.averageRating).toFixed(1)}</span>
                    <span className="opacity-75">({creator.totalReviews} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {creator.bio && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">About</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{creator.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Specialties & Skills */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Specialties & Skills</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {creator.specialties && creator.specialties.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {creator.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {creator.skills && creator.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {creator.skills.map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {creator.contentTypes && creator.contentTypes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Content Types</h3>
                    <div className="flex flex-wrap gap-2">
                      {creator.contentTypes.map((type) => (
                        <Badge key={type} variant="outline">{type}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Portfolio */}
            {creator.portfolioItems && creator.portfolioItems.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Portfolio</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {creator.portfolioItems.map((item) => (
                      <div key={item.id} className="border rounded-md p-4 hover-elevate">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center gap-3 text-sm">
                          <Badge variant="outline">{item.type}</Badge>
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                              <LinkIcon className="h-3 w-3" />
                              View
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Pricing</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {creator.hourlyRate && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="font-semibold">${creator.hourlyRate}/hr</span>
                  </div>
                )}
                {creator.projectRate && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Project Rate</span>
                    <span className="font-semibold">${creator.projectRate}</span>
                  </div>
                )}
                {!creator.hourlyRate && !creator.projectRate && (
                  <p className="text-sm text-muted-foreground">Contact for pricing</p>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            {creator.servicesOffered && creator.servicesOffered.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Services Offered</h2>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {creator.servicesOffered.map((service) => (
                      <li key={service} className="text-sm flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Contact</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {creator.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`tel:${creator.phone}`} className="hover:underline">{creator.phone}</a>
                  </div>
                )}
                {creator.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={creator.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{creator.website}</a>
                  </div>
                )}
                {creator.socialLinks && Object.entries(creator.socialLinks).map(([platform, url]) => (
                  <div key={platform} className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline capitalize">{platform}</a>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
