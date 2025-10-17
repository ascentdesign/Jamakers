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

// Pages
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import ManufacturerDirectory from "@/pages/ManufacturerDirectory";
import ManufacturerDetail from "@/pages/ManufacturerDetail";
import Resources from "@/pages/Resources";
import RFQList from "@/pages/RFQList";
import CreateRFQ from "@/pages/CreateRFQ";
import RFQDetail from "@/pages/RFQDetail";
import ProjectDashboard from "@/pages/ProjectDashboard";
import ProjectDetail from "@/pages/ProjectDetail";
import CreateManufacturerProfile from "@/pages/CreateManufacturerProfile";
import CreateBrandProfile from "@/pages/CreateBrandProfile";
import CreateProject from "@/pages/CreateProject";
import Messages from "@/pages/Messages";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import Training from "@/pages/Training";
import CourseDetail from "@/pages/CourseDetail";
import RawMaterials from "@/pages/RawMaterials";
import RawMaterialDetail from "@/pages/RawMaterialDetail";
import FinanceDirectory from "@/pages/FinanceDirectory";
import LenderDetail from "@/pages/LenderDetail";
import CreatorsDirectory from "@/pages/CreatorsDirectory";
import CreatorDetail from "@/pages/CreatorDetail";
import DesignersDirectory from "@/pages/DesignersDirectory";
import DesignerDetail from "@/pages/DesignerDetail";
import VerificationQueue from "@/pages/admin/VerificationQueue";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show landing page while loading or if not authenticated
  if (isLoading || !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  // Show authenticated routes
  return (
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
