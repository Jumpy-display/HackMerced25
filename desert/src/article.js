import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

const GeminiComponent = () => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Prompt formatted over multiple lines for better readability
  const fixedPrompt = `I Want You To Act As A Content Writer Very Proficient SEO Writer Writes Fluently English. 
  Write a 3500-word 100% Unique, SEO-optimized, Human-Written article in English with at least 15 headings and 
  subheadings (including H1, H2, H3, and H4 headings) that covers the topic provided in the Prompt. 
  Write The article In Your Own Words Rather Than Copying And Pasting From Other Sources. 
  Consider perplexity and burstiness when creating content, ensuring high levels of both without losing specificity or context. 
  Use fully detailed paragraphs that engage the reader. Write In A Conversational Style As Written By A Human 
  (Use An Informal Tone, Utilize Personal Pronouns, Keep It Simple, Engage The Reader, Use The Active Voice, 
  Keep It Brief, Use Rhetorical Questions, and Incorporate Analogies And Metaphors). 
  End with a conclusion paragraph and 5 unique FAQs After The Conclusion. 
  this is important to Bold the Title and all headings of the article, and use appropriate headings for H tags. 
  Now Write An Article On This Topic. How to cope with living in a food desert? 
  Give an answer that starts off talking about how to shop in a food desert. 
  Then lists resources for food banks and pantries in Riverside. 
  Finally give resources for how to start a community garden.`;
  
  useEffect(() => {
    const fetchGeminiOutput = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
        
        if (!apiKey) {
          throw new Error("API key not found in environment variables.");
        }
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(fixedPrompt);
        const responseText = result.response.text();
        
        // Process the output to remove any outline tables if they exist
        const processedOutput = removeOutlineTables(responseText);
        setOutput(processedOutput);
        setError(null);
      } catch (error) {
        console.error("Error fetching Gemini output:", error);
        let errorMessage = "Error fetching output.";
        
        if (error.response) {
          errorMessage = `Error: ${error.response.status} - ${error.message}`;
        }
        
        setError(errorMessage);
        setOutput("");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGeminiOutput();
  }, []);

  // Function to remove outline tables
  const removeOutlineTables = (text) => {
    // This regex looks for markdown tables with "outline" or "table of contents" in them
    const outlineTableRegex = /\|.*outline.*\|[\s\S]*?\n\|[-\s|]*\|[\s\S]*?(?=\n\n|\n#)/gi;
    let processedText = text.replace(outlineTableRegex, '');
    
    // Also remove any specific outline headers
    processedText = processedText.replace(/^#+\s*(?:outline|table of contents).*$/gim, '');
    
    return processedText;
  };

  // Enhanced styling with larger title height
  const customStyles = `
    .article-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background-color: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      color: #333;
      font-family: 'Arial', sans-serif;
    }
    
    .article-content h1 {
      font-size: 42px;
      color: #1a56db;
      border-bottom: 3px solid #1a56db;
      padding-bottom: 18px;
      padding-top: 15px;
      margin-bottom: 30px;
      margin-top: 40px;
      line-height: 1.3;
      min-height: 80px; /* Increased height for the title */
    }
    
    .article-content h1:first-child {
      margin-top: 10px;
    }
    
    .article-content h2 {
      font-size: 28px;
      color: #1e429f;
      margin-top: 35px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ccc;
    }
    
    .article-content h3 {
      font-size: 24px;
      color: #2563eb;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    
    .article-content h4 {
      font-size: 20px;
      color: #3b82f6;
      margin-top: 25px;
      margin-bottom: 12px;
    }
    
    .article-content p {
      font-size: 18px;
      line-height: 1.7;
      margin-bottom: 20px;
      color: #4b5563;
    }
    
    .article-content strong {
      color: #1e429f;
      font-weight: bold;
    }
    
    .article-content ul, .article-content ol {
      margin: 20px 0;
      padding-left: 30px;
    }
    
    .article-content li {
      font-size: 18px;
      margin-bottom: 10px;
      line-height: 1.6;
      color: #4b5563;
    }
    
    .article-content a {
      color: #2563eb;
      text-decoration: underline;
      font-weight: 500;
    }
    
    .article-content a:hover {
      color: #1e40af;
    }
    
    .article-content blockquote {
      background-color: #e9f2fe;
      border-left: 5px solid #3b82f6;
      padding: 15px 20px;
      margin: 25px 0;
      font-style: italic;
      color: #4b5563;
    }
    
    .article-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 16px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .article-content th {
      background-color: #dbeafe;
      color: #1e429f;
      font-weight: bold;
      padding: 12px 15px;
      text-align: left;
      border: 1px solid #bfdbfe;
    }
    
    .article-content td {
      padding: 12px 15px;
      border: 1px solid #dbeafe;
    }
    
    .article-content tr:nth-child(even) {
      background-color: #f1f7fe;
    }
    
    .article-content tr:hover {
      background-color: #dbeafe;
    }
    
    .article-content img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 20px 0;
    }
  `;

  return (
    <div className="bg-gray-100 py-12">
      <style>{customStyles}</style>
      <div className="article-container">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse space-y-8 w-full">
              <div className="h-20 bg-gray-200 rounded w-3/4"></div> {/* Increased height for loading title */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mt-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="article-content">
            <ReactMarkdown>
              {output}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiComponent;