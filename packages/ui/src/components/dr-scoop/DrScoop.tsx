'use client'

import type { ChatModelAdapter, ChatModelRunOptions, AssistantRuntime } from '@assistant-ui/react'
import { AssistantRuntimeProvider, useLocalRuntime } from '@assistant-ui/react'
import { DrScoopPanel } from './DrScoopPanel'

// Stub adapter — replaced by real Railway runtime in FRONTEND-008
const stubAdapter: ChatModelAdapter = {
  async *run({ abortSignal }: ChatModelRunOptions) {
    yield {
      content: [{ type: 'text' as const, text: 'Connecting to Railway...' }],
    }
    await new Promise<void>((resolve) => {
      const id = setTimeout(resolve, 800)
      abortSignal.addEventListener('abort', () => clearTimeout(id))
    })
    yield {
      content: [
        {
          type: 'text' as const,
          text: 'Railway endpoint not yet wired. Wire /api/scoop in FRONTEND-008.',
        },
      ],
    }
  },
}

interface DrScoopProps {
  runtime?: AssistantRuntime | undefined
  section?: string | undefined
}

function DrScoopLocal({ section }: { section?: string | undefined }) {
  const runtime = useLocalRuntime(stubAdapter)
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <DrScoopPanel section={section} />
    </AssistantRuntimeProvider>
  )
}

function DrScoopExternal({
  runtime,
  section,
}: {
  runtime: AssistantRuntime
  section?: string | undefined
}) {
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <DrScoopPanel section={section} />
    </AssistantRuntimeProvider>
  )
}

export function DrScoop({ runtime, section }: DrScoopProps) {
  if (runtime !== undefined) return <DrScoopExternal runtime={runtime} section={section} />
  return <DrScoopLocal section={section} />
}
