import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ManufacturerCard } from "@/components/manufacturers/ManufacturerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X, Map, Grid3x3 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import type { Manufacturer } from "@shared/schema";

export default function ManufacturerDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [minCapacity, setMinCapacity] = useState<string>("");
  const [maxCapacity, setMaxCapacity] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch manufacturers from API
  const { data: manufacturers = [], isLoading: isLoadingManufacturers } = useQuery<Manufacturer[]>({
    queryKey: ["/api/manufacturers"],
  });

  const industries = [
    "Food & Beverage",
    "Textiles & Fashion",
    "Personal Care & Cosmetics",
    "Herbal & Natural Products",
    "Furniture & Home Goods",
    "Metal Fabrication",
    "Ceramics & Pottery",
  ];

  const locations = [
    "Kingston",
    "Montego Bay",
    "Ocho Rios",
    "Mandeville",
    "Spanish Town",
    "Portmore",
  ];

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const toggleCertification = (cert: string) => {
    setSelectedCertifications(prev =>
      prev.includes(cert)
        ? prev.filter(c => c !== cert)
        : [...prev, cert]
    );
  };

  const clearFilters = () => {
    setSelectedIndustries([]);
    setSelectedLocations([]);
    setSelectedCertifications([]);
    setMinCapacity("");
    setMaxCapacity("");
    setSearchQuery("");
  };

  // Filter manufacturers based on search and filters
  const filteredManufacturers = manufacturers.filter((manufacturer) => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        manufacturer.businessName.toLowerCase().includes(searchLower) ||
        manufacturer.description?.toLowerCase().includes(searchLower) ||
        (manufacturer.industries as string[] | null)?.some(ind => ind.toLowerCase().includes(searchLower)) ||
        (manufacturer.capabilities as string[] | null)?.some((cap: string) => cap.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Industry filter
    if (selectedIndustries.length > 0) {
      const hasMatchingIndustry = selectedIndustries.some(industry =>
        (manufacturer.industries as string[] | null)?.includes(industry)
      );
      if (!hasMatchingIndustry) return false;
    }

    // Location filter
    if (selectedLocations.length > 0) {
      if (!manufacturer.location || !selectedLocations.includes(manufacturer.location)) {
        return false;
      }
    }

    // Capacity filter
    if (minCapacity || maxCapacity) {
      const capacity = manufacturer.monthlyCapacity;
      if (capacity) {
        const numCapacity = Number(capacity);
        if (minCapacity && numCapacity < parseInt(minCapacity)) return false;
        if (maxCapacity && numCapacity > parseInt(maxCapacity)) return false;
      } else {
        return false;
      }
    }

    return true;
  });

  const activeFilterCount = 
    selectedIndustries.length + 
    selectedLocations.length + 
    selectedCertifications.length +
    (minCapacity ? 1 : 0) +
    (maxCapacity ? 1 : 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Manufacturers Directory</h1>
          <p className="text-lg opacity-90">
            Find verified manufacturers and filter by industry, location, and capacity
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-background border-b p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <button
                type="button"
                aria-label="Focus search"
                title="Focus search"
                onClick={() => searchInputRef.current?.focus()}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 grid place-items-center text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4 pointer-events-none" />
              </button>
              <Input
                type="search"
                placeholder="Search by name, capability, or product..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
                data-testid="input-manufacturer-search"
              />
            </div>

            <div className="flex gap-2 items-center">
              <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="default" className="hover-elevate" data-testid="button-filters">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2" data-testid="badge-filter-count">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[420px] p-0" align="end">
                  <div className="p-4 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="text-sm font-semibold">Filters</span>
                      </div>
                      {activeFilterCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-8 px-2 text-xs"
                          data-testid="button-clear-filters"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>

                    {/* Industry Filters */}
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Industry</Label>
                      <div className="space-y-2">
                        {industries.map((industry) => (
                          <div key={industry} className="flex items-center space-x-2">
                            <Checkbox
                              id={`industry-${industry}`}
                              checked={selectedIndustries.includes(industry)}
                              onCheckedChange={() => toggleIndustry(industry)}
                              data-testid={`checkbox-industry-${industry.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                            <Label
                              htmlFor={`industry-${industry}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {industry}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Location Filters */}
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Location</Label>
                      <div className="space-y-2">
                        {locations.map((location) => (
                          <div key={location} className="flex items-center space-x-2">
                            <Checkbox
                              id={`location-${location}`}
                              checked={selectedLocations.includes(location)}
                              onCheckedChange={() => toggleLocation(location)}
                              data-testid={`checkbox-location-${location.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                            <Label
                              htmlFor={`location-${location}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {location}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Capacity Range */}
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Monthly Capacity</Label>
                      <div className="space-y-2">
                        <Input 
                          type="number" 
                          placeholder="Min capacity" 
                          value={minCapacity}
                          onChange={(e) => setMinCapacity(e.target.value)}
                          data-testid="input-min-capacity" 
                        />
                        <Input 
                          type="number" 
                          placeholder="Max capacity"
                          value={maxCapacity}
                          onChange={(e) => setMaxCapacity(e.target.value)} 
                          data-testid="input-max-capacity" 
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Certifications */}
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Certifications</Label>
                      <div className="space-y-2">
                        {["HACCP", "GMP", "ISO", "Organic"].map((cert) => (
                          <div key={cert} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`cert-${cert}`}
                              checked={selectedCertifications.includes(cert)}
                              onCheckedChange={() => toggleCertification(cert)}
                              data-testid={`checkbox-cert-${cert.toLowerCase()}`} 
                            />
                            <Label htmlFor={`cert-${cert}`} className="text-sm font-normal cursor-pointer">
                              {cert}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                data-testid="button-view-grid"
                className="hover-elevate active-elevate-2"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("map")}
                data-testid="button-view-map"
                className="hover-elevate active-elevate-2"
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedIndustries.map((industry) => (
                <Badge key={industry} variant="secondary" className="gap-2">
                  {industry}
                  <X
                    className="h-3 w-3 cursor-pointer hover-elevate"
                    onClick={() => toggleIndustry(industry)}
                  />
                </Badge>
              ))}
              {selectedLocations.map((location) => (
                <Badge key={location} variant="secondary" className="gap-2">
                  {location}
                  <X
                    className="h-3 w-3 cursor-pointer hover-elevate"
                    onClick={() => toggleLocation(location)}
                  />
                </Badge>
              ))}
              {selectedCertifications.map((cert) => (
                <Badge key={cert} variant="secondary" className="gap-2">
                  {cert}
                  <X
                    className="h-3 w-3 cursor-pointer hover-elevate"
                    onClick={() => toggleCertification(cert)}
                  />
                </Badge>
              ))}
              {minCapacity && (
                <Badge variant="secondary" className="gap-2">
                  Min: {minCapacity}
                  <X
                    className="h-3 w-3 cursor-pointer hover-elevate"
                    onClick={() => setMinCapacity("")}
                  />
                </Badge>
              )}
              {maxCapacity && (
                <Badge variant="secondary" className="gap-2">
                  Max: {maxCapacity}
                  <X
                    className="h-3 w-3 cursor-pointer hover-elevate"
                    onClick={() => setMaxCapacity("")}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results and Grid */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Found {filteredManufacturers.length} of {manufacturers.length} verified manufacturers
            </p>
          </div>
          <div>
            {/* Sort dropdown placeholder */}
            <Button variant="outline" size="sm" className="hover-elevate" data-testid="button-sort">
              Sort by: Relevance
            </Button>
          </div>
        </div>

        {/* Manufacturer Grid */}
        {isLoadingManufacturers ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredManufacturers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>No manufacturers found. Try adjusting your filters.</p>
              </div>
            ) : (
              filteredManufacturers.map((manufacturer) => (
                <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />
              ))
            )}
          </div>
        ) : (
          <Card className="h-[600px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Map view coming soon</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
