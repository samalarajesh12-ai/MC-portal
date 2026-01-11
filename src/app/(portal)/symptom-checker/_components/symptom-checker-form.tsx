'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Lightbulb, ClipboardList } from 'lucide-react';
import {
  aiSymptomChecker,
  type AISymptomCheckerOutput,
} from '@/ai/flows/ai-symptom-checker';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const symptomSchema = z.object({
  symptoms: z
    .string()
    .min(10, {
      message: 'Please describe your symptoms in at least 10 characters.',
    })
    .max(1000, {
      message: 'Please limit your description to 1000 characters.',
    }),
});

export default function SymptomCheckerForm() {
  const [result, setResult] = useState<AISymptomCheckerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof symptomSchema>>({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  async function onSubmit(values: z.infer<typeof symptomSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await aiSymptomChecker(values);
      setResult(response);
    } catch (error) {
      console.error('AI Symptom Checker Error:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          'Could not get a response from the AI. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Symptoms</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., I have a headache, fever, and a sore throat..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please provide as much detail as possible.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Symptoms
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>AI is analyzing your symptoms...</p>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
           <Card>
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        Potential Diagnoses
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{result.potentialDiagnoses}</p>
            </CardContent>
           </Card>
           <Card>
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        Recommendations
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{result.recommendations}</p>
            </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
