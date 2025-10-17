import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ChatBotButtonProps {
  onClick?: () => void
  navigateTo?: string
}

const ChatBotButton: React.FC<ChatBotButtonProps> = ({ onClick, navigateTo = '/kiosk/chatbot' }) => {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (navigateTo) {
      navigate(navigateTo)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap animate-fadeIn">
          Ask me anything
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 ease-in-out"
        aria-label="Open ChatBot"
      >
        {/* Chat Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 transform group-hover:rotate-12 transition-transform duration-300"
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

        {/* Pulse Animation Ring */}
        <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
        
        {/* Notification Badge (Optional - can be enabled for new messages) */}
        {/* <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          !
        </span> */}
      </button>
    </div>
  )
}

export default ChatBotButton
