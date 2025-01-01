/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch'

export async function fetchFastApiEvaluation(
  theme: string,
  spokenText: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<any> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8080'}/calculate-evaluation`

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ theme, response: spokenText }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch evaluation data: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}
