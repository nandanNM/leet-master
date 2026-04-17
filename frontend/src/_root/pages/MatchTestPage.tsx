import React, { useEffect, useState, useRef } from 'react';

const MatchTestPage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);
  
  const [sseMessages, setSseMessages] = useState<string[]>([]);
  const [sseStatus, setSseStatus] = useState('Disconnected');

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_BACKEND_BASE_URL 
      ? import.meta.env.VITE_BACKEND_BASE_URL.replace(/^http/, 'ws') + '/ws'
      : 'ws://localhost:3000/ws';

    // 1. WebSocket chat connection
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WS Connected');
      socket.send(JSON.stringify({ 
        type: 'subscribe', 
        matchId: 'test-match-1', 
        userId: 'test-user-' + Math.floor(Math.random() * 1000) 
      }));
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message_created') {
           setMessages(prev => [...prev, data.data]);
        }
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };

    ws.current = socket;

    // 2. SSE Test connection
    const httpUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';
    const sse = new EventSource(`${httpUrl}/api/v1/metch/sse-test`);
    
    sse.onopen = () => setSseStatus('Connected');
    sse.onmessage = (event) => {
      try {
        const d = JSON.parse(event.data);
        setSseMessages(prev => [...prev, d.message]);
      } catch(e) {}
    };
    sse.onerror = () => setSseStatus('Error or Disconnected');

    return () => {
      socket.close();
      sse.close();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !ws.current) return;
    ws.current.send(JSON.stringify({
      type: 'send_message',
      matchId: 'test-match-1',
      text: input
    }));
    setInput('');
  };

  return (
    <div className="flex w-full h-[calc(100vh-64px)] gap-4 p-4">
      {/* Left Side: Code Editor, Test Cases and SSE feed */}
      <div className="flex flex-1 flex-col gap-4 border border-gray-300 dark:border-gray-700 p-4 rounded-md">
        <div className="flex-[2] border border-gray-400 dark:border-gray-600 p-2 rounded-md">
          <h3 className="font-bold mb-2">Code Editor</h3>
          <textarea 
            className="w-full h-[80%] font-mono p-2 border rounded-md dark:bg-gray-800 dark:text-gray-100" 
            defaultValue={"// Write your code here"}
          />
        </div>
        <div className="flex-1 border border-gray-400 dark:border-gray-600 p-2 rounded-md overflow-y-auto">
          <h3 className="font-bold mb-2">Test Cases</h3>
          <div>Test case 1: ...</div>
          <div>Test case 2: ...</div>
          
          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
            <h3 className="font-bold mb-2">SSE Status: {sseStatus}</h3>
            {sseMessages.map((msg, i) => (
              <div key={i} className="text-sm text-gray-500">{msg}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Live Chat */}
      <div className="flex flex-1 flex-col border border-gray-300 dark:border-gray-700 p-4 rounded-md">
        <h3 className="font-bold mb-2">Live Chat</h3>
        <div className="flex-1 border border-gray-200 dark:border-gray-700 mb-2 p-2 overflow-y-auto flex flex-col gap-2 rounded-md bg-gray-50 dark:bg-gray-900">
          {messages.map((m, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm">
              <strong className="text-blue-500 text-xs">User {m.senderId.slice(0,4)}:</strong> {m.text}
            </div>
          ))}
          {messages.length === 0 && <div className="text-gray-400 text-sm">No messages yet. Say hi!</div>}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-100" 
            placeholder="Type a message..." 
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Send</button>
        </div>
      </div>
    </div>
  );
};

export default MatchTestPage;
