// Reference: blueprint:javascript_log_in_with_replit - Replit Auth integration

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNav } from "@/components/TopNav";
import { JamBot } from "@/components/chatbot/JamBot";
import { useAuth } from "@/hooks/useAuth";
import { Reshaped } from "reshaped";
import "reshaped/themes/reshaped/theme.css";

// Replace eager page imports with lazy-loaded chunks
import { lazy, Suspense } from "react";
const Landing = lazy(() => import("@/pages/Landing"));
const Home = lazy(() => import("@/pages/Home"));
const ManufacturerDirectory = lazy(() => import("@/pages/ManufacturerDirectory"));
const ManufacturerDetail = lazy(() => import("@/pages/ManufacturerDetail"));
const Resources = lazy(() => import("@/pages/Resources"));
const RFQList = lazy(() => import("@/pages/RFQList"));
const CreateRFQ = lazy(() => import("@/pages/CreateRFQ"));
const RFQDetail = lazy(() => import("@/pages/RFQDetail"));
const ProjectDashboard = lazy(() => import("@/pages/ProjectDashboard"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const CreateManufacturerProfile = lazy(() => import("@/pages/CreateManufacturerProfile"));
const CreateBrandProfile = lazy(() => import("@/pages/CreateBrandProfile"));
const CreateProject = lazy(() => import("@/pages/CreateProject"));
const Messages = lazy(() => import("@/pages/Messages"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Profile = lazy(() => import("@/pages/Profile"));
const Training = lazy(() => import("@/pages/Training"));
const CourseDetail = lazy(() => import("@/pages/CourseDetail"));
const RawMaterials = lazy(() => import("@/pages/RawMaterials"));
const RawMaterialDetail = lazy(() => import("@/pages/RawMaterialDetail"));
const FinanceDirectory = lazy(() => import("@/pages/FinanceDirectory"));
const LenderDetail = lazy(() => import("@/pages/LenderDetail"));
const CreatorsDirectory = lazy(() => import("@/pages/CreatorsDirectory"));
const CreatorDetail = lazy(() => import("@/pages/CreatorDetail"));
const DesignersDirectory = lazy(() => import("@/pages/DesignersDirectory"));
const DesignerDetail = lazy(() => import("@/pages/DesignerDetail"));
const VerificationQueue = lazy(() => import("@/pages/admin/VerificationQueue"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show landing page while loading or if not authenticated
  if (isLoading || !isAuthenticated) {
    return (
      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <Switch>
          <Route path="/" component={Landing} />
          <Route component={Landing} />
        </Switch>
      </Suspense>
    );
  }

  // Show authenticated routes
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/manufacturers" component={ManufacturerDirectory} />
        <Route path="/directory/:id" component={ManufacturerDetail} />
        <Route path="/manufacturers/create" component={CreateManufacturerProfile} />
        <Route path="/brands/create" component={CreateBrandProfile} />
        <Route path="/rfqs" component={RFQList} />
        <Route path="/rfqs/new" component={CreateRFQ} />
        <Route path="/rfqs/:id" component={RFQDetail} />
        <Route path="/projects" component={ProjectDashboard} />
        <Route path="/projects/new/:rfqId?" component={CreateProject} />
        <Route path="/projects/:id" component={ProjectDetail} />
        <Route path="/training" component={Training} />
        <Route path="/training/:id" component={CourseDetail} />
        <Route path="/raw-materials" component={RawMaterials} />
        <Route path="/raw-materials/:id" component={RawMaterialDetail} />
        <Route path="/finance" component={FinanceDirectory} />
        <Route path="/finance/:id" component={LenderDetail} />
        <Route path="/creators" component={CreatorsDirectory} />
        <Route path="/creators/:id" component={CreatorDetail} />
        <Route path="/designers" component={DesignersDirectory} />
        <Route path="/designers/:id" component={DesignerDetail} />
        <Route path="/messages" component={Messages} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/profile" component={Profile} />
        <Route path="/resources" component={Resources} />
        <Route path="/admin/verifications" component={VerificationQueue} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  // Custom sidebar width for better content display
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <>
      {isAuthenticated ? (
        <SidebarProvider defaultOpen={true} style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <TopNav />
              <main className="flex-1 overflow-y-auto p-6 bg-background">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
      ) : (
        <Router />
      )}
      <JamBot />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Reshaped theme="reshaped">
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </Reshaped>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
