import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Configure the SDK securely using the .env variable
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_career_advice(user_message: str) -> str:
    """
    Sends the user's message to the LLM.
    Uses a fallback loop to bypass deprecated or restricted models dynamically.
    """
    try:
        # 1. Fetch all theoretically available models
        available_models = [
            m.name for m in genai.list_models() 
            if 'generateContent' in m.supported_generation_methods
        ]
        
        if not available_models:
            return "Error: No active AI models found for this Google account."
            
        prompt = f"""
        You are an expert AI Career Counselor specifically designed for undergraduate and postgraduate engineering students (B.Tech, M.Tech, etc.).
        Provide actionable, concise, and highly technical career advice. Keep responses under 4 paragraphs.
        
        Student's Query: {user_message}
        """
        
        # 2. The Fallback Loop: Test models until one succeeds
        for target_model in available_models:
            try:
                print(f"Attempting to connect to: {target_model}...")
                model = genai.GenerativeModel(target_model)
                
                # If this succeeds, we break the loop and return the text
                response = model.generate_content(prompt)
                
                print(f"Success! Model {target_model} is operational.")
                return response.text
                
            except Exception as e:
                # If Google blocks it (like the 404 error), catch it and try the next one
                print(f"Skipping {target_model} due to error: {e}")
                continue
        
        # If it loops through everything and fails:
        return "I apologize, but all AI models are currently restricted or unavailable on this API key."
        
    except Exception as e:
        print(f"Critical AI SDK Error: {e}")
        return "I apologize, but my servers are currently analyzing market data. Please try again in a moment."