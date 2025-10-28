/*
This code creates a floating chatbot button that appears at the bottom-right corner of the kiosk screen.
It bounces, glows, and shows a small “Ask me anything” tooltip when hovered.
*/


import { useState } from 'react'

interface ChatBotButtonKioskProps {
  onNavigateToChatBot: () => void
}

const ChatBotButtonKiosk: React.FC<ChatBotButtonKioskProps> = ({ onNavigateToChatBot }) => {

  //Keeps track of whether the mouse is over the button or not
  //Used to show tooltip and enlarge the button
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/*Places the button fixed at the bottom-right corner of the screen*/}
      <div className="fixed bottom-6 right-6 z-50">

        {/* Tooltip - appears on hover */}
        <div 
          className={`absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-xl whitespace-nowrap transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {/* This is the small text bubble that says “Ask me anything”
          It only appears when the button is hovered
          */}
          Ask me anything
          {/* Tooltip arrow */}
          <div className="absolute top-full right-6 w-0 h-0" style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #111827'
          }}></div>
        </div>

        {/* Floating Button
        When clicked - calls the onNavigateToChatBot() function (goes to ChatBot page)
        When hovered - shows tooltip and enlarges the button
        */}
        <button
          onClick={onNavigateToChatBot}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`chatbot-button group relative flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out ${
            isHovered ? 'w-20 h-20' : 'w-16 h-16'
          }`}
          aria-label="Open ChatBot"
        >
          {/* Chat Icon
          This draws the chat bubble icon inside the button
          */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-all duration-300 ${isHovered ? 'w-10 h-10 rotate-12' : 'w-8 h-8'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>

          {/* Pulse Animation Ring - continuous bounce
          Creates two glowing rings that repeatedly expand and fade, like a pulse effect
          */}
          <span className="pulse-ring absolute inset-0 rounded-full bg-blue-400 opacity-60"></span>
          <span className="pulse-ring-delayed absolute inset-0 rounded-full bg-purple-400 opacity-40"></span>
        </button>
      </div>

      {/* Inline styles for animations
      bounce-gentle: makes the button gently bounce up and down
      pulse-scale: makes the glowing ring expand and fade continuously
      */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse-scale {
            0%, 100% {
              transform: scale(1);
              opacity: 0.6;
            }
            50% {
              transform: scale(1.15);
              opacity: 0;
            }
          }

          @keyframes bounce-gentle {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          .chatbot-button {
            animation: bounce-gentle 2s ease-in-out infinite;
          }

          .pulse-ring {
            animation: pulse-scale 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .pulse-ring-delayed {
            animation: pulse-scale 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            animation-delay: 1s;
          }

          .chatbot-button:hover {
            animation: none;
          }
        `
      }} />
    </>
  )
}

export default ChatBotButtonKiosk
