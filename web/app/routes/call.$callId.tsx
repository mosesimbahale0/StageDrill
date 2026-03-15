import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Mic, MicOff, PhoneOff, MessageSquare, Loader2, Volume2, Phone } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FunspotProvider } from './funspots';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const funspotId = params.callId;
  const funspot = FunspotProvider.samples.find(f => f.id === funspotId);
  
  if (!funspot) {
    throw new Response("Not Found", { status: 404 });
  }

  // Get API key from environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment.");
  }

  return json({ funspot, apiKey });
};

interface InterviewMessage {
  text: string;
  isAi: boolean;
  timestamp: number;
}

// Ensure TypeScript knows about web speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function FunspotCallScreen() {
  const { funspot, apiKey } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [status, setStatus] = useState('Initializing...');
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Refs to hold instances that shouldn't trigger re-renders
  const chatSessionRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showHistory]);

  const addMessage = useCallback((text: string, isAi: boolean) => {
    setMessages((prev: InterviewMessage[]) => [...prev, { text, isAi, timestamp: Date.now() }]);
  }, []);

  const speakText = useCallback((text: string) => {
    if (!synthesisRef.current) return;
    
    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Try to find a good voice (standard Google female/male if available)
    const voices = synthesisRef.current.getVoices();
    const preferredVoice = voices.find((v: SpeechSynthesisVoice) => v.name.includes('Google US English') || v.name.includes('Samantha') || v.lang === 'en-US');
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  }, []);

  const handleAiResponse = useCallback(async (text: string) => {
    addMessage(text, true);
    setStatus('Listening...');
    speakText(text);
  }, [addMessage, speakText]);

  // Initialization Effect
  useEffect(() => {
    let isMounted = true;

    // Initialize Web Speech APIs
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          if (isMounted) setIsListening(true);
        };
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript && isMounted) {
            sendVoiceInput(transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (isMounted) setIsListening(false);
        };

        recognitionRef.current.onend = () => {
           if (isMounted) setIsListening(false);
        };
      } else {
        console.warn("Speech Recognition API not supported in this browser.");
      }
    }

    // Initialize Gemini 
    const initGemini = async () => {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Note: Using 1.5-flash for web compatibility as requested, though 3-flash preview could be swapped if accessible.
        const model = genAI.getGenerativeModel({ 
          model: "gemini-3-flash-preview",
          systemInstruction: funspot.practicePrompt
        });

        chatSessionRef.current = model.startChat();
        
        if (isMounted) {
          setIsLoading(true);
          setStatus('Interviewer is joining...');
        }

        const result = await chatSessionRef.current.sendMessage("Start the interview by introducing yourself.");
        const text = result.response.text();
        
        if (isMounted) {
          handleAiResponse(text || "Hello, let's begin.");
          setIsLoading(false);
        }

      } catch (err: any) {
        console.error("Failed to initialize Gemini", err);
        if (isMounted) {
          setStatus(`Error: ${err.message}`);
          setIsLoading(false);
        }
      }
    };

    initGemini();

    // Cleanup
    return () => {
      isMounted = false;
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [apiKey, funspot.practicePrompt, handleAiResponse]);

  const sendVoiceInput = async (text: string) => {
    if (!text.trim() || !chatSessionRef.current) return;
    
    // Stop any AI speech if user interrupts
    if (synthesisRef.current) {
       synthesisRef.current.cancel();
       setIsSpeaking(false);
    }

    addMessage(text, false);
    setIsLoading(true);
    setStatus('Interviewer is thinking...');
    
    try {
      const result = await chatSessionRef.current.sendMessage(text);
      const outputText = result.response.text();
      handleAiResponse(outputText || "I see. Proceed.");
    } catch (err: any) {
      console.error("Gemini Error", err);
      setStatus("Connection lost. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition isn't supported on this browser. Try Chrome or Edge!");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Stop anything speaking and start listening
      synthesisRef.current?.cancel();
      setIsSpeaking(false);
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Handle case where it might already be started
        console.error(e);
      }
    }
  };

  const handleEndCall = () => {
    synthesisRef.current?.cancel();
    recognitionRef.current?.abort();
    navigate('/funspots');
  };

  const clientFunspot = FunspotProvider.samples.find(f => f.id === funspot.id);
  const IconComponent = clientFunspot?.icon as any || Phone;

  return (
    <div className="relative min-h-screen bg-background text-text flex flex-col items-center justify-between font-sans overflow-hidden">
      
      {/* Top Banner / Actions */}
      <div className="w-full flex justify-end p-6 z-20">
        <button 
          onClick={() => setShowHistory(true)}
          className="p-3 bg-primary rounded-full shadow-sm text-accent hover:bg-secondary transition-colors ring-1 ring-black/5 dark:ring-white/5"
          aria-label="Show Transcript"
        >
          <MessageSquare size={24} />
        </button>
      </div>

      {/* Center Identity Info */}
      <div className="flex flex-col items-center z-10 w-full px-4 -mt-10">
        <div className="px-5 py-2.5 bg-accent/10 rounded-2xl mb-6">
          <span className="text-accent font-bold tracking-wide">{funspot.title}</span>
        </div>
        
        <p className="text-text2 text-lg font-medium tracking-wide">
          {status}
        </p>
      </div>

      {/* Main Visualizer */}
      <div className="relative flex items-center justify-center flex-grow -my-10 w-full max-w-md mx-auto z-0">
         {/* Pulse animations */}
         <div className={`absolute inset-0 m-auto w-64 h-64 rounded-full bg-accent/10 transition-transform duration-700 ease-in-out ${isSpeaking || isListening ? 'scale-125 opacity-100' : 'scale-100 opacity-0'}`} />
         <div className={`absolute inset-0 m-auto w-80 h-80 rounded-full bg-accent/5 transition-transform duration-1000 ease-in-out ${isSpeaking || isListening ? 'scale-125 opacity-100 animate-pulse' : 'scale-100 opacity-0'}`} />
         
         {/* Core Avatar */}
         <div className={`relative z-10 w-40 h-40 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300 ${isListening ? 'bg-accent border-accent/50 scale-105' : 'bg-primary border-tertiary scale-100'}`}>
            {isSpeaking ? (
              <Volume2 size={64} className="text-accent animate-pulse" />
            ) : isListening ? (
              <Mic size={64} className="text-white animate-pulse" />
            ) : (
              <IconComponent size={64} className="text-text3" />
            )}
         </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full pb-12 px-6 flex justify-center gap-8 z-20">
         <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-danger flex items-center justify-center text-white shadow-lg hover:bg-danger2 transition-all hover:scale-105 focus:ring-4 focus:ring-danger/30"
            aria-label="End call"
         >
           <PhoneOff size={28} />
         </button>

         <div className="relative">
            {isLoading && (
              <div className="absolute -inset-2 rounded-full border-t-2 border-r-2 border-accent animate-spin" />
            )}
            <button
               onClick={toggleListening}
               disabled={isLoading}
               className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 focus:ring-4 focus:ring-accent/30 ${
                 isListening ? 'bg-accent text-white' : 'bg-primary text-text shadow-md ring-1 ring-black/5 dark:ring-white/5 disabled:opacity-50'
               }`}
               aria-label={isListening ? "Stop listening" : "Start speaking"}
            >
              {isListening ? <Mic size={32} /> : <MicOff size={32} className="text-text3" />}
            </button>
         </div>
      </div>

      {/* Transcript Overlay (Modal) */}
      {showHistory && (
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-primary shadow-[0_-8px_30px_rgb(0,0,0,0.12)] rounded-t-3xl z-50 flex flex-col border-t border-tertiary">
          <div className="flex items-center justify-between p-6 border-b border-tertiary">
            <h2 className="text-xl font-bold text-text">Call Transcript</h2>
            <button 
              onClick={() => setShowHistory(false)}
              className="text-text3 hover:text-text p-2 rounded-lg hover:bg-secondary font-medium"
            >
              Close
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
               <p className="text-center text-text3 py-10">No transcript available yet. Please wait for the interviewer to connect.</p>
            ) : (
              messages.map((msg: InterviewMessage, idx: number) => (
                <div key={idx} className={`flex w-full ${msg.isAi ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl ${
                    msg.isAi 
                      ? 'bg-secondary text-text2 rounded-bl-sm ring-1 ring-black/5 dark:ring-white/5' 
                      : 'bg-accent text-buttontext rounded-br-sm shadow-sm'
                  }`}>
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            {/* Scroll anchor */}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}
      
      {/* Backdrop for Transcript Overlay */}
      {showHistory && (
         <div 
           className="absolute inset-0 bg-black/20 dark:bg-black/60 z-40 backdrop-blur-sm"
           onClick={() => setShowHistory(false)}
         />
      )}

    </div>
  );
}
