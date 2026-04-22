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
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronLeft } from 'lucide-react';
import MyCertificates from "./pages/MyCertificates";
import ExamPracticeBook from "./pages/ExamPracticeBook";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import BlogDetail from "./pages/BlogDetail";
import SMSLogin from "./pages/SMSLogin";
import PaymentCheckout from "./pages/PaymentCheckout";
import CertificateGenerator from "./pages/CertificateGenerator";
import ConsultationBooking from "./pages/ConsultationBooking";
import SearchResults from "./pages/SearchResults";
import AdminMembers from "./pages/AdminMembers";
import { MyPage } from "./pages/MyPage";

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
      <Route path={"/consultation-booking"} component={ConsultationBooking} />
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
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/sms-login" component={SMSLogin} />
      <Route path="/payment-checkout" component={PaymentCheckout} />
      <Route path="/certificates-download" component={CertificateGenerator} />
      <Route path="/search" component={SearchResults} />
      <Route path="/admin-members" component={AdminMembers} />
      <Route path="/my-page" component={MyPage} />
      <Route path="*" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    window.history.back();
  };

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

          {/* PC 화면 왼쪽 하단 뒤로가기 버튼 */}
          <button
            onClick={goBack}
            className="hidden md:flex fixed bottom-8 left-8 z-40 w-12 h-12 rounded-full bg-white/30 hover:bg-white/50 text-white items-center justify-center transition-all duration-300 backdrop-blur-sm"
            title="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* PC 화면 오른쪽 하단 위로가기 버튼 */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="hidden md:flex fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 items-center justify-center transition-all duration-300 shadow-lg"
              title="맨 위로"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
