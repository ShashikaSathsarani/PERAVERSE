import { useState, useEffect, useRef, useCallback } from 'react'
import HomePageTailwind from './HomePage'
import SchedulePageTailwind from './SchedulePage'
import ExhibitsPageTailwind from './ExhibitsPage'
import MapPageTailwind from './MapPage'
import HeatMapPageTailwind from './HeatMapPage'
import ChatBotPage from './ChatBotPage'
import IntroVideoTailwind from './IntroVideo'
import NavigationTailwind from './Navigation'
import FooterTailwind from './Footer'

const AppKiosk: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showIntroVideo, setShowIntroVideo] = useState<boolean>(true);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pages array including ChatBot
  const pages = [HomePageTailwind, SchedulePageTailwind, ExhibitsPageTailwind, MapPageTailwind, HeatMapPageTailwind, ChatBotPage];
  
  // ChatBot is at index 5
  const CHATBOT_PAGE_INDEX = 5;

  const handleUserActivity = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (!showIntroVideo) {
      inactivityTimerRef.current = setTimeout(() => {
        setShowIntroVideo(true);
        setCurrentPage(0);
      }, 60000);
    }
  }, [showIntroVideo]);

  const handleIntroVideoClick = () => {
    setShowIntroVideo(false);
    setCurrentPage(0);
    handleUserActivity();
  };

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    handleUserActivity();
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'] as const;
    const addEventListeners = () => events.forEach(event => document.addEventListener(event, handleUserActivity, true));
    const removeEventListeners = () => events.forEach(event => document.removeEventListener(event, handleUserActivity, true));

    if (!showIntroVideo) {
      addEventListeners();
      handleUserActivity();
    } else {
      removeEventListeners();
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }
    return () => {
      removeEventListeners();
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [showIntroVideo, handleUserActivity]);

  const CurrentComponent = pages[currentPage];

  if (showIntroVideo) return <IntroVideoTailwind onVideoClick={handleIntroVideoClick} />;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 relative flex flex-col overflow-hidden text-base">
      {/* Overlay gradients */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 80%, rgba(56,189,248,0.1) 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, rgba(59,130,246,0.08) 0%, transparent 50%),
                       radial-gradient(circle at 40% 40%, rgba(6,182,212,0.12) 0%, transparent 50%),
                       linear-gradient(180deg, rgba(56,189,248,0.05) 0%, transparent 100%)`
        }}
      />
      
      {/* Navigation Sidebar - High z-index to stay on top */}
      <div className="relative z-50">
        <NavigationTailwind currentPage={currentPage} onPageClick={handlePageClick} pages={pages} />
      </div>

      {/* Main content area - aligned with sidebar height */}
      <div className="fixed top-5 bottom-[90px] left-[210px] right-5 flex flex-col min-h-0 z-10">
        {/* Page content with rounded container - scrollable */}
        <div className="flex-1 p-8 overflow-y-auto overflow-x-hidden flex flex-col bg-slate-700/30 backdrop-blur-xl rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.15)] scroll-smooth scrollbar-thin scrollbar-thumb-sky-400/60 scrollbar-track-slate-800/30 min-h-0">
          <CurrentComponent onNavigateToChatBot={() => handlePageClick(CHATBOT_PAGE_INDEX)} />
        </div>

        {/* Scrolling Contact Info - hide on home page (0) and chatbot page (5) */}
        {currentPage !== 0 && currentPage !== CHATBOT_PAGE_INDEX && (
          <div className="w-full overflow-hidden py-2 border-t border-white/20 flex-shrink-0 mb-2">
            <div className="animate-marquee-fast text-yellow-400 text-3xl font-bold whitespace-nowrap">
              <span className="mx-8">• University Security: +94 81 239 4914</span>
              <span className="mx-8">• University Medical Center: +94 81 239 2361</span>
              <span className="mx-8">• Event Coordinator: +94 81 239 3000</span>
              <span className="mx-8">• Technical Support: +94 81 239 3001</span>
          </div>
        </div>
        )}
      </div>

      {/* Footer - Aligned with content area, matching background color */}
      <div className="fixed bottom-2 left-[210px] right-5 py-3 bg-slate-700/30 backdrop-blur-xl border border-white/15 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.15)] z-40">
        <div className="text-center text-white/80 px-4">
          <p className="my-1 text-xs font-normal">
            © 2025 Faculty of Engineering, University of Peradeniya
          </p>
          <p className="my-1 text-xs font-light">
            PeraVerse Digital Kiosk System by PeraCom
          </p>
        </div>
      </div>

      {/* Marquee Animation Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }

          .animate-marquee {
            display: inline-block;
            animation: marquee 10s linear infinite;
          }

          @keyframes marquee-fast {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }

          .animate-marquee-fast {
            animation: marquee-fast 30s linear infinite;
          }
        `
      }} />
    </div>
  );
};

export default AppKiosk;
