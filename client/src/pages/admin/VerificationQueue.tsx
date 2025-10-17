import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, FileText, ExternalLink } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Verification {
  id: number;
  manufacturerId: string;
  status: "pending" | "approved" | "rejected";
  requestType: "manual" | "premium";
  documents: Array<{ name: string; url: string }>;
  notes: string;
  createdAt: string;
  manufacturer: {
    businessName: string;
    address: string;
    parish: string;
    industry: string;
  };
}

export default function VerificationQueue() {
  const { toast } = useToast();
  const [reviewNotes, setReviewNotes] = useState<Record<number, string>>({});

  // Fetch verification requests
  const { data: verifications, isLoading } = useQuery<Verification[]>({
    queryKey: ["/api/admin/verifications"],
  });

  // Approve verification mutation
  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      return await apiRequest(`/api/admin/verifications/${id}/approve`, {
        method: "POST",
        body: JSON.stringify({ adminNotes: notes }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verifications"] });
      toast({
        title: "Verification Approved",
        description: "The manufacturer has been verified successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve verification.",
        variant: "destructive",
      });
    },
  });

  // Reject verification mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      return await apiRequest(`/api/admin/verifications/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ adminNotes: notes }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verifications"] });
      toast({
        title: "Verification Rejected",
        description: "The verification request has been rejected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject verification.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (verificationId: number) => {
    approveMutation.mutate({
      id: verificationId,
      notes: reviewNotes[verificationId] || "",
    });
  };

  const handleReject = (verificationId: number) => {
    rejectMutation.mutate({
      id: verificationId,
      notes: reviewNotes[verificationId] || "",
    });
  };

  const pendingVerifications = verifications?.filter(v => v.status === "pending") || [];
  const approvedVerifications = verifications?.filter(v => v.status === "approved") || [];
  const rejectedVerifications = verifications?.filter(v => v.status === "rejected") || [];

  // Placeholder data for stats (will be replaced with real stats from backend)
  const stats = {
    pending: pendingVerifications.length,
    approvedToday: approvedVerifications.filter(v => 
      new Date(v.createdAt).toDateString() === new Date().toDateString()
    ).length,
    thisWeek: verifications?.filter(v => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(v.createdAt) > weekAgo;
    }).length || 0,
    avgReviewTime: "2.3d", // TODO: Calculate from backend
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-4xl mb-2" data-testid="heading-verification-queue">
          Verification Queue
        </h1>
        <p className="text-muted-foreground text-lg">
          Review and approve manufacturer verification requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Review Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgReviewTime}</div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Requests */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" data-testid="tab-pending">
            Pending ({pendingVerifications.length})
          </TabsTrigger>
          <TabsTrigger value="approved" data-testid="tab-approved">
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" data-testid="tab-rejected">
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6 space-y-6">
          {isLoading && (
            <div className="text-center text-muted-foreground py-8">Loading verifications...</div>
          )}
          {!isLoading && pendingVerifications.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending verifications to review</p>
            </div>
          )}
          {pendingVerifications.map((verification) => (
            <Card key={verification.id} data-testid={`card-verification-${verification.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{verification.manufacturer.businessName}</CardTitle>
                      <Badge variant={verification.requestType === 'premium' ? 'default' : 'secondary'}>
                        {verification.requestType === 'premium' ? 'Premium' : 'Standard'} Verification
                      </Badge>
                    </div>
                    <CardDescription>
                      {verification.manufacturer.parish} • {verification.manufacturer.industry}
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Submitted: {new Date(verification.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Notes */}
                <div>
                  <h4 className="font-semibold mb-2">Application Notes</h4>
                  <p className="text-sm text-muted-foreground">{verification.notes}</p>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="font-semibold mb-3">Submitted Documents</h4>
                  <div className="space-y-2">
                    {verification.documents.length > 0 ? (
                      verification.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-md hover-elevate">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="hover-elevate" data-testid={`button-document-${idx}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No documents submitted</p>
                    )}
                  </div>
                </div>

                {/* Review Section */}
                <div>
                  <h4 className="font-semibold mb-3">Review Notes</h4>
                  <Textarea
                    placeholder="Add review notes (optional)..."
                    className="min-h-[80px]"
                    value={reviewNotes[verification.id] || ""}
                    onChange={(e) => setReviewNotes({...reviewNotes, [verification.id]: e.target.value})}
                    data-testid={`textarea-review-notes-${verification.id}`}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="default"
                    className="flex-1 hover-elevate active-elevate-2"
                    onClick={() => handleApprove(verification.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    data-testid={`button-approve-${verification.id}`}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve Verification
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 hover-elevate active-elevate-2"
                    onClick={() => handleReject(verification.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    data-testid={`button-reject-${verification.id}`}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="mt-6 space-y-4">
          {approvedVerifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No approved verifications to display</p>
            </div>
          ) : (
            approvedVerifications.map((verification) => (
              <Card key={verification.id} data-testid={`card-approved-${verification.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{verification.manufacturer.businessName}</CardTitle>
                    <Badge variant="default">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  </div>
                  <CardDescription>
                    {verification.manufacturer.parish} • Approved on {new Date(verification.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6 space-y-4">
          {rejectedVerifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No rejected verifications to display</p>
            </div>
          ) : (
            rejectedVerifications.map((verification) => (
              <Card key={verification.id} data-testid={`card-rejected-${verification.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{verification.manufacturer.businessName}</CardTitle>
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Rejected
                    </Badge>
                  </div>
                  <CardDescription>
                    {verification.manufacturer.parish} • Rejected on {new Date(verification.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
