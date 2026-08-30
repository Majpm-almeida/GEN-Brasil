import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DashboardLayout from "./components/DashboardLayout";
import AccessGate from "./pages/AccessGate";
import Collaboration from "./pages/Collaboration";
import ConsolidatedReport from "./pages/ConsolidatedReport";

function Platform() {
  return (
    <AccessGate>
      <DashboardLayout>
        <Home />
      </DashboardLayout>
    </AccessGate>
  );
}

function CollaborationPlatform() {
  return (
    <AccessGate>
      <DashboardLayout>
        <Collaboration />
      </DashboardLayout>
    </AccessGate>
  );
}

function ReportPlatform() {
  return (
    <AccessGate>
      <DashboardLayout>
        <ConsolidatedReport />
      </DashboardLayout>
    </AccessGate>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Platform} />
      <Route path={"/base"} component={Platform} />
      <Route path={"/fichas"} component={Platform} />
      <Route path={"/sintese"} component={Platform} />
      <Route path={"/entregas"} component={Platform} />
      <Route path={"/administracao"} component={Platform} />
      <Route path={"/colaboracao"} component={CollaborationPlatform} />
      <Route path={"/relatorio"} component={ReportPlatform} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
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
