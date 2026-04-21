'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Dosen, Category, MenuItem } from '@/lib/types'
import { defaultData } from '@/lib/defaultData'

const REGISTRY_GAS_URL = 'https://script.google.com/a/macros/atomic-software.co.jp/s/AKfycbxbMCZVnotLO4YYjPfZnK11xCDJxmzj_AzR7RApYiYtWvrvKpK5YSqEpPkz5Hasqnid2A/exec'

let uid = 1000
function genId() { return `x${uid++}` }

export default function Editor() {
  const [data, setData] = useState<Dosen[]>(defaultData)
  const [tab, setTab] = useState(0)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [gasUrl, setGasUrl] = useState('')
  const [clinicName, setClinicName] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [previewDosen, setPreviewDosen] = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const clinicId = params.get('clinic')
    if (clinicId) {
      fetchClinicInfo(clinicId)
    } else {
      const stored = localStorage.getItem('gasUrl')
      const storedName = localStorage.getItem('clinicName')
      if (stored) setGasUrl(stored)
      if (storedName) setClinicName(storedName)
    }
  }, [])

  const fetchClinicInfo = async (clinicId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${REGISTRY_GAS_URL}?action=getClinic&clinicId=${clinicId}`)
      const json = await res.json()
      if (json.gasUrl) {
        setGasUrl(json.gasUrl)
        setClinicName(json.clinicName || '')
        localStorage.setItem('gasUrl', json.gasUrl)
        localStorage.setItem('clinicName', json.clinicName || '')
        await loadFromSheets(json.gasUrl)
      }
    } catch {
      setSaveError('クリニック情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (data.length > 0) {
      const first = data.filter(d => d.tabIdx === tab)[0]
      if (first) setPreviewDosen
