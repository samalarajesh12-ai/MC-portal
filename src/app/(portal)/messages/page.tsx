import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { messages, patient } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';

export default function MessagesPage() {
  const selectedMessage = messages[0];
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <div className="h-[calc(100vh-10rem)] w-full">
    <div className="grid h-full md:grid-cols-[300px_1fr]">
      <div className="hidden flex-col md:flex">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Inbox</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-2 p-4">
            {messages.map((message) => (
              <button
                key={message.id}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                  message.id === selectedMessage.id && 'bg-accent'
                )}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{message.sender}</div>
                    </div>
                    <div
                      className={cn(
                        'ml-auto text-xs',
                        message.id === selectedMessage.id
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {message.date}
                    </div>
                  </div>
                  <div className="text-xs font-medium">{message.subject}</div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {message.body.substring(0, 300)}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{selectedMessage.sender.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <p className="font-semibold">{selectedMessage.sender}</p>
              <p className="text-xs text-muted-foreground">
                {selectedMessage.subject}
              </p>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {selectedMessage.conversation.map((chat, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-end gap-2',
                  chat.from === 'You' ? 'justify-end' : 'justify-start'
                )}
              >
                {chat.from !== 'You' && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback>{chat.from.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg p-3 text-sm md:max-w-md',
                    chat.from === 'You'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p>{chat.text}</p>
                  <p className="mt-2 text-xs opacity-70">{chat.time}</p>
                </div>
                {chat.from === 'You' && userAvatar && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar.imageUrl} alt={patient.name} data-ai-hint={userAvatar.imageHint} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-auto border-t bg-background p-4">
          <div className="relative">
            <Input
              placeholder="Type your message..."
              className="pr-12"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
