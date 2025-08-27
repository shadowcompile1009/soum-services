export interface PrompterProvider {
  inferSearchTerm(data: string): Promise<string>;
}
