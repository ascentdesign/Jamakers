import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RFQCard } from "@/components/rfq/RFQCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import type { Rfq } from "@shared/schema";

export default function RFQList() {
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Fetch RFQs from API
  const { data: rfqs = [], isLoading: isLoadingRFQs } = useQuery<Rfq[]>({
    queryKey: ["/api/rfqs"],
  });

  const statusCounts = {
    all: rfqs.length,
    draft: rfqs.filter(r => r.status === 'draft').length,
    active: rfqs.filter(r => r.status === 'active').length,
    reviewing: rfqs.filter(r => r.status === 'reviewing').length,
    awarded: rfqs.filter(r => r.status === 'awarded').length,
    closed: rfqs.filter(r => r.status === 'closed').length,
  };

  const filteredRFQs = selectedStatus === "all"
    ? rfqs
    : rfqs.filter(rfq => rfq.status === selectedStatus);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-4xl mb-2" data-testid="heading-rfqs">
            My RFQs
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your requests for quotes
          </p>
        </div>
        <Button
          size="lg"
          className="hover-elevate active-elevate-2"
          asChild
          data-testid="button-create-rfq"
        >
          <Link href="/rfqs/new">
            <Plus className="h-5 w-5 mr-2" />
            Create RFQ
          </Link>
        </Button>
      </div>

      {/* Status Tabs */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="draft" data-testid="tab-draft">
            Draft ({statusCounts.draft})
          </TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active">
            Active ({statusCounts.active})
          </TabsTrigger>
          <TabsTrigger value="reviewing" data-testid="tab-reviewing">
            Reviewing ({statusCounts.reviewing})
          </TabsTrigger>
          <TabsTrigger value="awarded" data-testid="tab-awarded">
            Awarded ({statusCounts.awarded})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6">
          {isLoadingRFQs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredRFQs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRFQs.map((rfq) => (
                <RFQCard key={rfq.id} rfq={rfq} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground" data-testid="empty-state-rfqs">
              <p>No RFQs found in this category</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
