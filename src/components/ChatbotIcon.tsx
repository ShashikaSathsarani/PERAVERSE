import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const ChatbotIcon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isKiosk = location.pathname.startsWith('/kiosk');

  const handleClick = () => {
    if (isKiosk) {
      // If already in kiosk mode, switch to the chat page (index 5 in the pages array)
      const event = new CustomEvent('switchToChat', { detail: { pageIndex: 5 } });
      window.dispatchEvent(event);
    } else {
      // If not in kiosk mode, navigate to kiosk chat page
      navigate('/kiosk');
    }
  };

  return (
    <div 
      className="fixed top-4 right-4 z-50 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
      onClick={handleClick}
      title="Open Chatbot"
    >
      <MessageCircle size={24} />
    </div>
  );
};

export default ChatbotIcon;