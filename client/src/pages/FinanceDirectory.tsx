import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, MapPin, Phone, Mail, ExternalLink, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { FinancialInstitution } from "@shared/schema";

export default function FinanceDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const { data: lenders = [], isLoading } = useQuery<FinancialInstitution[]>({
    queryKey: ["/api/finance/lenders"],
  });

  const institutionTypes = ["all", "bank", "credit union", "microfinance", "development finance"];

  const filteredLenders = lenders.filter((lender) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        lender.institutionName.toLowerCase().includes(searchLower) ||
        lender.description?.toLowerCase().includes(searchLower) ||
        lender.institutionType?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    if (selectedType !== "all") {
      if (lender.institutionType?.toLowerCase() !== selectedType) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Finance Directory</h1>
          <p className="text-lg opacity-90">
            Connect with financial institutions offering manufacturing loans and business financing
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-background border-b p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search lenders by name or type..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-lender-search"
              />
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {institutionTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  data-testid={`button-filter-${type}`}
                  className="capitalize hover-elevate active-elevate-2"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Found {filteredLenders.length} of {lenders.length} lenders
          </p>
        </div>

        {/* Lenders Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredLenders.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No lenders found. Try adjusting your search.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLenders.map((lender) => (
              <Card key={lender.id} className="hover-elevate transition-all duration-200" data-testid={`card-lender-${lender.id}`}>
                <CardHeader className="space-y-4 pb-4">
                  {/* Logo */}
                  <div className="flex items-start justify-between">
                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      {lender.logoUrl ? (
                        <img
                          src={lender.logoUrl}
                          alt={lender.institutionName}
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    {lender.institutionType && (
                      <Badge variant="secondary" className="capitalize text-xs">
                        {lender.institutionType}
                      </Badge>
                    )}
                  </div>

                  {/* Name and Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-1" data-testid={`text-lender-name-${lender.id}`}>
                      {lender.institutionName}
                    </h3>
                    {lender.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lender.description}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Loan Range */}
                  {(lender.minLoanAmount || lender.maxLoanAmount) && (
                    <div className="p-3 bg-muted/30 rounded-md">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Loan Range</span>
                      </div>
                      <div className="text-sm font-semibold">
                        {lender.minLoanAmount && `$${Number(lender.minLoanAmount).toLocaleString()}`}
                        {lender.minLoanAmount && lender.maxLoanAmount && " - "}
                        {lender.maxLoanAmount && `$${Number(lender.maxLoanAmount).toLocaleString()}`}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    {lender.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{lender.location}</span>
                      </div>
                    )}
                    {lender.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{lender.phone}</span>
                      </div>
                    )}
                    {lender.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{lender.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 hover-elevate active-elevate-2"
                      asChild
                      data-testid={`button-view-loans-${lender.id}`}
                    >
                      <Link href={`/finance/${lender.id}`}>
                        View Loan Products
                      </Link>
                    </Button>
                    {lender.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover-elevate active-elevate-2"
                        asChild
                        data-testid={`button-website-${lender.id}`}
                      >
                        <a href={lender.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
