/*
________________________________________________________
1. Shows a welcome message from the bot
2. Lets users type or click a question
3. Sends that question to the Gemini AI
4. Shows the bot’s reply (and the map if needed)
5. Scrolls down automatically
6. Shows typing dots while waiting for a reply
________________________________________________________
*/


/*useState - to store changing values (like messages and input)
useRef - to reference DOM elements (like for scrolling)
useEffect - to run code automatically when something changes*/
import { useState, useRef, useEffect } from 'react'

//Imports icons from the lucide-react library - These are SVG icons used for buttons and avatars
import { Send, Bot, User, Sparkles, HelpCircle, MapPin, Calendar, Building } from 'lucide-react'

//Imports our custom Gemini AI service that handles getting AI responses
import { geminiService } from './utils/geminiService'

//mports your CSS styling file for animations, colors
import './ChatBot.css'

//Imports an image of the campus map so it can be displayed in chat
import mapImage from './kioskAssets/map.jpg'

//Defines what each message looks like
interface Message {
  id: string;  //unique number or string
  text: string;  //the message content
  sender: 'user' | 'bot';  //whether it's from the user or bot
  timestamp: Date;  //the time message was sent
  imageUrl?: string; // Optional image to display in the message
}

//Defines what properties (props) this component can receive
interface ChatBotPageProps {
  onNavigateToChatBot?: () => void;
}

