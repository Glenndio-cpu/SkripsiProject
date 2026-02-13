import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const TestGemini = () => {
  const [apiKey, setApiKey] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    setApiKey(key || 'NOT FOUND');
    
    console.log("=== ENV CHECK ===");
    console.log("API Key:", key);
    console.log("API Key exists:", !!key);
    console.log("API Key length:", key?.length);
  }, []);

  const testAPI = async () => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!key) {
        setTestResult(' ERROR: API Key tidak ditemukan di environment variables!\n\nPastikan:\n1. File .env ada di root\n2. Berisi: VITE_GEMINI_API_KEY=your_key\n3. Server sudah di-restart\n4. Browser sudah di-refresh');
        return;
      }

      console.log("Testing with API key:", key.substring(0, 15) + "...");
      
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      const result = await model.generateContent("Halo, apa itu diare?");
      const response = await result.response;
      const text = response.text();
      
      setTestResult(` SUCCESS!\n\nGemini Response:\n${text}`);
      console.log("Test successful:", text);
      
    } catch (error: any) {
      console.error("Test failed:", error);
      setTestResult(` ERROR:\n\n${error.message}\n\nFull error:\n${JSON.stringify(error, null, 2)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1> Gemini API Test Page</h1>
      
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Environment Variables Check:</h3>
        <p><strong>VITE_GEMINI_API_KEY:</strong></p>
        <div style={{ background: apiKey === 'NOT FOUND' ? '#ffebee' : '#e8f5e9', padding: '10px', borderRadius: '4px', wordBreak: 'break-all' }}>
          {apiKey === 'NOT FOUND' ? (
            <span style={{ color: 'red' }}> NOT FOUND</span>
          ) : (
            <span style={{ color: 'green' }}> {apiKey.substring(0, 20)}...{apiKey.substring(apiKey.length - 5)}</span>
          )}
        </div>
      </div>

      <button 
        onClick={testAPI}
        disabled={isLoading || apiKey === 'NOT FOUND'}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          background: isLoading ? '#ccc' : '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading || apiKey === 'NOT FOUND' ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {isLoading ? 'Testing...' : 'Test Gemini API'}
      </button>

      {testResult && (
        <div style={{ 
          background: testResult.includes('SUCCESS') ? '#e8f5e9' : '#ffebee', 
          padding: '15px', 
          borderRadius: '8px',
          whiteSpace: 'pre-wrap',
          border: `2px solid ${testResult.includes('SUCCESS') ? '#4caf50' : '#f44336'}`
        }}>
          <h3>Test Result:</h3>
          {testResult}
        </div>
      )}

      <div style={{ marginTop: '30px', background: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
        <h3> Troubleshooting:</h3>
        <ol>
          <li>Pastikan file <code>.env</code> ada di root project (sejajar dengan package.json)</li>
          <li>Isi file .env:
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
              VITE_GEMINI_API_KEY=AIzaSyDqyJS7p-j4kmkWeDwx9zaya7P0Or4McoY
            </pre>
          </li>
          <li>Restart server: <code>Ctrl+C</code> lalu <code>npm run dev</code></li>
          <li>Hard refresh browser: <code>Ctrl+Shift+R</code></li>
          <li>Buka Console (F12) untuk melihat log detail</li>
        </ol>
      </div>
    </div>
  );
};

export default TestGemini;
