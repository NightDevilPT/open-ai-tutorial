import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";

// Load environment variables from .env file
// This makes variables like GROQ_API_KEY available via process.env
dotenv.config();

// =============================================================================
// CONFIGURATION VALIDATION
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
// FILE UTILITY FUNCTIONS
// =============================================================================

/**
 * Saves API response data to a JSON file in the data directory
 * Creates the data directory if it doesn't exist
 *
 * @param data - The response data to be saved (typically API response object)
 * @param filename - Optional custom filename (default: "response.json")
 * @returns {Promise<string>} Path to the saved file
 * @throws {Error} If file writing fails
 */
async function saveResponseToFile(
	data: any,
	filename: string = "response.json"
): Promise<string> {
	try {
		// Create data directory in current working directory if it doesn't exist
		// recursive: true ensures parent directories are also created if needed
		const dataDir = path.join(process.cwd(), "data");
		await fs.mkdir(dataDir, { recursive: true });

		// Create full file path by combining directory and filename
		const filePath = path.join(dataDir, filename);

		// Write JSON data to file with proper formatting (2-space indentation)
		await fs.writeFile(filePath, JSON.stringify(data, null, 2));

		console.log(`Response saved to: ${filePath}`);
		return filePath;
	} catch (error) {
		console.error("Error saving file:", error);
		throw error; // Re-throw to allow caller to handle the error
	}
}

// =============================================================================
// MAIN EXECUTION FUNCTION
// =============================================================================

/**
 * Main function that demonstrates Groq API usage with chat completions
 * Sends a conversation to the AI model and saves the response to a file
 * Includes example conversation about the Target Sum coding problem
 */
async function main() {
	try {
		// Send chat completion request to Groq API
		const response = await client.chat.completions.create({
			model: "openai/gpt-oss-20b", // Groq's model variant
			messages: [
				{
					role: "system",
					content: "You are a helpful coding assistant.",
				},
				{
					role: "user",
					content: "Hello, how are you?",
				},
				{
					role: "assistant",
					content: "I'm good! How can I help you today?",
				},
				{
					role: "user",
					content:
						"Kindly provide me with the JavaScript code solution for the Target Sum problem",
				},
			],
		});

		// Save the complete API response to a JSON file for later analysis
		// Use timestamp in filename to avoid overwriting previous responses
		const filename = `response_${Date.now()}.json`;
		const filePath = await saveResponseToFile(response, filename);

		// Display the AI's response content in the console
		console.log("AI Response:", response.choices[0]?.message?.content);
		console.log(`Full response saved to: ${filePath}`);
	} catch (error) {
		// Handle any errors that occur during API call or file operations
		console.error("Error in main function:", error);
	}
}

// =============================================================================
// EXECUTION ENTRY POINT
// =============================================================================

/**
 * Execute the main function
 * This is the entry point when the file is run directly
 */
main().catch((error) => {
	console.error("Unhandled error in execution:", error);
	process.exit(1); // Exit with error code
});
