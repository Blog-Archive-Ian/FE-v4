'use client'

import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'

type Todo = {
  id: number
  title: string
}

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
  if (!res.ok) {
    throw new Error('Failed to fetch todos')
  }
  return res.json()
}

export default function Home() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Blog Home</h1>

      <Button onClick={() => refetch()}>다시 불러오기</Button>

      {isLoading && <p>로딩 중...</p>}
      {isError && <p className="text-red-500">에러가 발생했습니다.</p>}

      <ul className="w-full max-w-md space-y-2">
        {data?.map((todo) => (
          <li key={todo.id} className="border rounded px-3 py-2 text-sm bg-white/5">
            {todo.title}
          </li>
        ))}
      </ul>
    </main>
  )
}