//Starts the ChatBotPage component - a React function that displays the chatbot
const ChatBotPage: React.FC<ChatBotPageProps> = () => {

  //Creates a state variable called messages that stores all chat messages
  //It starts with one message - the bot’s welcome message
  const [messages, setMessages] = useState<Message[]>([
    {

      /*Checks if Gemini API key exists
      If yes - shows “I’m Gemini, your AI assistant...”
      If no - shows a simpler message */
      id: '1',
      text: 'Hello! 👋 Welcome to EngEx! I\'m your AI assistant for this amazing engineering exhibition. I\'m here to help you navigate the campus, find events, and discover all the incredible projects on display. What would you like to explore first?',
      sender: 'bot',
      timestamp: new Date() //Marks the sender as bot and adds current time
    }
  ])

  //Stores what the user is typing in the chat box
  const [inputText, setInputText] = useState<string>('')

  //Tells whether the bot is currently typing (to show the typing dots)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  //A reference to the bottom of the chat window, used for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Predefined quick questions
  const quickQuestions = [
    { icon: MapPin, text: 'Where is the main auditorium of the faculty?', category: 'navigation' },
    { icon: Calendar, text: 'What events are happening today?', category: 'events' },
    { icon: Building, text: 'Show me the campus map', category: 'map' },
    { icon: HelpCircle, text: 'How do I get to the canteen?', category: 'help' }
  ]

  /*Sends user’s question to the Gemini AI
  Waits for a reply using await
  If there’s an error, logs it and returns a friendly apology */
  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
      return await geminiService.generateResponse(userMessage)
    } catch (error) {
      console.error('Error getting bot response:', error)
      return 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our event coordinators at +94 81 239 3000 for assistance.'
    }
  }

  //Scrolls the chat to the very bottom smoothly- Uses the reference (messagesEndRef) created earlier
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  //Every time the messages list changes (new message added), this function runs
  //It calls scrollToBottom() to keep the latest chat visible
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  //If input is empty - stop
  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    //Creates a new message object for the user
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    /*Adds the user’s message to the chat
    Clears the input field
    Turns on typing animation (isTyping = true) */
    const currentInput = inputText
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    try {
      // Gets the bot’s reply from Gemini AI
      const responseText = await getBotResponse(currentInput)
      
      // Check if the response should include the faculty map
      //If yes, we’ll display the map image
      const shouldShowMap = currentInput.toLowerCase().includes('map') || 
                           currentInput.toLowerCase().includes('show') && currentInput.toLowerCase().includes('campus') ||
                           currentInput.toLowerCase().includes('where is')
      
      
      //Creates the bot’s reply message
      //Includes the map image if needed
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        imageUrl: shouldShowMap ? mapImage : undefined
      }

      //Adds bot’s reply to the chat
      setMessages(prev => [...prev, botResponse])

      //If something goes wrong, shows an apology. Finally, stops typing dots
    } catch (error) {
      console.error('Error sending message:', error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our event coordinators for assistance.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  //Fills input with the question text
  //Sends it automatically after 0.1 second
  const handleQuickQuestion = (questionText: string) => {
    setInputText(questionText)
    setTimeout(() => handleSendMessage(), 100)
  }

  //If we press Enter (without Shift), it sends the message
  //Shift + Enter = new line
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }


  /*________________________________________________________________________________________________________
  Everything below is HTML-like JSX that builds the chatbot window
  */
  return (
    <div className="h-full w-full flex flex-col animate-fadeIn">
      {/* Header */}

      {/* Top bar with bot icon and name*/}
      {/*Shows Gemini API status (green = active, yellow = basic mode)*/}
      <div className="flex items-center justify-between pb-6 border-b border-white/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">SmartTalk EngEx AI Assistant</h1>
            <p className="text-slate-300">Ask me anything about the exhibition</p>
          </div>
        </div>
        
        {/* API Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${geminiService.isApiKeyConfigured() ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
          <span className="text-xs text-slate-400">
            {geminiService.isApiKeyConfigured() ? 'AI Active' : 'Basic Mode'}
          </span>
        </div>
      </div>

      {/* Quick Questions
      Shown only at the beginning (when you haven’t chatted yet)
      Displays clickable buttons for common questions
      */}
      {messages.length <= 1 && (
        <div className="py-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Quick Questions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question.text)}
                className="p-4 bg-slate-700/50 hover:bg-slate-600/50 border border-white/10 rounded-xl transition-all duration-200 text-left group hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <question.icon className="h-5 w-5 text-blue-400 mt-0.5 group-hover:text-blue-300 transition-colors" />
                  <span className="text-slate-200 text-sm leading-relaxed">{question.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages
      Main chat area

      Loops through messages:
            If sender = “bot”, message appears on left
            If sender = “user”, message appears on right
            Shows message text, optional image, and time
      */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 chat-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ml-12'
                  : 'bg-slate-700/80 backdrop-blur-sm text-slate-100 border border-white/10'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
              
              {/* Display map image if included in the message */}
              {message.imageUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border-2 border-white/20 shadow-xl">
                  <img 
                    src={message.imageUrl} 
                    alt="Campus Map" 
                    className="w-full h-auto object-contain bg-white"
                  />
                  <div className="bg-slate-800/90 p-2 text-center">
                    <p className="text-xs text-slate-300">
                      🗺️ Faculty of Engineering Campus Map 
                    </p>
                  </div>
                </div>
              )}
              
              <span className="text-xs opacity-70 mt-2 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {message.sender === 'user' && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {/*___________________________________________________________________________________________________________________________________________________
         Typing Indicator
        Shows bot’s typing animation when waiting for AI reply
        Uses three dots with animation-delay classes
        */}
        {isTyping && (
          <div className="flex gap-4 justify-start">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-slate-700/80 backdrop-blur-sm border border-white/10 p-4 rounded-2xl shadow-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse animation-delay-200"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse animation-delay-400"></div>
              </div>
            </div>
          </div>
        )}
        {/*___________________________________________________________________________________________________________________________________________________
        */}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area
      Textbox for typing messages
      Send button beside it
      Disabled if empty or bot is typing
      Below it: small text “Press Enter to send • Shift + Enter for new line”
      */}
      <div className="border-t border-white/20 pt-4">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about events, directions, facilities..."
            className="w-full p-4 pr-14 bg-slate-700/50 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 min-h-[56px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            title="Send message"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  )
}

{/*Exports this component so you can use <ChatBotPage /> elsewhere*/}
export default ChatBotPage