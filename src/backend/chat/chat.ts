import ollama from 'ollama';

const MODEL = 'gemma3:1b'; // Consider moving this to a config if you have many.

async function initializeOllamaModel(modelName: string): Promise<void> {
  console.log(`Attempting to pull Ollama model: "${modelName}"`);
  try {
    await ollama.pull({ model: modelName });
    console.log(`Model "${modelName}" pulled successfully.`);
  } catch (error) {
    console.warn(
      `Could not pull model "${modelName}". It might already be downloaded or there's a network issue:`,
      error
    );
  }
}

async function* chat(
  prompt: string,
  modelName: string = MODEL
): AsyncGenerator<string> {
  console.log(
    `Starting chat stream for model: ${modelName} with prompt: "${prompt}"`
  );

  await initializeOllamaModel(modelName);

  try {
    const responseStream = await ollama.chat({
      model: modelName,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });
    console.log('🚀 ~ responseStream:', responseStream);

    for await (const chunk of responseStream) {
      if (chunk.message.content) {
        console.log('🚀 ~ forawait ~ chunk:', chunk);
        yield chunk.message.content;
      }
    }
    // console.log('Chat stream completed.');
  } catch (error) {
    console.error('Error during chat streaming:', error);
    yield `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export { chat };
