'use server';
/**
 * @fileOverview Clinical Assistant AI flow for Maruthi Clinic.
 * 
 * - clinicalAssistant - A function that handles patient inquiries.
 * - ClinicalAssistantInput - The input type for the flow.
 * - ClinicalAssistantOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ClinicalAssistantInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
  userMessage: z.string().describe('The current message from the patient.'),
  patientContext: z.object({
    firstName: z.string().optional(),
    upcomingAppointments: z.array(z.any()).optional(),
  }).optional(),
});
export type ClinicalAssistantInput = z.infer<typeof ClinicalAssistantInputSchema>;

const ClinicalAssistantOutputSchema = z.object({
  reply: z.string().describe('The assistant\'s response message.'),
  suggestedActions: z.array(z.string()).optional().describe('Buttons for the patient to click next.'),
});
export type ClinicalAssistantOutput = z.infer<typeof ClinicalAssistantOutputSchema>;

const prompt = ai.definePrompt({
  name: 'clinicalAssistantPrompt',
  input: { schema: ClinicalAssistantInputSchema },
  output: { schema: ClinicalAssistantOutputSchema },
  prompt: `You are the Maruthi Clinic Assistant, a helpful and professional AI dedicated to assisting patients with their healthcare needs.

Context:
- Patient Name: {{{patientContext.firstName}}}
- Clinic: Maruthi Clinic (Excellence in Clinical Care since 2010)
- Capabilities: Answering clinic-related questions, helping with portal navigation, basic health guidance (always with medical disclaimers), and handling requests.

Guidelines:
1. Always be polite and professional.
2. If the user asks for appointments, refer to their context: {{#each patientContext.upcomingAppointments}} - {{doctor}} on {{date}} at {{time}}{{/each}}.
3. If the user has a serious medical emergency, advise them to call emergency services immediately or visit the ER.
4. Keep responses concise and helpful.
5. Provide 2-3 short "suggestedActions" (strings) that represent likely follow-up questions or actions.

Current message: {{{userMessage}}}`,
});

export async function clinicalAssistant(input: ClinicalAssistantInput): Promise<ClinicalAssistantOutput> {
  const { output } = await prompt(input);
  return output!;
}
