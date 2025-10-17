import React from 'react';
import Dashboard from '../Maps/Dashboard';
import ChatBotButtonKiosk from './components/ChatBotButtonKiosk';

interface MapPageTailwindProps {
  onNavigateToChatBot?: () => void;
}

const MapPageTailwind: React.FC<MapPageTailwindProps> = ({ onNavigateToChatBot }) => {
  

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex-1 w-full h-full">
        <Dashboard kiosk_mode={true}/>
      </div>
      
      {/* Floating ChatBot Button */}
      {onNavigateToChatBot && <ChatBotButtonKiosk onNavigateToChatBot={onNavigateToChatBot} />}
    </div>
  );
};

export default MapPageTailwind;
