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
          maxOutputTokens: 2048,
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
      const enhancedPrompt = `You are Gemini, a helpful AI assistant at EngEx 2025 (Engineering Exhibition).

📍 CONTEXT - IMPORTANT:
This exhibition is at the FACULTY OF ENGINEERING, UNIVERSITY OF PERADENIYA, SRI LANKA.
ALL information in the knowledge base below is about this Faculty of Engineering.

KNOWLEDGE BASE CONTENT (READ THIS CAREFULLY):
${knowledgeContext}

🚨 CRITICAL RULES - MUST FOLLOW EXACTLY:
1. ALWAYS answer the same question the SAME way - BE CONSISTENT
2. If the KNOWLEDGE BASE has information, YOU MUST use it - NEVER say you don't have it
3. Use ONLY the EXACT information from the KNOWLEDGE BASE CONTENT above
4. DO NOT add, change, or modify any names, numbers, or facts
5. DO NOT use your general knowledge or make assumptions
6. THE FACULTY HAS 8 DEPARTMENTS - When asked about departments, ALWAYS list:
   • Civil Engineering
   • Mechanical Engineering
   • Electrical & Electronic Engineering
   • Computer Engineering
   • Chemical & Process Engineering
   • Materials Engineering
   • Engineering Mathematics
7. 🚫 FORBIDDEN - NEVER SAY THESE PHRASES:
   ❌ "I don't have the specific department names"
   ❌ "I don't have specific names"
   ❌ "I cannot provide the exact names"
   ❌ ANY variation of "I don't know the departments"
8. If the knowledge base contains dates/years, use those EXACT values
9. Copy information word-for-word from the knowledge base
10. Only say "I don't have that information" if the knowledge base is truly EMPTY or doesn't answer the question
11. When mentioning departments, buildings, or locations, remember they are all part of the Faculty of Engineering, University of Peradeniya

EXAMPLE OF CORRECT BEHAVIOR:
Question: "What are the departments?"
Knowledge Base: "8 departments: Civil, Mechanical, Electrical, Computer, Chemical, Production, Materials, Mathematics"
✅ CORRECT: "The Faculty of Engineering at University of Peradeniya has 8 departments: Civil, Mechanical, Electrical & Electronic, Computer, Chemical & Process, Production, Materials, and Engineering Mathematics."
❌ WRONG: Say "I don't have specific department names" (when you clearly do!)

YOUR RESPONSE STYLE:
- Keep responses concise but complete (2-4 sentences)
- Use natural, conversational language
- Be warm, friendly, and helpful
- Quote directly from the knowledge base content
- Be consistent - same question = same answer
- When relevant, mention "Faculty of Engineering" or "University of Peradeniya" to provide context

📋 IF QUESTION IS OUTSIDE THE KNOWLEDGE BASE:
If the user asks about topics NOT in the knowledge base (weather, personal questions, unrelated topics):
1. Politely acknowledge their question
2. Redirect them back to EngEx exhibition topics
3. Suggest asking about: departments, events, facilities, exhibition schedule, competitions, workshops
4. Example: "I'm here to help with information about EngEx 2025 exhibition at the Faculty of Engineering, University of Peradeniya! I can answer questions about our departments, events, facilities, and more. What would you like to know about the exhibition?"

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
        return '🔌 Connection issue detected. Please check:\n\n1. Your internet connection\n2. The API server status (port 3004)\n3. Contact event IT support if this persists\n\nEvent staff are available to help you directly! 😊'
      }
      
      return this.getFallbackResponse()
    }
  }

  private getFallbackResponse(): string {
    return 'I apologize, but I\'m unable to connect to the knowledge base at the moment. Please ensure:\n\n1. The API server is running (http://localhost:3004)\n2. Your internet connection is stable\n3. The Gemini API key is configured correctly\n\nIf the issue persists, please contact the event staff for assistance. Thank you for your understanding!'
  }

  isApiKeyConfigured(): boolean {
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
    return apiKey && apiKey !== 'your_api_key_here'
  }
}

export const geminiService = new GeminiService()