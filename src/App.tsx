import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { JourneySection } from './components/JourneySection';
import { RolesSection } from './components/RolesSection';
import { AIToolsSection } from './components/AIToolsSection';
import { CommunitySection } from './components/CommunitySection';
import { EventsSection } from './components/EventsSection';
import { EventsPage } from './components/EventsPage';
import { GrowthTrackingSection } from './components/GrowthTrackingSection';
import { SecuritySection } from './components/SecuritySection';
import { SuccessStoriesSection } from './components/SuccessStoriesSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { MissionSection } from './components/MissionSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { DetailedSignupPage } from './components/DetailedSignupPage';
import { ProfileCompletionPage } from './components/ProfileCompletionPage';
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { CookiePolicyPage } from './components/CookiePolicyPage';
import { ContactPage } from './components/ContactPage';
import { FounderDashboard } from './components/FounderDashboard';
import { ExpertDashboard } from './components/ExpertDashboard';
import { InvestorDashboard } from './components/InvestorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfilePage } from './components/ProfilePage';
import { FundingPortalFounder } from './components/FundingPortalFounder';
import { FundingPortalInvestor } from './components/FundingPortalInvestor';
import { DealRoomPage } from './components/DealRoomPage';
import { PodcastsPage } from './components/PodcastsPage';
import { NewsFeedPage } from './components/NewsFeedPage';
import { HelpSupportPage } from './components/HelpSupportPage';
import { PitchDeckSummarizerPage } from './components/PitchDeckSummarizerPage';
import { useEffect, useState } from 'react';
import { getCurrentUser } from './services/authService';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for logged in user
    const loggedInUser = getCurrentUser();
    if (loggedInUser) {
      setUser(loggedInUser);
      // If we are on home/login/signup, redirect to dashboard
      const hash = window.location.hash.slice(1);
      if (!hash || ['login', 'signup', 'home'].includes(hash)) {
        window.location.hash = `#${loggedInUser.role}-dashboard`;
      }
    }

    // Handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === 'login') {
        setCurrentPage('login');
      } else if (hash === 'signup') {
        setCurrentPage('signup');
      } else if (hash === 'detailed-signup') {
        setCurrentPage('detailed-signup');
      } else if (hash === 'complete-profile') {
        setCurrentPage('complete-profile');
      } else if (hash === 'terms') {
        setCurrentPage('terms');
      } else if (hash === 'privacy') {
        setCurrentPage('privacy');
      } else if (hash === 'cookie-policy') {
        setCurrentPage('cookie-policy');
      } else if (hash === 'contact') {
        setCurrentPage('contact');
      } else if (hash === 'founder-dashboard') {
        setCurrentPage('founder-dashboard');
      } else if (hash === 'expert-dashboard') {
        setCurrentPage('expert-dashboard');
      } else if (hash === 'investor-dashboard') {
        setCurrentPage('investor-dashboard');
      } else if (hash === 'admin-dashboard') {
        setCurrentPage('admin-dashboard');
      } else if (hash.startsWith('profile/')) {
        setCurrentPage(hash);
      } else if (hash === 'funding-portal-founder') {
        setCurrentPage('funding-portal-founder');
      } else if (hash === 'funding-portal-investor') {
        setCurrentPage('funding-portal-investor');
      } else if (hash === 'deal-room') {
        setCurrentPage('deal-room');
      } else if (hash === 'events') {
        setCurrentPage('events');
      } else if (hash === 'podcasts') {
        setCurrentPage('podcasts');
      } else if (hash === 'news-feed') {
        setCurrentPage('news-feed');
      } else if (hash === 'help-support') {
        setCurrentPage('help-support');
      } else if (hash === 'pitch-deck-summarizer') {
        setCurrentPage('pitch-deck-summarizer');
      } else {
        setCurrentPage('home');
      }

      // Scroll to top when page changes
      window.scrollTo(0, 0);
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Check initial hash
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Render based on current page
  if (currentPage === 'login') {
    return <LoginPage />;
  }

  if (currentPage === 'signup') {
    return <SignupPage />;
  }

  if (currentPage === 'detailed-signup') {
    return <DetailedSignupPage />;
  }

  if (currentPage === 'complete-profile') {
    return <ProfileCompletionPage />;
  }

  if (currentPage === 'terms') {
    return <TermsPage />;
  }

  if (currentPage === 'privacy') {
    return <PrivacyPage />;
  }

  if (currentPage === 'cookie-policy') {
    return <CookiePolicyPage />;
  }

  if (currentPage === 'contact') {
    return <ContactPage />;
  }

  if (currentPage === 'founder-dashboard') {
    return <FounderDashboard />;
  }

  if (currentPage === 'expert-dashboard') {
    return <ExpertDashboard />;
  }

  if (currentPage === 'investor-dashboard') {
    return <InvestorDashboard />;
  }

  if (currentPage === 'admin-dashboard') {
    return <AdminDashboard />;
  }

  if (currentPage.startsWith('profile/')) {
    const roleFromPath = currentPage.split('/')[1];
    if (roleFromPath === 'admin') {
      return <AdminDashboard />;
    }
    const userRole = roleFromPath as 'founder' | 'expert' | 'investor';
    return <ProfilePage userRole={userRole} />;
  }

  if (currentPage === 'funding-portal-founder') {
    return <FundingPortalFounder />;
  }

  if (currentPage === 'funding-portal-investor') {
    return <FundingPortalInvestor />;
  }

  if (currentPage === 'deal-room') {
    return <DealRoomPage />;
  }

  if (currentPage === 'events') {
    return <EventsPage />;
  }

  if (currentPage === 'podcasts') {
    return <PodcastsPage />;
  }

  if (currentPage === 'news-feed') {
    return <NewsFeedPage />;
  }

  if (currentPage === 'help-support') {
    return <HelpSupportPage />;
  }

  if (currentPage === 'pitch-deck-summarizer') {
    return <PitchDeckSummarizerPage />;
  }

  return (
    <div className="min-h-screen relative">
      <HeroSection />
      <FeaturesSection />
      <JourneySection />
      <RolesSection />
      <AIToolsSection />
      <CommunitySection />
      <EventsSection />
      <GrowthTrackingSection />
      <SecuritySection />
      <SuccessStoriesSection />
      <WhyChooseSection />
      <MissionSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}