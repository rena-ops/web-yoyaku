import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const gasUrl = req.nextUrl.searchParams.get('gasUrl')
  if (!gasUrl) return NextResponse.json({ error: 'gasUrl required' }, { status: 400 })
  try {
    const res = await fetch(`${gasUrl}?action=read`, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch from Google Sheets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { gasUrl, data } = body
    if (!gasUrl) return NextResponse.json({ error: 'gasUrl required' }, { status: 400 })
    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'write', data }),
    })
    const result = await res.json()
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to write to Google Sheets' }, { status: 500 })
  }
}
