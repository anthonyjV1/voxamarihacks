import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

// Initialize Gemini only if API key exists
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)
  : null;

async function extractTextFromFile(filePath: string, originalName: string): Promise<string> {
  try {
    const ext = path.extname(originalName).toLowerCase();
    
    if (ext === '.pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } else if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (ext === '.txt') {
      return await fs.readFile(filePath, 'utf-8');
    }
    
    throw new Error('Unsupported file type');
  } catch (error) {
    console.error('Text extraction failed:', error);
    throw new Error('Failed to extract text from file');
  }
}

async function enhanceCVWithGemini(cvText: string): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini AI not configured');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Enhance the following CV text:\n\n${cvText}\n\n[Your existing prompt here...]`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to enhance CV with AI');
  }
}

export async function POST(request: Request) {
  // Immediately return error if Gemini not configured
  if (!genAI) {
    return NextResponse.json(
      { error: 'Gemini AI service not configured' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Create temp directory if not exists
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    const tempFilePath = path.join(tempDir, file.name);

    try {
      // Write file
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(tempFilePath, fileBuffer);

      // Process file
      const cvText = await extractTextFromFile(tempFilePath, file.name);
      const enhancedCV = await enhanceCVWithGemini(cvText);

      return NextResponse.json({ enhancedCV });
    } finally {
      // Clean up temp file
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        console.error('Temp file cleanup failed:', cleanupError);
      }
    }
  } catch (error) {
    console.error('CV enhancement error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to enhance CV' },
      { status: 500 }
    );
  }
}