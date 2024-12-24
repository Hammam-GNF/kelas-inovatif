import { experimental_generateImage, Message, streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(request: Request) {
  const { messages }: { messages: Message[] } = await request.json();

  const formattedMessages = messages.map(m => {
    if (m.role === 'assistant' && m.toolInvocations) {
      m.toolInvocations.forEach(ti => {
        if (ti.toolName === 'generateImage' && ti.state === 'result') {
          ti.result.image = `redacted-for-length`;
        }
      });
    }
    return m;
  });

  const result = streamText({
    model: openai('gpt-4'),
    messages: formattedMessages,
    tools: {
      generateImage: tool({
        description: 'Generate an image',
        parameters: z.object({
          prompt: z.string().describe('The prompt to generate the image from'),
        }),
        execute: async ({ prompt }) => {
          const { image } = await experimental_generateImage({
            model: openai.image('dall-e-3'),
            prompt,
          });
          return { image: image.base64, prompt };
        },
      }),
    },
  });
  return result.toDataStreamResponse();
}
