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
import TeamProfile from "./pages/TeamProfile";
import NewsletterBlog from "./pages/NewsletterBlog";
import SignupProcess from "./pages/SignupProcess";
import NotificationCenter from "./pages/NotificationCenter";
import NotificationPreferences from "./pages/NotificationPreferences";
import MembershipTiers from "./pages/MembershipTiers";
import AdminStatsDashboard from "./pages/AdminStatsDashboard";
import RevenueAnalytics from "./pages/RevenueAnalytics";
import FeedbackPage from "./pages/FeedbackPage";
import AnnouncementPage from "./pages/AnnouncementPage";
import { LiveLecture } from "./pages/LiveLecture";
import { SearchRecommend } from "./pages/SearchRecommend";
import { CertificatePage } from "./pages/CertificatePage";
import { AdminLogin } from "./pages/AdminLogin";
import { AuditLogDashboard } from "./pages/AuditLogDashboard";
import { MobileNotificationCenter } from "./pages/MobileNotificationCenter";
import { BottomNavBar } from "./components/BottomNavBar";
import MyCertificates from "./pages/MyCertificates";
import ExamPracticeBook from "./pages/ExamPracticeBook";
import { OwnerDashboard } from "./pages/OwnerDashboard";

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
      <Route path={"/team-profile"} component={TeamProfile} />
      <Route path={"/newsletter-blog"} component={NewsletterBlog} />
      <Route path={"/signup"} component={SignupProcess} />
      <Route path={"/notifications"} component={NotificationCenter} />
      <Route path={"/notification-preferences"} component={NotificationPreferences} />
      <Route path={"/membership-tiers"} component={MembershipTiers} />
      <Route path={"/admin-stats"} component={AdminStatsDashboard} />
      <Route path={"/revenue-analytics"} component={RevenueAnalytics} />
      <Route path="/feedback" component={FeedbackPage} />
      <Route path="/announcements" component={AnnouncementPage} />
      <Route path="/live-lecture" component={LiveLecture} />
      <Route path="/search-recommend" component={SearchRecommend} />
      <Route path="/certificates" component={CertificatePage} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/audit-logs" component={AuditLogDashboard} />
      <Route path="/mobile-notifications" component={MobileNotificationCenter} />
      <Route path="/my-certificates" component={MyCertificates} />
      <Route path="/exam-practice-book" component={ExamPracticeBook} />
      <Route path="/owner-dashboard" component={OwnerDashboard} />
      <Route path="/404" component={NotFound} />
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
