const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const getGeminiErrorStatus = (error) =>
  error?.status ?? error?.response?.status ?? error?.code;

export const generateContentWithRetry = async (
  ai,
  request,
  {
    maxAttempts = 3,
    retryDelayMs = 3000,
    fallbackModels = [],
  } = {}
) => {
  const models = [request.model, ...fallbackModels].filter(
    (model, index, values) => model && values.indexOf(model) === index
  );

  let lastError;

  for (const [modelIndex, model] of models.entries()) {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await ai.models.generateContent({ ...request, model });
      } catch (error) {
        lastError = error;

        const status = Number(getGeminiErrorStatus(error));
        const isServiceUnavailable = status === 503;
        const shouldTryFallback = status === 404 || status === 429;
        const hasAnotherAttempt = attempt < maxAttempts;
        const hasFallback = modelIndex < models.length - 1;

        if (shouldTryFallback && hasFallback) {
          console.warn(
            `Gemini model ${model} returned ${status}. Trying fallback model ${models[modelIndex + 1]}...`
          );
          break;
        }

        if (!isServiceUnavailable) {
          throw error;
        }

        if (!hasAnotherAttempt) {
          break;
        }

        console.warn(
          `Gemini model ${model} is busy (attempt ${attempt}/${maxAttempts}). Retrying in ${retryDelayMs}ms...`
        );

        await wait(retryDelayMs);
      }

    }

    if (
      modelIndex < models.length - 1 &&
      Number(getGeminiErrorStatus(lastError)) === 503
    ) {
      console.warn(
        `Gemini model ${model} is still unavailable. Trying fallback model ${models[modelIndex + 1]}...`
      );
    }
  }

  throw lastError || new Error("Gemini request failed after all retry attempts");
};
