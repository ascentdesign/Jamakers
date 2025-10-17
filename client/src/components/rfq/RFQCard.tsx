import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, DollarSign, Package, Eye, MessageSquare } from "lucide-react";
import type { Rfq } from "@shared/schema";
import { Link } from "wouter";
import { formatCurrency, useCurrency } from "@/components/CurrencySelector";

interface RFQCardProps {
  rfq: Rfq;
}

const statusColors = {
  draft: "secondary",
  active: "default",
  reviewing: "default",
  awarded: "default",
  closed: "secondary",
} as const;

const statusLabels = {
  draft: "Draft",
  active: "Active",
  reviewing: "Reviewing Bids",
  awarded: "Awarded",
  closed: "Closed",
} as const;

export function RFQCard({ rfq }: RFQCardProps) {
  const { currency } = useCurrency();

  return (
    <Card className="hover-elevate active-elevate-2 transition-all duration-200" data-testid={`card-rfq-${rfq.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={statusColors[rfq.status || 'draft']} data-testid={`badge-status-${rfq.id}`}>
                {statusLabels[rfq.status || 'draft']}
              </Badge>
              {rfq.category && (
                <Badge variant="outline" className="text-xs">
                  {rfq.category}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg truncate" data-testid={`text-rfq-title-${rfq.id}`}>
              {rfq.title}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Budget</div>
            <div className="font-semibold" data-testid={`text-rfq-budget-${rfq.id}`}>
              {rfq.budget ? formatCurrency(Number(rfq.budget), currency) : "TBD"}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {rfq.description}
        </p>

        {/* Key Details */}
        <div className="flex flex-wrap gap-4 text-sm">
          {rfq.quantity && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{rfq.quantity.toLocaleString()} units</span>
            </div>
          )}
          {rfq.timeline && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{rfq.timeline}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{rfq.responseCount || 0} responses</span>
          </div>
        </div>

        {/* Requirements Preview */}
        {rfq.requirements && typeof rfq.requirements === 'object' && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Key Requirements:</div>
            <ul className="text-sm space-y-1">
              {Object.entries(rfq.requirements).slice(0, 3).map(([key, value], idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="flex-1">{String(value)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 hover-elevate active-elevate-2"
            asChild
            data-testid={`button-view-rfq-${rfq.id}`}
          >
            <Link href={`/rfqs/${rfq.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          {rfq.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              className="hover-elevate active-elevate-2"
              data-testid={`button-respond-rfq-${rfq.id}`}
            >
              Respond
            </Button>
          )}
        </div>

        {/* Expiry Notice */}
        {rfq.expiresAt && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Expires: {new Date(rfq.expiresAt).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
