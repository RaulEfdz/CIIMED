// Función simple de chunking por palabras
export function chunkText(text: string, maxTokens = 700, overlap = 120): string[] {
  const words = text.split(/\s+/)
  const approxWordsPerToken = 0.75 // Heurística: 1 token ≈ 0.75 palabras
  const wordsPerChunk = Math.floor(maxTokens / approxWordsPerToken)
  const overlapWords = Math.floor(overlap / approxWordsPerToken)
  
  const chunks: string[] = []
  
  for (let i = 0; i < words.length; i += (wordsPerChunk - overlapWords)) {
    const chunk = words.slice(i, i + wordsPerChunk).join(' ')
    if (chunk.trim()) {
      chunks.push(chunk.trim())
    }
    if (i + wordsPerChunk >= words.length) break
  }
  
  return chunks
}

// Limpiar texto para mejor procesamiento
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Múltiples espacios → 1 espacio
    .replace(/\n+/g, '\n') // Múltiples saltos → 1 salto
    .trim()
}