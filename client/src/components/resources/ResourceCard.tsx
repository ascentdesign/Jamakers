import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText, Download, Eye } from "lucide-react";
import type { Resource } from "@shared/schema";

interface ResourceCardProps {
  resource: Resource;
}

const fileTypeIcons: Record<string, string> = {
  pdf: "📄",
  xlsx: "📊",
  docx: "📝",
  pptx: "📊",
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="hover-elevate active-elevate-2 transition-all duration-200" data-testid={`card-resource-${resource.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">
              {fileTypeIcons[resource.fileType || 'pdf'] || '📄'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="mb-2 text-xs">
              {resource.category}
            </Badge>
            <h3 className="font-semibold text-lg truncate" data-testid={`text-resource-title-${resource.id}`}>
              {resource.title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {resource.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {resource.description}
          </p>
        )}

        {/* Tags */}
        {resource.tags && Array.isArray(resource.tags) && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resource.tags.slice(0, 4).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats & Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{resource.viewCount || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{resource.downloadCount || 0} downloads</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="hover-elevate active-elevate-2"
            data-testid={`button-download-${resource.id}`}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
