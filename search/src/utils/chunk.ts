export const chunkArray = <V>(array: V[], chunkSize: number): Array<V[]> => {
  const chunks: Array<V[]> = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};
