import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MoradorDashboard from "./pages/MoradorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DisposalMap from "./pages/DisposalMap";
import Education from "./pages/Education";
import ProfileSelection from "./pages/ProfileSelection";
import MetricsDashboard from "./pages/MetricsDashboard";
import UserProfile from "./pages/UserProfile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profile-selection" component={ProfileSelection} />
      <Route path="/morador/dashboard" component={MoradorDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/disposal-map" component={DisposalMap} />
      <Route path="/education" component={Education} />
      <Route path="/metrics" component={MetricsDashboard} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
