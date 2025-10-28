/*
This is  a service class that connects the chatbot (frontend) 
to the knowledge base backend API (running on port 8080)
 Instead of keeping data inside files, this fetches answers from the database through that API
*/

// Service to fetch knowledge from database instead of markdown file


//the main backend endpoint for knowledge queries
const KB_API_URL = 'http://localhost:8080/api/knowledge-base'; 

// the base URL (used for health check and saving chats)
const API_HOST = KB_API_URL.replace('/api/knowledge-base', '');

//__________________________________________________________________________________________________
//These define what data looks like

interface KnowledgeBaseItem { //one record from the knowledge base (title, content, etc.)
  id: number;
  category: string;
  subcategory: string;
  title: string;
  content: string;
  keywords: string[];
  priority: number;
}

interface QueryResponse { //what comes back from the backend when chatbot searches
  success: boolean;
  count: number;
  data: KnowledgeBaseItem[];
  query?: string;
}
//__________________________________________________________________________________________________


//This class has all the functions the chatbot uses to talk with the backend
class KnowledgeBaseService {
  private sessionId: string;

  constructor() {
    // Generate unique session ID for tracking conversations
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }



  //_____________________________________________________________________________________________________
  /**
   * This sends the user’s message to the backend (at /api/knowledge-base/query)
   * The backend searches the Supabase knowledge_base table for matches
   * Then it returns related content (titles + answers)
   * The function combines all that into a readable format for the chatbot
   */
  async queryKnowledge(userMessage: string): Promise<string> {
    try {
      const response = await fetch(`${KB_API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
      });

      const result: QueryResponse = await response.json();

      if (result.success && result.data.length > 0) {
        // Combine relevant content
        return result.data.map(item => {
          return `**${item.title}**\n${item.content}`;
        }).join('\n\n---\n\n');
      }

      return '';
    } catch (error) {
      console.error('Error querying knowledge base:', error);
      return '';
    }
  }

  //_____________________________________________________________________________________________________
  /**
   * Search by category
   * Gets all knowledge base items from one category (like “Events”, “Facilities”)
   */
  async getByCategory(category: string): Promise<KnowledgeBaseItem[]> {
    try {
      const response = await fetch(`${KB_API_URL}/category/${category}`);
      const result: QueryResponse = await response.json();
      
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching category:', error);
      return [];
    }
  }

  //_____________________________________________________________________________________________________
  /**
   * Search with keywords
   * Similar to queryKnowledge(), but also allows filtering by category
   */
  async search(query: string, category?: string): Promise<KnowledgeBaseItem[]> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (category) params.append('category', category);

      const response = await fetch(`${KB_API_URL}/search?${params.toString()}`);
      const result: QueryResponse = await response.json();
      
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      return [];
    }
  }

  //_____________________________________________________________________________________________________
  /**
   * Get all knowledge organized by category
   * Fetches everything in the database, organized by category
   * Used if chatbot needs a full list of data
   */
  async getAllKnowledge(): Promise<Record<string, KnowledgeBaseItem[]>> {
    try {
      const response = await fetch(`${KB_API_URL}/all`);
      const result = await response.json();
      
      return result.success ? result.data : {};
    } catch (error) {
      console.error('Error fetching all knowledge:', error);
      return {};
    }
  }

  //_____________________________________________________________________________________________________
  /**
   * Save conversation to database for analytics
   * Saves the chat between user and bot into the database (via /api/conversations/save)
   * This helps us to analyze how people used the chatbot later
   */
  async saveConversation(
    userMessage: string, 
    botResponse: string, 
    kbItemsUsed: number[] = []
  ): Promise<void> {
    try {
      await fetch(`${API_HOST}/api/conversations/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: this.sessionId,
          user_message: userMessage,
          bot_response: botResponse,
          kb_items_used: kbItemsUsed,
        }),
      });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  //_____________________________________________________________________________________________________
  /**
   * Get context for AI prompt based on user query
   * Gets relevant knowledge from the backend
   * Then builds a text summary that helps the AI answer more accurately
   */
  async getContextForAI(userMessage: string): Promise<string> {
    const knowledge = await this.queryKnowledge(userMessage);
    
    if (!knowledge) {
      return '';
    }

    return `
RELEVANT INFORMATION FROM KNOWLEDGE BASE:

${knowledge}

Use the above information to provide an accurate and helpful response.
`;
  }

  //_____________________________________________________________________________________________________
  /**
   * Check if API is available
   * Calls the /health endpoint to check if the backend is alive
   * Returns true if backend works, otherwise false
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${API_HOST}/health`, {
        method: 'GET',
      });
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Knowledge Base API not available:', error);
      return false;
    }
  }
}
//_____________________________________________________________________________________________________

// Export singleton instance
//Creates one reusable instance for the chatbot to use everywhere
export const knowledgeBaseService = new KnowledgeBaseService();
export default knowledgeBaseService;

/*
Where this runs: in the browser (inside the chatbot app)
Main job: talks to the backend API and displays results to the user

    Sends the user’s message to the backend API
    Receives the results (answers) and shows them in the chatbot
    Checks if the backend is running (/health)
    Saves chat history (user question + bot reply)
    Can also get data by category or all knowledge
*/
