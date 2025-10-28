import { useState, useEffect } from 'react'
import logo from './kioskAssets/university-of-peradeniya-logo-png_seeklogo-480462-removebg-preview.png'


//__________________________________________________________________________________________________________________
interface NavigationTailwindProps {
  currentPage: number; //currentPage - tells which page is currently selected (active).
  onPageClick: (pageIndex: number) => void; //onPageClick - function that changes the page when you click a button
  pages: React.ComponentType[]; //pages - holds all available page components
}
//__________________________________________________________________________________________________________________


/**
 * Navigation Component - Tailwind Version
 * 
 * Sidebar navigation component with:
 * - University logo
 * - Navigation menu items
 * - Real-time date and time display
 * - Active page highlighting
 */
const NavigationTailwind: React.FC<NavigationTailwindProps> = ({ currentPage, onPageClick, pages }) => {
  // State for real-time clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  
  // Page names corresponding to the components
  const pageNames: string[] = ['Home', 'Events', 'Exhibits', 'Map', 'Heat Map', 'ChatBot']
  
  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timeInterval)
  }, [])
  
  return (
    <div className="fixed left-5 top-5 bottom-2 w-[180px] bg-slate-800/90 backdrop-blur-3xl border border-white/15 rounded-3xl p-4 flex flex-col z-[1000] shadow-[0_25px_50px_rgba(0,0,0,0.25)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
      {/* Logo Section */}
      <div className="flex justify-center items-center mb-6 pb-6 border-b border-white/15">
        <img 
          src={logo} 
          alt="University of Peradeniya Logo" 
          className="w-[90px] h-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
        />
      </div>
      

      {/*______________________________________________________________________________________________________________________________________________________________________________________________________________
       Navigation Menu 
      It loops through each page.
      When a button is clicked - onPageClick(index) is called.
      It updates the active page visually with index === currentPage
      */}
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto overflow-x-visible px-2 pt-3 pb-0.5 scrollbar-thin scrollbar-thumb-blue-500/60 scrollbar-track-slate-700/30 hover:scrollbar-thumb-blue-500/80">
        {pages.map((_, index) => (
          <div
            key={index}
            className={`nav-item flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-700/60 backdrop-blur-md border-2 border-white/10 transition-all duration-300 relative cursor-pointer select-none group ${
              index === currentPage 
                ? 'active bg-gradient-to-r from-blue-500/40 to-purple-500/40 border-blue-400/80 scale-105 shadow-[0_5px_20px_5px_rgba(59,130,246,0.4),0_0_15px_rgba(168,85,247,0.3)]' 
                : 'hover:bg-gradient-to-r hover:from-sky-400/25 hover:to-cyan-400/25 hover:border-sky-400/50 hover:scale-[1.03] hover:shadow-[0_5px_15px_5px_rgba(56,189,248,0.35)] active:scale-95 active:shadow-[0_5px_10px_5px_rgba(56,189,248,0.5)] active:brightness-125'
            }`}
            onClick={() => onPageClick(index)}
            style={{ cursor: 'pointer' }}
          >
            {/* Ripple effect overlay */}
            <div className="absolute inset-0 bg-white/0 group-active:bg-white/20 transition-all duration-150 rounded-2xl"></div>
            
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>
            
            <span className="text-white/90 font-medium text-base relative z-10 group-active:scale-95 transition-transform duration-150">
              {pageNames[index]}
            </span>
          </div>
        ))}
        {/*
        _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
        */}
      </div>
      


      {/* Date and Time Display */}
      <div className="mt-auto pt-4 border-t border-white/15 space-y-3">
        {/* Time Display */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/40 backdrop-blur-md rounded-xl border border-white/10">
          <span className="text-xl">🕐</span>
          <span className="text-white/90 font-medium text-base">
            {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
        
        {/* Date Display */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/40 backdrop-blur-md rounded-xl border border-white/10">
          <span className="text-xl">📅</span>
          <span className="text-white/90 font-medium text-base">
            {currentTime.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Custom styles for webkit scrollbar */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-track-slate-700/30::-webkit-scrollbar-track {
            background: rgba(51, 65, 85, 0.3);
            border-radius: 10px;
          }
          .scrollbar-thumb-blue-500/60::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.6);
            border-radius: 10px;
            transition: background 0.3s ease;
          }
          .scrollbar-thumb-blue-500/60::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.8);
          }
          .nav-item:hover { 
            background: rgba(56, 189, 248, 0.2); 
            border-color: rgba(56, 189, 248, 0.4); 
            transform: scale(1.02); 
            box-shadow: 0 10px 30px rgba(56, 189, 248, 0.3); 
          }
          .nav-item.active { 
            background: rgba(59, 130, 246, 0.3); 
            border-color: rgba(59, 130, 246, 0.6); 
            transform: scale(1.05); 
            box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4); 
          }
        `
      }} />
    </div>
  )
}

export default NavigationTailwind
