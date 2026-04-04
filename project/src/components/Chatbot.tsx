import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your MHT-CET college admission assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('percentile') || lowerMessage.includes('score')) {
      return 'Your percentile is crucial for admission. Generally:\n• 99%+: Top colleges like VNIT, COEP, VJTI\n• 95-99%: Premium private colleges like PICT, MIT\n• 90-95%: Good government and private colleges\n• 85-90%: Decent options with various branches available';
    }

    if (lowerMessage.includes('fee') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      return 'Government colleges typically charge ₹70,000-85,000/year, while private colleges range from ₹1,50,000-2,00,000/year. Consider government colleges for lower fees with quality education.';
    }

    if (lowerMessage.includes('branch') || lowerMessage.includes('computer') || lowerMessage.includes('mechanical')) {
      return 'Popular branches and their typical cutoffs:\n• Computer Science: Highest cutoffs (95%+)\n• Information Technology: High cutoffs (93%+)\n• Electronics: Moderate-High (90%+)\n• Mechanical: Moderate (88%+)\n• Civil: Lower comparatively (85%+)\n\nChoose based on your interest and career goals!';
    }

    if (lowerMessage.includes('location') || lowerMessage.includes('district') || lowerMessage.includes('city')) {
      return 'Popular locations:\n• Pune: Most colleges, great opportunities\n• Mumbai: Premium colleges, higher living costs\n• Nagpur: VNIT and other good options\n• Consider location for internships, placements, and living expenses.';
    }

    if (lowerMessage.includes('government') || lowerMessage.includes('private')) {
      return 'Government vs Private:\n\nGovernment Colleges:\n• Lower fees\n• Established reputation\n• Higher cutoffs\n• Better ROI\n\nPrivate Colleges:\n• Higher fees\n• Modern infrastructure\n• More seats available\n• Lower cutoffs generally';
    }

    if (lowerMessage.includes('admission') || lowerMessage.includes('process') || lowerMessage.includes('cap')) {
      return 'MHT-CET Admission Process:\n1. Appear for MHT-CET exam\n2. Check your percentile\n3. Register for CAP rounds\n4. Fill preferences (colleges & branches)\n5. Participate in counseling rounds\n6. Accept allotment and complete admission\n\nTip: Fill maximum preferences to increase chances!';
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return 'You\'re welcome! Best of luck with your admissions. Feel free to ask if you have more questions!';
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return 'I can help you with:\n• Understanding percentile requirements\n• Comparing government vs private colleges\n• Information about different branches\n• Fee structure and budget planning\n• Admission process guidance\n• Location-based recommendations\n\nJust ask me anything!';
    }

    return 'I\'m here to help with MHT-CET admissions! You can ask me about:\n• Percentile requirements\n• College comparisons\n• Branch selection\n• Fees and budget\n• Admission process\n• Location preferences\n\nWhat would you like to know?';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Admission Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
