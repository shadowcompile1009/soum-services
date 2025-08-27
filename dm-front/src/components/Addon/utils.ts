export function extractLast24Hex(url: string): string | null {
  const match = url.match(/([a-fA-F0-9]{24})(?=\/?$)/);
  return match ? match[1] : null;
}

export const parseModelId = (modelId: string | string[]) => {
  if (Array.isArray(modelId)) {
    // If it's an array with a stringified array inside
    if (
      modelId.length === 1 &&
      typeof modelId[0] === 'string' &&
      modelId[0].startsWith('[')
    ) {
      try {
        const parsed = JSON.parse(modelId[0]);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.warn('Error parsing nested modelId:', error);
      }
    }
    // If it's already a proper array
    return modelId;
  }

  if (typeof modelId === 'string') {
    try {
      // Check if it's a stringified array
      if (modelId.startsWith('[') && modelId.endsWith(']')) {
        const parsed = JSON.parse(modelId);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Error parsing modelId:', error);
    }
  }

  return [];
};
