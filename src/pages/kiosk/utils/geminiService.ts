/*
This file connects chatbot frontend with Google Gemini AI and  EngEx knowledge base database
It decides:
        When to reply using Gemini AI
        What kind of answers to give
        How to handle greetings or errors
        What to do if the database or API is down
*/

//GoogleGenerativeAI: library for connecting to Google’s Gemini AI model
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
//knowledgeBaseService:  module that fetches related EngEx data (from  Supabase/knowledge base API)
import { knowledgeBaseService } from './knowledgeBaseService'

//Creates a new class called GeminiService
//genAI holds the main Gemini API connection
//model stores the actual AI model you’ll use for generating text
//Both start as null until configured
class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: GenerativeModel | null = null

  //Reads Gemini API key from environment variables (from .env file)
  constructor() {
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
    
    //If a valid key exists; Connects to Google’s AI system
    if (apiKey && apiKey !== 'your_api_key_here') {

      /*
      Loads the Gemini 2.0 Flash experimental model (very fast)
          temperature: 0.1 - keep answers stable and factual (not creative)
          topK / topP - limit randomness; ensures consistent replies
          maxOutputTokens - allows longer, detailed responses (up to 4096 tokens)
      */
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.1,  // Very low temperature for consistent, factual responses
          topK: 1,           // Only consider the top result for maximum consistency
          topP: 0.1,         // Low diversity for deterministic answers
          maxOutputTokens: 4096,  // Increased to allow longer, detailed responses
        }
      })
    }
  }

  /**
   * Get fallback knowledge when database is unavailable
   * If your database is offline, this message appears - a friendly fallback note for users
   */
  private getFallbackKnowledge(): string {
    return `
IMPORTANT: The knowledge base database is temporarily unavailable. Please try again in a moment.
If the issue persists, contact the event staff for assistance.
`
  }

  /**
   * Check if the message is a greeting
   * Detects if the user said “hi,” “hello,” etc.
   * Returns true if it’s a greeting - the bot will show its intro message
   */
  private isGreeting(message: string): boolean {
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'hola', 'namaste']
    const lowerMessage = message.toLowerCase().trim()
    return greetings.some(greeting => 
      lowerMessage === greeting || 
      lowerMessage.startsWith(greeting + ' ') ||
      lowerMessage.startsWith(greeting + ',')
    )
  }

  /**
   * Get introduction/greeting response about EngEx and the chatbot
   * A friendly introduction message shown when the user greets the bot
   * Explains who the bot is and what it can do (faculty info, events, map, etc.)
   * Uses emojis and bold text to look friendly
   */
  private getIntroductionResponse(): string {
    return `👋 **Hello and Welcome to EngEx 2025!**

I'm your AI-powered assistant for the **Faculty of Engineering Exhibition** at the **University of Peradeniya**.

🎯 **How I Can Help You:**

I have access to comprehensive information about:

• **🏛️ Faculty Information** - History, departments, facilities, and academic programs
• **📅 Exhibition Events** - Schedule, timings, venues, and event descriptions
• **🏢 Departments** - All 8 engineering departments and their specializations
• **📍 Campus Map** - Building locations, zones, and navigation help
• **📞 Contact Information** - Phone numbers, emails, and office locations
• **👥 Staff & Faculty** - Department heads, deans, and key contacts
• **🎓 Academic Programs** - Undergraduate and postgraduate programs
• **🔬 Research & Facilities** - Labs, equipment, and research areas

💡 **What Makes Me Special:**

✅ All information comes directly from our official knowledge base
✅ I provide detailed, point-wise answers with complete information
✅ Real-time data connected to our database
✅ No generic responses - only accurate faculty information

🗣️ **Try Asking Me:**

• "What events are happening today?"
• "Tell me about the departments"
• "Where is the Dean's office?"
• "What is the exhibition schedule?"
• "Show me the campus map"
• "Contact information for Engineering Mathematics department"

**Feel free to ask me anything about the Faculty of Engineering or the EngEx 2025 exhibition!** 🚀

What would you like to know?`
  }

  
  //This is the main function that makes the bot think and reply
  //If Gemini model is not ready, show fallback message (API not configured)
  async generateResponse(prompt: string): Promise<string> {
    if (!this.model) {
      return this.getFallbackResponse()
    }

    // If the user just says “hi,” it shows the introduction instead of querying Gemini
    if (this.isGreeting(prompt)) {
      return this.getIntroductionResponse()
    }

    try {
      // Get database context for this specific query
      const dbContext = await knowledgeBaseService.getContextForAI(prompt)
      
      // Use database context if available
      const knowledgeContext = dbContext || this.getFallbackKnowledge()
      
      // Build enhanced prompt with database knowledge
      //This is the instruction block sent to Gemini AI
      /**
       * It includes:
            * Context about the event (EngEx 2025)
            * Strict rules (use only the database info)
            * Response style guide (bullet points, emojis, full answers)
            * he actual user question (prompt)
       */
      const enhancedPrompt = `You are an AI assistant helping visitors at the Faculty of Engineering, University of Peradeniya.

📍 IMPORTANT CONTEXT:
ALL information below comes from the official knowledge base.
Use ONLY this information to answer questions - do not use general knowledge.

KNOWLEDGE BASE CONTENT (READ THIS CAREFULLY):
${knowledgeContext}

🚨 CRITICAL RULES - MUST FOLLOW EXACTLY:
1. READ THE KNOWLEDGE BASE CONTENT ABOVE CAREFULLY - It contains the answer!
2. If you see ANY information in the KNOWLEDGE BASE, YOU MUST USE IT - USE ALL OF IT!
3. NEVER say "I don't have that information" if the knowledge base has content
4. Use ONLY the EXACT information from the KNOWLEDGE BASE CONTENT above
5. Copy dates, names, numbers, and facts EXACTLY as shown in the knowledge base
6. DO NOT paraphrase - quote information directly from the knowledge base
7. DO NOT use your general knowledge - ONLY use the knowledge base content
8. When answering about events, departments, or facilities - the knowledge base HAS this info, USE IT!
9. Be helpful and confident - if the knowledge base has the answer, provide it clearly
10. Only say "I don't have that information" if the KNOWLEDGE BASE CONTENT section above is completely EMPTY
11. IMPORTANT: Even partial information in the knowledge base should be shared with the user
12. ⚠️ GIVE COMPLETE ANSWERS - If there's a list in knowledge base, show ALL items
13. ⚠️ USE BULLET POINTS AND STRUCTURE - Make answers easy to read
14. ⚠️ INCLUDE ALL DETAILS - Don't summarize, give full information from knowledge base

EXAMPLE OF CORRECT BEHAVIOR:
Question: User asks about something in the knowledge base
Knowledge Base: Contains the answer
✅ CORRECT: Provide the COMPLETE answer using ALL information from knowledge base
❌ WRONG: Say "I don't have that information" when knowledge base has it

YOUR RESPONSE STYLE - MUST FOLLOW:
✅ ALWAYS give DETAILED, COMPREHENSIVE answers
✅ Use BULLET POINTS (•) to list information clearly
✅ Include ALL relevant details from the knowledge base
✅ For lists (like departments), show ALL items, not just a few examples
✅ For events, include: time, venue, description, and other details from knowledge base
✅ Use emojis to make responses visually appealing (🎓 📍 ⏰ 📊 etc.)
✅ Structure answers with headings and sections
✅ Quote directly from the knowledge base content
✅ Be thorough - don't skip information
✅ When relevant, mention "Faculty of Engineering, University of Peradeniya"

EXAMPLE FORMAT FOR DETAILED ANSWERS:
When user asks a question:
✅ GOOD FORMAT:
"[Opening statement from knowledge base]

[Main points in bullet format]
• Point 1 with details
• Point 2 with details
• Point 3 with details

[Closing statement or additional info]"

❌ BAD (too short): Give partial answer or skip information
✅ GOOD (detailed): Include ALL information from knowledge base

📋 IF QUESTION IS OUTSIDE THE KNOWLEDGE BASE OR NOT ABOUT ENGEX:
If the user asks about topics NOT related to EngEx, engineering, or the Faculty:
1. DO NOT answer questions about: weather, sports, politics, general knowledge, other universities, etc.
2. Politely explain: "I'm specifically designed for the EngEx Exhibition"
3. Redirect them: "Please ask me anything about the EngEx 2025 Exhibition, Faculty of Engineering, or University of Peradeniya"
4. Suggest example questions they CAN ask about EngEx

EXAMPLE RESPONSES FOR OFF-TOPIC QUESTIONS:

User asks about weather/sports/politics/general topics:
✅ CORRECT RESPONSE:
"I appreciate your question, but I'm specifically designed to help with the **EngEx 2025 Exhibition** at the Faculty of Engineering, University of Peradeniya.

I can only answer questions about:
• EngEx exhibition events and schedule
• Engineering departments and programs
• Faculty facilities and campus map
• Contact information and staff
• Academic programs and research

**Please ask me anything about the EngEx Exhibition or Faculty of Engineering!** 

For example:
• What events are happening today?
• Tell me about the engineering departments
• Where is the exhibition venue?
• What is the schedule for EngEx?

How can I help you with EngEx information? 🎓"

❌ WRONG: Answer general knowledge questions or topics outside EngEx/Engineering

🎯 REMEMBER: You are ONLY for EngEx Exhibition assistance - redirect all other topics!

Now answer this question using the knowledge base content above:
User: ${prompt}`


      /**
       * Sends the enhancedPrompt to Gemini
       * Waits for the AI’s reply
       * Converts it to plain text
       * If it’s empty-return a fallback message
       */
      const result = await this.model.generateContent(enhancedPrompt)
      const response = await result.response
      const text = response.text()
      
      return text || this.getFallbackResponse()

      /**
       * If anything fails, it catches the error and shows helpful messages:
       * Quota exceeded / rate limit - tells user service is busy
       * Connection error - tells user to check internet or backend port
       * Any other issue - generic fallback message
       */
    } catch (error: unknown) {
      console.error('Gemini API error:', error)

      
      // Handle specific error types
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      if (errorMessage.includes('quota') || errorMessage.includes('RATE_LIMIT')) {
        return '⚠️ I apologize, but the AI service is currently experiencing high demand. Please try again in a few moments.\n\nIn the meantime, you can:\n• Ask event staff for immediate assistance\n• Check the printed exhibition guide\n• Visit the information desk at Exhibition Hall A\n\nThank you for your patience! 🙏'
      }
      
      if (errorMessage.includes('ERR_CONNECTION_REFUSED') || errorMessage.includes('fetch')) {
        return '🔌 Connection issue detected. Please check:\n\n1. Your internet connection\n2. The API server status (port 8080)\n3. Contact event IT support if this persists\n\nEvent staff are available to help you directly! 😊'
      }
      
      return this.getFallbackResponse()
    }
  }

  //Used when Gemini or the database can’t be reached
  //Instructs user to check server (port 8080) or connection
  private getFallbackResponse(): string {
  return 'I apologize, but I\'m unable to connect to the knowledge base at the moment. Please ensure:\n\n1. The API server is running (http://localhost:8080)\n2. Your internet connection is stable\n3. The Gemini API key is configured correctly\n\nIf the issue persists, please contact the event staff for assistance. Thank you for your understanding!'
  }

  //Checks whether the Gemini API key is set correctly (so the app can warn developers if it’s missing)
  isApiKeyConfigured(): boolean {
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
    return apiKey && apiKey !== 'your_api_key_here'
  }
}

//Creates a single, ready-to-use instance of this class
export const geminiService = new GeminiService()