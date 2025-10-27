import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { knowledgeBaseService } from './knowledgeBaseService'

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: GenerativeModel | null = null

  constructor() {
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
    
    if (apiKey && apiKey !== 'your_api_key_here') {
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
   */
  private getFallbackKnowledge(): string {
    return `
IMPORTANT: The knowledge base database is temporarily unavailable. Please try again in a moment.
If the issue persists, contact the event staff for assistance.
`
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.model) {
      return this.getFallbackResponse()
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

📋 IF QUESTION IS OUTSIDE THE KNOWLEDGE BASE:
If the user asks about topics NOT in the knowledge base:
1. Politely acknowledge their question
2. Explain you can only answer based on the knowledge base
3. Suggest topics you CAN help with based on what's in the knowledge base
4. Offer to help with available information

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

//new file of geminiService.ts