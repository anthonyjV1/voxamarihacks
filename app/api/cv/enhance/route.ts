import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mammoth from 'mammoth';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    // Check API key presence
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }
    
    // Get form data from request
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
      
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Get file content PROPERLY based on type
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    let fileContent: string;
    
    if (fileExtension === 'docx' || fileExtension === 'doc') {
      // Handle Word documents properly
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      fileContent = result.value;
    } else {
      // Fallback for other file types
      fileContent = await file.text();
    }
      
    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
    // Your original prompt (unchanged)
    const prompt = `
      You are a professional CV editor. Your task is to ENHANCE an existing CV without changing its core content or structure.

      The CV is in ${fileExtension} format. I will provide it below.

      CRITICAL RULES YOU MUST FOLLOW:
      1. PRESERVE all sections and their ordering from the original CV
      2. PRESERVE all job positions, company names, dates, education details exactly as they appear
      3. PRESERVE all skills, certificates, and qualifications mentioned
      4. DO NOT add any new jobs, positions, qualifications, or skills that aren't in the original
      5. DO NOT remove any information from the original CV
      6. DO NOT invent accomplishments or metrics
      
      WHAT YOU SHOULD IMPROVE:
      1. Rephrase bullet points to use stronger action verbs (but maintain the same achievements)
      2. Fix grammar, spelling, and punctuation errors
      3. Standardize formatting and tense usage
      4. Improve readability with better HTML formatting (but don't change content)
      5. Use industry-standard terminology where appropriate (without adding new skills)
      
      APPROACH:
      - First, analyze the structure of the original CV
      - Then, enhance ONLY the wording and formatting, section by section
      - Maintain the exact same information and facts
      - Output the enhanced version in clean HTML format with professional styling
      
      ORIGINAL CV CONTENT:
      ${fileContent}
      
      Remember: The goal is to make the CV more professional and impactful WITHOUT changing any facts or adding fictional content.
    `;
    
    // Generate enhanced CV with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedCV = response.text();
      
    // Return the enhanced CV
    return NextResponse.json({
      enhancedCV,
      success: true
    });
      
  } catch (error) {
    console.error('CV enhancement error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to enhance CV' },
      { status: 500 }
    );
  }
}