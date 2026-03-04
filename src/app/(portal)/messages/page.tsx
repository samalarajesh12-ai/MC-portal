'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Calendar, 
  Pill, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import { format } from 'date-fns';
import { clinicalAssistant, type ClinicalAssistantInput } from '@/ai/flows/clinical-assistant-flow';

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
  time: string;
};

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<'assistant' | string>('assistant');
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Assistant State
  const [assistantMessages, setAssistantMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: 'Hello! I am your Maruthi Clinical Assistant. How can I help you manage your health today?',
      time: format(new Date(), 'h:mm a')
    }
  ]);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([
    'View My Appointments',
    'Request Refill',
    'Clinical Hours',
    'I have a doubt'
  ]);

  useEffect(() => {
    const storedUser = getStorageItem('currentUser', null);
    const storedMessages = getStorageItem<any[]>('messages', []);
    setUser(storedUser);
    setMessages(storedMessages);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [assistantMessages, isTyping]);

  const handleSendMessage = async (content?: string) => {
    const text = content || inputValue;
    if (!text.trim()) return;

    if (activeTab === 'assistant') {
      const newUserMsg: ChatMessage = {
        role: 'user',
        content: text,
        time: format(new Date(), 'h:mm a')
      };

      setAssistantMessages(prev => [...prev, newUserMsg]);
      setInputValue('');
      setIsTyping(true);

      try {
        const appointments = getStorageItem<any[]>('appointments', []);
        const context = {
          firstName: user?.firstName,
          upcomingAppointments: appointments.slice(0, 3)
        };

        const response = await clinicalAssistant({
          history: assistantMessages.map(m => ({ role: m.role, content: m.content })),
          userMessage: text,
          patientContext: context
        });

        const botReply: ChatMessage = {
          role: 'model',
          content: response.reply,
          time: format(new Date(), 'h:mm a')
        };

        setAssistantMessages(prev => [...prev, botReply]);
        setSuggestedActions(response.suggestedActions || []);
      } catch (error) {
        console.error('Bot Error:', error);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Logic for regular clinician messages (mock)
      setInputValue('');
    }
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const activeChatData = messages.find(m => m.id === activeTab);

  return (
    <div className="h-[calc(100vh-10rem)] w-full">
      <div className="grid h-full md:grid-cols-[300px_1fr] border rounded-xl overflow-hidden shadow-sm bg-card">
        {/* Sidebar */}
        <div className="flex flex-col border-r bg-muted/10">
          <div className="p-4 border-b bg-card">
            <h2 className="text-lg font-bold font-headline">Clinical Inbox</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1 p-2">
              {/* Bot Option */}
              <button
                onClick={() => setActiveTab('assistant')}
                className={cn(
                  'flex items-center gap-3 rounded-lg p-3 text-left transition-all hover:bg-accent group',
                  activeTab === 'assistant' ? 'bg-primary/10 border-primary/20 border shadow-sm' : 'border border-transparent'
                )}
              >
                <div className="relative">
                  <div className="bg-primary/20 p-2 rounded-full text-primary">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-primary">Clinical Assistant</span>
                    <Badge variant="outline" className="text-[10px] py-0 bg-primary/5 text-primary">AI</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate italic">Ready to help with your health...</p>
                </div>
              </button>

              <div className="px-2 py-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Clinician History</span>
              </div>

              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setActiveTab(msg.id)}
                  className={cn(
                    'flex flex-col items-start gap-1 rounded-lg p-3 text-left text-sm transition-all hover:bg-accent border border-transparent',
                    activeTab === msg.id && 'bg-accent border-accent-foreground/10'
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-bold">{msg.sender}</span>
                    <span className="text-[10px] text-muted-foreground">{msg.date}</span>
                  </div>
                  <div className="text-xs font-semibold text-primary/80 truncate w-full">{msg.subject}</div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{msg.body}</p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col bg-card relative">
          {activeTab === 'assistant' ? (
            <>
              {/* Assistant Header */}
              <div className="p-4 border-b flex items-center justify-between bg-card/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Maruthi AI Assistant</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">System Online</span>
                    </div>
                  </div>
                </div>
                <Sparkles className="h-4 w-4 text-primary opacity-40" />
              </div>

              {/* Assistant Conversation */}
              <ScrollArea className="flex-1 px-4 py-6">
                <div className="space-y-6 max-w-3xl mx-auto">
                  {assistantMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex flex-col gap-2',
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      )}
                    >
                      <div className="flex items-end gap-2">
                        {msg.role === 'model' && (
                          <Avatar className="h-8 w-8 border border-primary/20 shadow-sm">
                            <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'rounded-2xl p-3 text-sm shadow-sm',
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-muted/50 border border-primary/5 rounded-tl-none'
                          )}
                        >
                          {msg.content}
                          <div className={cn("text-[9px] mt-1.5 opacity-60", msg.role === 'user' ? 'text-right' : 'text-left')}>
                            {msg.time}
                          </div>
                        </div>
                        {msg.role === 'user' && (
                          <Avatar className="h-8 w-8 border shadow-sm">
                            <AvatarImage src={user?.faceImage} />
                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-muted-foreground italic text-xs animate-pulse">
                      <Bot className="h-3 w-3" /> Assistant is thinking...
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Suggested Actions (The "Selecting Option First" feature) */}
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2 max-w-3xl mx-auto justify-center">
                   {suggestedActions.map((action) => (
                     <Button 
                       key={action} 
                       variant="outline" 
                       size="sm" 
                       className="rounded-full text-[11px] h-7 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                       onClick={() => handleQuickAction(action)}
                     >
                       {action === 'View My Appointments' && <Calendar className="h-3 w-3 mr-1" />}
                       {action === 'Request Refill' && <Pill className="h-3 w-3 mr-1" />}
                       {action === 'I have a doubt' && <HelpCircle className="h-3 w-3 mr-1" />}
                       {action}
                     </Button>
                   ))}
                </div>
              </div>
            </>
          ) : (
            // Regular Clinician Chat
            <>
              <div className="p-4 border-b flex items-center gap-3">
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback className="bg-muted text-muted-foreground">{activeChatData?.sender.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm">{activeChatData?.sender}</h3>
                  <p className="text-[10px] text-muted-foreground">{activeChatData?.subject}</p>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {activeChatData?.conversation?.map((chat: any, i: number) => (
                    <div key={i} className={cn('flex items-end gap-2', chat.from === 'You' ? 'justify-end' : 'justify-start')}>
                      <div className={cn('max-w-xs rounded-2xl p-3 text-sm md:max-w-md shadow-sm', chat.from === 'You' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none')}>
                        <p>{chat.text}</p>
                        <p className="mt-1 text-[9px] opacity-70">{chat.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}

          {/* Input Bar */}
          <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto relative group">
              <Input
                placeholder={activeTab === 'assistant' ? "Ask the AI Assistant a question..." : "Reply to clinician..."}
                className="pr-12 py-6 rounded-2xl border-primary/20 focus-visible:ring-primary shadow-inner"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl shadow-md"
                size="icon"
                onClick={() => handleSendMessage()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-medium opacity-50">
              {activeTab === 'assistant' ? "AI Assistant may provide medical guidance - not a substitute for professional advice." : "Messages are encrypted and secure."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
