/**
 * This service:
        Connects to the Google Gemini API (Google’s AI model).
        Uses the knowledge base data from your Supabase database.
        Creates a smart AI assistant that:
                  Answers only using official knowledge base information.
                  Greets users politely.
                  Gives detailed, formatted responses
                  Falls back to simple messages if something fails
 */

//Imports Google’s Gemini AI library
//Imports your knowledgeBaseService, which retrieves info from the database
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { knowledgeBaseService } from './knowledgeBaseService'

//genAI - the Gemini AI client
//model - the specific model instance used to generate answers
class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: GenerativeModel | null = null

  //Gets the API key from your environment variables (.env)
  constructor() {
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
    

    /**
     * If a valid API key is found:
          Connects to the Gemini API.
          Selects the “gemini-2.0-flash-exp” model (fast and efficient).
          Configures it to:
                    Be factual (temperature: 0.1)
                    Pick the best answers only (topK: 1, topP: 0.1)
                    Allow long detailed replies (maxOutputTokens: 4096)
     */
    if (apiKey && apiKey !== 'your_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.1,  // very factual, not creative
          topK: 1,           // always pick best answer
          topP: 0.1,         // consistent responses
          maxOutputTokens: 4096,  // detailed, long answers allowedI
        }
      })
    }
  }

  /**
   * Get fallback knowledge when database is unavailable
   * Shows a message when the knowledge base can’t be reached
   */
  private getFallbackKnowledge(): string {
    return `
IMPORTANT: The knowledge base database is temporarily unavailable. Please try again in a moment.
If the issue persists, contact the event staff for assistance.
`
  }

  /**
   * Check if the message is a greeting
   * Checks if the user said a greeting (like “hi”, “hello”).
    Used to respond with a friendly introduction instead of calling Gemini
   */
  private isGreeting(message: string): boolean {
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening',]
    const lowerMessage = message.toLowerCase().trim()
    return greetings.some(greeting => 
      lowerMessage === greeting || 
      lowerMessage.startsWith(greeting + ' ') ||
      lowerMessage.startsWith(greeting + ',')
    )
  }

  /**
   * Get introduction/greeting response about EngEx and the chatbot
   * Returns a warm welcome and explains what the chatbot can do.
      It lists what kind of info is available (departments, events, etc.)
      and gives example questions
   */
  private getIntroductionResponse(): string {
    return `**Hello and Welcome to EngEx 2025!**

I'm your AI-powered assistant for the Faculty of Engineering Exhibition at the University of Peradeniya.

How I Can Help You:

I have access to comprehensive information about:

• Faculty Information - History, departments, facilities, and academic programs
• Exhibition Events - Schedule, timings, venues, and event descriptions
• Departments - All 8 engineering departments and their specializations
• Campus Map - Building locations, zones, and navigation help
• Contact Information - Phone numbers, emails, and office locations
• Staff & Faculty - Department heads, deans, and key contacts
• Academic Programs - Undergraduate and postgraduate programs
• Research & Facilities - Labs, equipment, and research areas

    Try Asking Me:

• "Tell me about the departments"
• "Where is the Dean's office?"
• "What is the exhibition schedule?"
• "Show me the campus map"
• "Contact information for Engineering Mathematics department"

Feel free to ask me anything about the Faculty of Engineering or the EngEx 2025 exhibition!

What would you like to know?`
  }

 /*
  * This is the core of the chatbot logic.
    It handles the user’s question (prompt) and returns a Gemini AI response
  */
  async generateResponse(prompt: string): Promise<string> {
    //If no Gemini model is configured
    if (!this.model) {
      return this.getFallbackResponse()
    }

    //If it’s a greeting
    if (this.isGreeting(prompt)) {
      return this.getIntroductionResponse()
    }

    try {
      // Get database context for this specific query
      const dbContext = await knowledgeBaseService.getContextForAI(prompt)
      
      // Use database context if available
      const knowledgeContext = dbContext || this.getFallbackKnowledge()
      
      // Build enhanced prompt with database knowledge
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
✅ Use NUMBERED LISTS (1., 2., 3.) for main items and BULLET POINTS (•) for sub-items
✅ Include ALL relevant details from the knowledge base
✅ For lists (like departments), show ALL items, not just a few examples
✅ For events, include: time, venue, description, and other details from knowledge base
✅ Use emojis to make responses visually appealing (🎓 📍 ⏰ 📊 etc.)
✅ Structure answers with headings and sections
✅ Quote directly from the knowledge base content
✅ Be thorough - don't skip information
✅ When relevant, mention "Faculty of Engineering, University of Peradeniya"
✅ ADD BLANK LINES between sections for better readability
✅ ADD BLANK LINES between numbered/bullet point groups
✅ Use double line breaks (\\n\\n) to separate different topics
✅ DO NOT use ** for bold - use plain text with clear formatting
✅ Use NUMBERED LISTS for main categories (departments, events, etc.)

FORMATTING RULES - CLEAN TEXT STYLING:
1. Department names → Use numbers: 1. Civil Engineering, 2. Mechanical Engineering
2. Section headings → Use text with emojis: 🎯 Focus Areas:, 📞 Contact:
3. Sub-items → Use bullet points (•) under numbered items
4. No asterisks or bold markers - just clean, structured text
5. Add blank lines between numbered items for spacing
6. IMPORTANT: Remove ALL ** symbols from knowledge base content - they don't render as bold
7. If knowledge base has **text**, show it as plain text without the asterisks

EXAMPLE FORMAT FOR DETAILED ANSWERS:
When user asks a question:
✅ GOOD FORMAT (Clean, No Bold):
"The Faculty of Engineering at University of Peradeniya has 8 Engineering Departments:

1. Civifgfl Engineering
   • Infrastructure and construction projects
   • Sustainable development solutions
   • Structural engineering designs
   • Transportation systems
   • Environmental engineering

2. Mechanical Engineering
   • Robotics and automation
   • Manufacturing innovations
   • Thermodynamics and heat transfer
   • CAD/CAM and design
   • Machine design and mechanics

3. Electrical & Electronic Engineering
   • Power systems and generation
   • Electronics and circuit design
   • Renewable energy solutions
   • Control systems and automation
   • Telecommunications
• **Electronics** and circuit design
• **Renewable energy** solutions"

**Section 2:**
• Point 3 with details
• Point 4 with details

[Closing statement or additional info]"

FORMATTING RULES:
1. Add blank line BEFORE each major section heading
2. Add blank line AFTER section heading before bullet points
3. Group related bullet points together
4. Add blank line between different bullet point groups
5. Use **bold** for section headings (e.g., **Civil Engineering**, **Mechanical Engineering**)

❌ BAD (too short): Give partial answer or skip information
❌ BAD (no spacing): All text bunched together without line breaks
✅ GOOD (detailed): Include ALL information from knowledge base with proper spacing

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

      const result = await this.model.generateContent(enhancedPrompt)
      const response = await result.response
      const text = response.text()
      
      return text || this.getFallbackResponse()
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

  private getFallbackResponse(): string {
  return 'I apologize, but I\'m unable to connect to the knowledge base at the moment. Please ensure:\n\n1. The API server is running (http://localhost:8080)\n2. Your internet connection is stable\n3. The Gemini API key is configured correctly\n\nIf the issue persists, please contact the event staff for assistance. Thank you for your understanding!'
  }

  isApiKeyConfigured(): boolean {
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
    return apiKey && apiKey !== 'your_api_key_here'
  }
}

export const geminiService = new GeminiService()
