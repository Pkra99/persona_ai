import { useEffect, useMemo, useRef, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const PRESETS = [
  { id: 'Hitesh_Choudhary', label: 'Hitesh Choudhary' },
  { id: 'Piyush_Garg', label: 'Piyush Garg' },
];

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8080/api/chat' : '/api/chat'

function getStorageKeyForPersona(id) {
  return `personaChatMessages_${id}`;
}

function MessageBubble({ role, content, isDark }) {
  const isUser = role === 'user';
  
  const bubbleStyle = isUser
    ? { backgroundColor: '#2563eb', color: 'white' }
    : {
        backgroundColor: isDark ? '#374151' : '#e5e7eb',
        color: isDark ? '#e5e7eb' : '#1f2937'
      };
  
  return (
    <div
      className={`max-w-[85%] w-fit p-3 rounded-2xl ${
        isUser
          ? 'self-end rounded-br-lg'
          : 'self-start rounded-bl-lg'
      }`}
      style={bubbleStyle}
    >
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function TypingIndicator({ isDark }) {
  const indicatorStyle = {
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
    color: isDark ? '#e5e7eb' : '#1f2937'
  };
  
  return (
    <div 
      className="self-start flex items-center gap-2 p-3 rounded-2xl rounded-bl-lg"
      style={indicatorStyle}
    >
      <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
    </div>
  );
}

export default function App() {
  const [personaId, setPersonaId] = useState(localStorage.getItem('personaId') || PRESETS[0].id);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Always start with light mode
  
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem(getStorageKeyForPersona(personaId));
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch {
      return [];
    }
  });

  const selectedLabel = useMemo(() => {
    const found = PRESETS.find(p => p.id === personaId);
    return found?.label || 'Famous Public Figure';
  }, [personaId]);

  const context = useMemo(() => messages.slice(-10), [messages]);
  const listRef = useRef(null);

  // Dynamic styles based on dark mode
  const appStyle = {
    backgroundColor: darkMode ? '#111827' : '#f9fafb',
    color: darkMode ? '#f3f4f6' : '#111827',
    minHeight: '100vh'
  };

  const headerStyle = {
    backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: darkMode ? '#374151' : '#e5e7eb'
  };

  const chatContainerStyle = {
    backgroundColor: darkMode ? '#1f2937' : 'white',
    borderColor: darkMode ? '#374151' : '#e5e7eb'
  };

  const inputContainerStyle = {
    backgroundColor: darkMode ? '#1f2937' : 'white',
    borderColor: darkMode ? '#374151' : '#e5e7eb'
  };

  const textareaStyle = {
    backgroundColor: darkMode ? '#374151' : '#f9fafb',
    color: darkMode ? '#f3f4f6' : '#111827',
    borderColor: darkMode ? '#4b5563' : '#d1d5db'
  };

  const selectStyle = {
    backgroundColor: darkMode ? '#374151' : 'white',
    color: darkMode ? '#e5e7eb' : '#111827',
    borderColor: darkMode ? '#4b5563' : '#d1d5db'
  };

  const buttonStyle = {
    backgroundColor: darkMode ? 'transparent' : 'transparent',
    color: darkMode ? '#e5e7eb' : '#111827',
    borderColor: darkMode ? '#4b5563' : '#d1d5db'
  };

  const clearAllButtonStyle = {
    backgroundColor: darkMode ? 'transparent' : 'transparent',
    color: darkMode ? '#f87171' : '#dc2626',
    borderColor: darkMode ? '#7f1d1d' : '#fca5a5'
  };

  useEffect(() => {
    localStorage.setItem('personaId', personaId);
    try {
      const savedMessages = localStorage.getItem(getStorageKeyForPersona(personaId));
      setMessages(savedMessages ? JSON.parse(savedMessages) : []);
    } catch {
      setMessages([]);
    }
  }, [personaId]);

  useEffect(() => {
    localStorage.setItem(getStorageKeyForPersona(personaId), JSON.stringify(messages));
  }, [messages, personaId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const prompt = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId, personaName: '', userMessage: prompt, context }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'LLM error');
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  }

  function clearChat() {
    setMessages([]);
    localStorage.removeItem(getStorageKeyForPersona(personaId));
  }

  function clearAllChats() {
    PRESETS.forEach(p => {
      localStorage.removeItem(getStorageKeyForPersona(p.id));
    });
    setMessages([]);
  }

  function toggleDarkMode() {
    console.log('Toggling dark mode from', darkMode, 'to', !darkMode);
    setDarkMode(prev => !prev);
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={appStyle}>
      <header className="sticky top-0 z-10 backdrop-blur border-b" style={headerStyle}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-xl font-semibold">Persona AI</span>
          <div className="ml-auto flex items-center gap-2 flex-wrap justify-end">
            <select
              className="rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-56"
              style={selectStyle}
              value={personaId}
              onChange={(e) => setPersonaId(e.target.value)}
            >
              {PRESETS.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <button
              onClick={toggleDarkMode}
              className="rounded-xl border px-3 py-2 text-sm flex items-center justify-center gap-2 hover:opacity-75 active:scale-[.99] transition-all w-12 h-10 relative"
              style={buttonStyle}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              <SunIcon 
                className={`w-5 h-5 absolute transition-all duration-300 ${
                  darkMode 
                    ? 'opacity-0 rotate-180 scale-50' 
                    : 'opacity-100 rotate-0 scale-100'
                }`} 
              />
              <MoonIcon 
                className={`w-5 h-5 absolute transition-all duration-300 ${
                  darkMode 
                    ? 'opacity-100 rotate-0 scale-100' 
                    : 'opacity-0 -rotate-180 scale-50'
                }`} 
              />
            </button>
            <button
              onClick={clearChat}
              className="rounded-xl border px-3 py-2 text-sm hover:opacity-75 active:scale-[.99] transition-all"
              style={buttonStyle}
            >
              Clear Current
            </button>
            <button
              onClick={clearAllChats}
              className="rounded-xl border px-3 py-2 text-sm hover:opacity-75 active:scale-[.99] transition-all"
              style={clearAllButtonStyle}
            >
              Clear All
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto px-4 py-6 flex flex-col flex-grow">
        <div className="text-sm mb-4" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
          Talking as: <span className="font-medium" style={{ color: darkMode ? '#e5e7eb' : '#1f2937' }}>{selectedLabel}</span>
        </div>

        <div 
          ref={listRef} 
          className="flex-grow overflow-y-auto rounded-2xl border p-4 flex flex-col gap-4 mb-4"
          style={chatContainerStyle}
        >
          {messages.length === 0 && (
            <div className="text-sm italic m-auto text-center" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
              Try: "Explain webhook like {selectedLabel}" or "How would {selectedLabel} plan a startup pivot?"
            </div>
          )}
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} isDark={darkMode} />
          ))}
          {loading && <TypingIndicator isDark={darkMode} />}
        </div>

        <div className="rounded-2xl border p-2" style={inputContainerStyle}>
          <textarea
            className="w-full resize-none outline-none p-3 rounded-xl border focus:border-blue-500 transition-colors"
            style={textareaStyle}
            rows={3}
            placeholder="Type your message… (Ctrl/⌘ + Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="px-5 py-2 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 active:scale-[.99] transition-all disabled:bg-blue-200 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}