import dotenv from "dotenv";
import promptSync from "prompt-sync";
import { ChatCompletionMessageParam } from "openai/resources/index";
import OpenAI from "openai";

// =============================================================================
// ENVIRONMENT CONFIGURATION
// =============================================================================

/**
 * Load environment variables from .env file
 * This makes variables like GROQ_API_KEY available via process.env
 */
dotenv.config();

// =============================================================================
// API CONFIGURATION VALIDATION
// =============================================================================

/**
 * Validate that the required Groq API key is available in environment variables
 * This is essential for authenticating with the Groq API service
 * @throws {Error} If GROQ_API_KEY is not defined in environment variables
 */
if (!process.env.GROQ_API_KEY) {
	throw new Error("GROQ_API_KEY is not defined in environment variables");
}

// =============================================================================
// OPENAI CLIENT CONFIGURATION
// =============================================================================

/**
 * OpenAI client instance configured for Groq API
 * Uses Groq's custom endpoint instead of standard OpenAI API
 * This allows access to Groq's specialized language models
 */
export const client = new OpenAI({
	apiKey: process.env.GROQ_API_KEY, // API key for authentication
	baseURL: "https://api.groq.com/openai/v1", // Groq-specific API endpoint
});

// =============================================================================
// CHAT MEMORY MANAGEMENT
// =============================================================================

/**
 * Array storing the conversation history between user and AI assistant
 * Maintains context throughout the chat session using ChatCompletionMessageParam format
 * Starts with a system message defining the assistant's behavior and role
 */
const chatMemory: ChatCompletionMessageParam[] = [
	{
		role: "system",
		content: `You are my personal AI assistant. Your role is to provide clear, accurate, and well-structured responses to my queries. Always explain concepts in a simple way, offer practical examples when needed, and ensure your answers are relevant to my context as a software developer. If code is requested, provide clean, working, and well-commented code. Stay professional, concise, and supportive.`,
	},
];

// =============================================================================
// CHAT COMPLETION FUNCTION
// =============================================================================

/**
 * Sends the current conversation history to the AI model and processes the response
 * Appends the AI's response to the chat memory for context continuity
 * @returns {Promise<void>} No return value, but updates chatMemory and logs response
 */
const chatCompletion = async (): Promise<void> => {
	// Send the entire conversation history to Groq API
	const response = await client.chat.completions.create({
		model: "openai/gpt-oss-20b", // Groq's model variant
		messages: chatMemory, // Entire conversation context
	});

	// Extract the AI's response message from the API response
	const responseMessage = response.choices[0].message;

	// Add the AI's response to the conversation history for future context
	chatMemory.push({
		role: responseMessage.role,
		content: responseMessage.content,
	});

	// Display the AI's response in the console with role information
	console.log(
		`Assistant: ${responseMessage.role}, ${responseMessage.content}`
	);
};

// =============================================================================
// MAIN CHAT LOOP FUNCTION
// =============================================================================

/**
 * Main chat loop that handles user interaction in a continuous conversation
 * Provides a REPL (Read-Eval-Print Loop) interface for chatting with AI
 * Supports exit command to terminate the chat session
 */
const main = async (): Promise<void> => {
	// Initialize prompt-sync for reading user input from command line
	// sigint: true allows users to exit with Ctrl+C
	const input = promptSync({ sigint: true });

	console.log("Chat bot started. Type 'exit' to end the conversation.\n");

	// Continuous chat loop until user exits
	while (true) {
		// Read user input from command line
		const userInput = input("Enter your message : ");

		// Check if user wants to exit the chat
		if (userInput.toLocaleLowerCase() === "exit") {
			console.log("Exiting chat bot...");
			break; // Exit the loop
		}

		// Add user's message to the conversation history
		chatMemory.push({
			role: "user",
			content: userInput,
		});

		// Get AI response and continue the conversation
		await chatCompletion();
	}
};

// =============================================================================
// APPLICATION ENTRY POINT
// =============================================================================

/**
 * Execute the main chat function
 * This is the entry point when the file is run directly
 * Handles any uncaught errors at the application level
 */
main().catch((error) => {
	console.error("Unexpected error in chat bot:", error);
	process.exit(1); // Exit with error code
});
