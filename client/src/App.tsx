import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Suppliers from "@/pages/suppliers";
import SupplierDetail from "@/pages/supplier-detail";
import Workflow from "@/pages/workflow";
import Visualization from "@/pages/visualization";
import Inventory from "@/pages/inventory";

function Router() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Layout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/suppliers" component={Suppliers} />
        <Route path="/supplier/:id" component={SupplierDetail} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/workflow" component={Workflow} />
        <Route path="/visualization" component={Visualization} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
