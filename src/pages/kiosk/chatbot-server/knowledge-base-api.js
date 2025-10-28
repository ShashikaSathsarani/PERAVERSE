//This is the backend server for the knowledge base part of the chatbot
//This helps our chatbot talk to the database and find answers

/*
____________________________________________
backend server for the Knowledge Base API, 
built using Node.js + Express + Supabase
____________________________________________
*/


//*****************************************************************************************************
//Imports and setup

//express - Web framework to create API endpoints (e.g., /query, /health); builds the backend (server)
const express = require('express');

//cors - Allows our frontend (React, etc.) to connect safely from another port
const cors = require('cors');

//supabase - Connects to our Supabase database (imported from db.js)
const supabase = require('./db');

//dotenv.config() - Loads environment variables (like ports, keys) from .env file
require('dotenv').config();

//*****************************************************************************************************


//----------------------------------------------------------
/*
Initialize server
Creates an Express app instance; 
Uses the port from .env (like 8080). 
If not found, it defaults to 8080
*/
const app = express(); //Makes a web server using Express
const PORT = process.env.KB_API_PORT || 8080;
//----------------------------------------------------------



//.................................................................................
/*
Middleware
cors() - Enables requests from the frontend (prevents “CORS errors”)
express.json() - Parses incoming JSON requests (like { "query": "something" })
*/
app.use(cors());
app.use(express.json());
//.................................................................................


//_____________________________________________________________________
/**
 * POST /api/knowledge-base/query
 * This is the main endpoint used by our chatbot frontend
 * When the chatbot sends a message, it calls this endpoint
 * Main endpoint used by chatbot - searches knowledge base by query
 */
app.post('/api/knowledge-base/query', async (req, res) => {
//_____________________________________________________________________
    try {
        //Reads the user’s input from the request body
        //If missing, returns a 400 (Bad Request) error
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter is required'
            });
        }

        // Converts the query to lowercase
        //Splits it into words
        //Filters out short words (like “is”, “a”, “of”) to only keep meaningful ones
        //ex: “How to reset password” - ["how", "reset", "password"]
        const keywords = query.toLowerCase()
            .split(' ')
            .filter(word => word.length > 2);

        //_______________________________________________________________________________________
        /*
        Search Supabase table
                    Looks in the knowledge_base table
                    Filters only active items (is_active = true)
                    Uses .or() to match any keyword inside title or content (case-insensitive)
        */

        //ex: If keywords are “reset” and “password”, it checks;
                //title contains “reset” or “password”
                //content contains “reset” or “password”
        const { data, error } = await supabase
            .from('knowledge_base')
            .select('*')
            .eq('is_active', true)
            .or(
                keywords.map(keyword => 
                    `title.ilike.%${keyword}%,content.ilike.%${keyword}%`
                ).join(',')
            );
        //_______________________________________________________________________________________


        //If there’s an error, it goes to the catch block
        //Otherwise, sends back all matching results to the frontend
        if (error) throw error;

        res.json({
            success: true,
            count: data.length,
            data: data
        });

    //If something goes wrong (ex: DB issue), it logs and returns an error message
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


//-------------------------------------------------------------------------
/**
 * GET /health - A simple test to see if the backend is running
 * http://localhost:8080/health
 * Health check endpoint
 */
//Used by frontend or server monitoring tools to check if API is online
//Returns current timestamp and success message
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'EngEx Knowledge Base API is running',
        timestamp: new Date().toISOString()
    });
});
//-------------------------------------------------------------------------


// Start server
//Starts the server at http://localhost:8080
//Prints logs in console confirming everything’s connected and running
app.listen(PORT, '127.0.0.1', () => {
    console.log(`🤖 EngEx Knowledge Base API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`✅ Connected to Supabase database`);
});

//Exports the Express app instance for testing or other use
module.exports = app;

/*
Where this runs: on the server (Node.js)
Main job: talks to the database and gives data to frontend

Steps:
1. Chatbot sends question - backend
2. Backend reads it
3. Backend searches Supabase (database)
4. Finds matching info
5. Sends answer back to chatbot
6. Chatbot shows it to the user
*/

/*
POST /api/knowledge-base/query - does the searching
GET /health - checks if server is okay
*/
