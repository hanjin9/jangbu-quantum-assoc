import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { GlobalHeader } from "./components/GlobalHeader";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Appointments from "./pages/Appointments";
import Community from "./pages/Community";
import PracticalExam from "./pages/PracticalExam";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import CertificateVerification from "./pages/CertificateVerification";
import LiveStream from "./pages/LiveStream";
import ChatBot from "./pages/ChatBot";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import SimpleLogin from "./pages/SimpleLogin";
import ProfileEdit from "./pages/ProfileEdit";
import ProfileEditWithImage from "./pages/ProfileEditWithImage";
import Academy from "./pages/Academy";
import Settings from "./pages/Settings";
import ChatConsultation from "./pages/ChatConsultation";
import SuccessGallery from "./pages/SuccessGallery";
import { BottomNavBar } from "./components/BottomNavBar";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/appointments"} component={Appointments} />
      <Route path={"/community"} component={Community} />
      <Route path={"/exam"} component={PracticalExam} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/payment-success"} component={PaymentSuccess} />
      <Route path={"/verify-certificate"} component={CertificateVerification} />
      <Route path={"/livestream"} component={LiveStream} />
      <Route path={"/chatbot"} component={ChatBot} />
      <Route path={"/admin/subscriptions"} component={AdminSubscriptions} />
      <Route path={"/simple-login"} component={SimpleLogin} />
      <Route path={"/profile-edit"} component={ProfileEdit} />
      <Route path={"/profile-edit-image"} component={ProfileEditWithImage} />
      <Route path={"/academy"} component={Academy} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/chat-consultation"} component={ChatConsultation} />
      <Route path={"/success-gallery"} component={SuccessGallery} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <GlobalHeader />
          <main className="min-h-screen pb-20">
            <Router />
          </main>
          <BottomNavBar />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
