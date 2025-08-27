export interface EmbeddingsProvider {
  generateEmbeddings(data: string[]): Promise<Array<number[]>>;
}
