import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle2, Clock, FileText, MessageSquare } from "lucide-react";
import type { Project } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProjectDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch projects from API
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      // Ensure the user is authenticated and a brand user
      if (!user) {
        throw new Error("401: Please sign in to create a project");
      }
      if (user.role !== "brand") {
        throw new Error("403: Only brand users can create projects");
      }

      // Ensure a brand profile exists; create a minimal one if missing
      try {
        await apiRequest("GET", "/api/profile/brand");
      } catch (err: any) {
        const msg = String(err?.message || "");
        if (msg.startsWith("404")) {
          const companyName = user.firstName ? `${user.firstName}'s Brand` : "New Brand";
          await apiRequest("POST", "/api/brands", { companyName });
        } else {
          throw err;
        }
      }

      const res = await apiRequest("POST", "/api/projects", {
        title: "New Project",
        description: "Draft project created from dashboard",
        status: "draft",
      });
      return await res.json();
    },
    onSuccess: (project: Project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project Created", description: "Draft project created" });
      setLocation(`/projects/${project.id}`);
    },
    onError: (error: any) => {
      const message = String(error?.message || "Failed to create project");
      if (message.startsWith("401")) {
        toast({ title: "Sign in required", description: "Please sign in to create a project.", variant: "destructive" });
        setLocation("/");
        return;
      }
      if (message.startsWith("403")) {
        toast({ title: "Not allowed", description: "Only brand users can create projects.", variant: "destructive" });
        return;
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">Projects</h1>
            <p className="text-lg opacity-90">
              Track and manage ongoing manufacturing projects
            </p>
          </div>
          {user?.role === "brand" ? (
            <Button
              className="bg-yellow-500 text-black hover:bg-yellow-600"
              onClick={() => createProjectMutation.mutate()}
              disabled={createProjectMutation.isPending}
              data-testid="button-new-project"
            >
              <Plus className="h-4 w-4 mr-2" />
              {createProjectMutation.isPending ? "Creating..." : "New Project"}
            </Button>
          ) : (
            <div className="text-sm opacity-80">Sign in as a brand to create projects</div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-active-projects">
                {isLoadingProjects ? "..." : projects.filter(p => p.status === 'in_progress' || p.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-completed-projects">
                {isLoadingProjects ? "..." : projects.filter(p => p.status === 'completed').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-projects">
                {isLoadingProjects ? "..." : projects.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-budget">
                {isLoadingProjects ? "..." : `$${projects.reduce((sum, p) => sum + parseFloat(p.budget || '0'), 0).toLocaleString()}`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project List */}
        <div className="space-y-6">
          {isLoadingProjects ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-20 bg-muted rounded w-full"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground" data-testid="empty-state-projects">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Projects Yet</p>
                <p className="text-sm">Your manufacturing projects will appear here once created</p>
              </div>
            </Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id} className="hover-elevate active-elevate-2 transition-all" data-testid={`card-project-${project.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>Project {project.id.slice(0, 8)}</CardTitle>
                        <Badge variant="default">
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardDescription>
                        {project.description || "Manufacturing project"}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{project.progress || 0}%</div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress || 0}%</span>
                    </div>
                    <Progress value={parseFloat(project.progress?.toString() || '0')} className="h-2" />
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Budget</div>
                      <div className="font-semibold">${project.budget || 'TBD'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Timeline</div>
                      <div className="font-semibold">{project.timeline || 'TBD'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Status</div>
                      <div className="font-semibold capitalize">{project.status.replace('_', ' ')}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setLocation(`/projects/${project.id}`)}
                      data-testid={`button-view-project-${project.id}`}
                    >
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
