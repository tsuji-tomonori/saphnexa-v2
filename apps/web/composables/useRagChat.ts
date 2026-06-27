export type Citation = {
  id: string
  documentId: string
  title: string
  excerpt: string
  page?: number
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  status?: 'streaming' | 'done' | 'error'
}

type ChatEvent =
  | { type: 'delta'; text: string }
  | { type: 'citation'; citation: Citation }
  | { type: 'done'; messageId: string }
  | { type: 'error'; code: string; message: string }

// eslint-disable-next-line max-lines-per-function
export function useRagChat() {
  const config = useRuntimeConfig()
  const messages = ref<ChatMessage[]>([])
  const status = ref<'idle' | 'streaming' | 'error'>('idle')
  const errorMessage = ref<string>()
  const abortController = shallowRef<AbortController>()

  const assistantMessage = computed(() =>
    messages.value.findLast((message) => message.role === 'assistant'),
  )

  function clear() {
    messages.value = []
    status.value = 'idle'
    errorMessage.value = undefined
  }

  function stop() {
    abortController.value?.abort()
    abortController.value = undefined
    status.value = 'idle'
    const current = assistantMessage.value
    if (current?.status === 'streaming') current.status = 'done'
  }

  // eslint-disable-next-line complexity
  async function sendMessage(message: string) {
    const text = message.trim()
    if (!text || status.value === 'streaming') return

    errorMessage.value = undefined
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    const assistant: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      citations: [],
      status: 'streaming',
    }
    messages.value = [...messages.value, userMessage, assistant]
    status.value = 'streaming'
    abortController.value = new AbortController()

    try {
      const response = await fetch(`${config.public.apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
        signal: abortController.value.signal,
      })
      if (!response.ok || !response.body)
        throw new Error(`チャットAPIが ${response.status} を返しました。`)

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
      let buffer = ''
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += value
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) applyStreamLine(line, assistant)
      }
      if (buffer) applyStreamLine(buffer, assistant)
      assistant.status = 'done'
      status.value = 'idle'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      const current = assistant
      current.status = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'チャットの送信に失敗しました。'
      status.value = 'error'
    } finally {
      abortController.value = undefined
    }
  }

  function applyStreamLine(line: string, target: ChatMessage) {
    const raw = line.startsWith('data:') ? line.slice(5).trim() : line.trim()
    if (!raw) return
    const event = JSON.parse(raw) as ChatEvent
    if (event.type === 'delta') target.content += event.text
    if (event.type === 'citation') target.citations = [...(target.citations ?? []), event.citation]
    if (event.type === 'done') {
      target.id = event.messageId
      target.status = 'done'
    }
    if (event.type === 'error') throw new Error(event.message)
  }

  return { messages, status, errorMessage, sendMessage, stop, clear }
}
