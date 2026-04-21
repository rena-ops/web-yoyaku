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
      if (first) setPreviewDosen(first.id)
    }
  }, [tab, data])

  const loadFromSheets = useCallback(async (url?: string) => {
    const targetUrl = url || gasUrl
    if (!targetUrl) return
    setLoading(true)
    setSaveError(null)
    try {
      const res = await fetch(`/api/sheets?gasUrl=${encodeURIComponent(targetUrl)}`)
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setLastSaved('スプシから読み込み完了')
      }
    } catch {
      setSaveError('読み込みエラー')
    } finally {
      setLoading(false)
    }
  }, [gasUrl])

  const saveToSheets = useCallback(async (d: Dosen[]) => {
    if (!gasUrl) return
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gasUrl, data: d }),
      })
      const json = await res.json()
      if (json.ok) {
        setLastSaved(new Date().toLocaleTimeString('ja-JP'))
      } else {
        setSaveError('保存エラー')
      }
    } catch {
      setSaveError('通信エラー')
    } finally {
      setSaving(false)
    }
  }, [gasUrl])

  const update = useCallback((newData: Dosen[]) => {
    setData(newData)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveToSheets(newData), 1500)
  }, [saveToSheets])

  const updateDosen = (id: string, field: keyof Dosen, val: unknown) =>
    update(data.map(d => d.id === id ? { ...d, [field]: val } : d))

  const updateCat = (did: string, cid: string, field: keyof Category, val: string) =>
    update(data.map(d => d.id !== did ? d : {
      ...d, cats: d.cats.map(c => c.id !== cid ? c : { ...c, [field]: val })
    }))

  const updateMenu = (did: string, cid: string, mid: string, field: keyof MenuItem, val: string) =>
    update(data.map(d => d.id !== did ? d : {
      ...d, cats: d.cats.map(c => c.id !== cid ? c : {
        ...c, menus: c.menus.map(m => m.id !== mid ? m : { ...m, [field]: val })
      })
    }))

  const addMenu = (did: string, cid: string) =>
    update(data.map(d => d.id !== did ? d : {
      ...d, cats: d.cats.map(c => c.id !== cid ? c : {
        ...c, menus: [...c.menus, { id: genId(), name: '新しいメニュー', master: '', desc: '', price: '', time: '' }]
      })
    }))

  const delMenu = (did: string, cid: string, mid: string) =>
    update(data.map(d => d.id !== did ? d : {
      ...d, cats: d.cats.map(c => c.id !== cid ? c : {
        ...c, menus: c.menus.filter(m => m.id !== mid)
      })
    }))

  const addCat = (did: string) =>
    update(data.map(d => d.id !== did ? d : {
      ...d, cats: [...d.cats, { id: genId(), name: '新しいカテゴリ', menus: [] }]
    }))

  const delCat = (did: string, cid: string) =>
    update(data.map(d => d.id !== did ? d : { ...d, cats: d.cats.filter(c => c.id !== cid) }))

  const addDosen = () =>
    update([...data, { id: genId(), dosen: '新しい導線名', tabIdx: tab, multiSel: true, cats: [] }])

  const delDosen = (id: string) => {
    if (!confirm('この導線を削除しますか？')) return
    update(data.filter(d => d.id !== id))
  }

  const tabDosens = data.filter(d => d.tabIdx === tab)
  const prevDosen = tabDosens.find(d => d.id === previewDosen) || tabDosens[0]

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 14, color: '#1a1a1a', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: '#f0436e', color: '#fff', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            WEB予約 編集ツール{clinicName ? `　―　${clinicName}` : ''}
          </span>
          {loading && <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.25)', padding: '2px 10px', borderRadius: 20 }}>読込中...</span>}
          {saving && <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.25)', padding: '2px 10px', borderRadius: 20 }}>保存中...</span>}
          {lastSaved && !saving && !loading && <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: 20 }}>{lastSaved}</span>}
          {saveError && <span style={{ fontSize: 12, background: '#c0392b', padding: '2px 10px', borderRadius: 20 }}>{saveError}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {gasUrl && <button onClick={() => loadFromSheets()} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>スプシから読み込む</button>}
          <button onClick={() => setShowSettings(!showSettings)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>⚙ 設定</button>
        </div>
      </div>

      {showSettings && (
        <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '14px 20px' }}>
          <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <label style={{ fontSize: 13, color: '#555', minWidth: 120 }}>クリニック名</label>
              <input value={clinicName} onChange={e => { setClinicName(e.target.value); localStorage.setItem('clinicName', e.target.value) }}
                placeholder="例：○○クリニック" style={{ flex: 1, padding: '6px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <label style={{ fontSize: 13, color: '#555', minWidth: 120 }}>クリニックGAS URL</label>
              <input value={gasUrl} onChange={e => { setGasUrl(e.target.value); localStorage.setItem('gasUrl', e.target.value) }}
                placeholder="https://script.google.com/macros/s/..." style={{ flex: 1, padding: '6px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }} />
              <button onClick={() => loadFromSheets()} style={{ background: '#f0436e', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>接続テスト</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderBottom: '1px solid #eee', display: 'flex', padding: '0 20px' }}>
        {['初診（初めて受ける方）', '再診（受けたことがある方）'].map((label, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: tab === i ? 600 : 400, color: tab === i ? '#f0436e' : '#666', borderBottom: tab === i ? '2px solid #f0436e' : '2px solid transparent' }}>{label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: 'calc(100vh - 120px)' }}>
        <div style={{ padding: 20, overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>導線・カテゴリ・メニュー編集</div>
          {tabDosens.map(d => (
            <div key={d.id} style={{ border: '1px solid #e0e0e0', borderRadius: 10, background: '#fff', marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ background: '#fafafa', borderBottom: '1px solid #eee', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <input value={d.dosen} onChange={e => updateDosen(d.id, 'dosen', e.target.value)}
                  style={{ flex: 1, fontSize: 14, fontWeight: 600, border: '1px solid #ddd', borderRadius: 6, padding: '5px 10px' }} placeholder="導線名" />
                <label style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={d.multiSel} onChange={e => updateDosen(d.id, 'multiSel', e.target.checked)} /> 複数選択可
                </label>
                <button onClick={() => delDosen(d.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: 18 }}>×</button>
              </div>
              {d.cats.map(cat => (
                <div key={cat.id} style={{ borderTop: '1px solid #eee' }}>
                  <div style={{ background: '#f9f9f9', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#aaa', minWidth: 48 }}>カテゴリ</span>
                    <input value={cat.name} onChange={e => updateCat(d.id, cat.id, 'name', e.target.value)}
                      style={{ flex: 1, fontSize: 13, fontWeight: 500, border: '1px solid #ddd', borderRadius: 5, padding: '4px 8px' }} />
                    <button onClick={() => delCat(d.id, cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: 16 }}>×</button>
                  </div>
                  {cat.menus.map(m => (
                    <div key={m.id} style={{ borderTop: '1px solid #f0f0f0', padding: '10px 14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 28px', gap: 6, marginBottom: 6 }}>
                        <div>
                          <div style={{ fontSize: 10, color: '#aaa', marginBottom: 2 }}>WEB表示名</div>
                          <input value={m.name} onChange={e => updateMenu(d.id, cat.id, m.id, 'name', e.target.value)}
                            style={{ width: '100%', fontSize: 13, border: '1px solid #ddd', borderRadius: 5, padding: '4px 8px' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: '#aaa', marginBottom: 2 }}>時間目安</div>
                          <input value={m.time} onChange={e => updateMenu(d.id, cat.id, m.id, 'time', e.target.value)}
                            placeholder="30分" style={{ width: '100%', fontSize: 13, border: '1px solid #ddd', borderRadius: 5, padding: '4px 8px' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: '#aaa', marginBottom: 2 }}>金額</div>
                          <input value={m.price} onChange={e => updateMenu(d.id, cat.id, m.id, 'price', e.target.value)}
                            placeholder="無料" style={{ width: '100%', fontSize: 13, border: '1px solid #ddd', borderRadius: 5, padding: '4px 8px' }} />
                        </div>
                        <button onClick={() => delMenu(d.id, cat.id, m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 16, alignSelf: 'flex-end', paddingBottom: 4 }}>×</button>
                      </div>
                      <div style={{ marginBottom: 6 }}>
                        <div style={{ fontSize: 10, color: '#aaa', marginBottom: 2 }}>説明文</div>
                        <textarea value={m.desc} onChange={e => updateMenu(d.id, cat.id, m.id, 'desc', e.target.value)}
                          rows={2} style={{ width: '100%', fontSize: 12, border: '1px solid #ddd', borderRadius: 5, padding: '4px 8px', resize: 'vertical', fontFamily: 'inherit' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#aaa', marginBottom: 2 }}>紐づけるマスター施術名（|で複数）</div>
                        <input value={m.master} onChange={e => updateMenu(d.id, cat.id, m.id, 'master', e.target.value)}
                          style={{ width: '100%', fontSize: 12, border: '1px solid #ddd', borderRadius: 5, padding: '4px 8px', color: '#888' }} />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addMenu(d.id, cat.id)} style={{ width: '100%', padding: '7px', border: 'none', background: 'none', color: '#f0436e', fontSize: 12, cursor: 'pointer', borderTop: '1px solid #f5f5f5' }}>＋ メニューを追加</button>
                </div>
              ))}
              <button onClick={() => addCat(d.id)} style={{ width: '100%', padding: '8px', border: 'none', borderTop: '1px solid #eee', background: 'none', color: '#888', fontSize: 12, cursor: 'pointer' }}>＋ カテゴリを追加</button>
            </div>
          ))}
          <button onClick={addDosen} style={{ width: '100%', padding: '10px', border: '1px dashed #ccc', borderRadius: 10, background: 'none', color: '#999', fontSize: 13, cursor: 'pointer' }}>＋ 導線を追加</button>
        </div>

        <div style={{ borderLeft: '1px solid #e0e0e0', background: '#f0f0f0', padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>WEB予約プレビュー</div>
          <div style={{ background: '#f8f8f8', borderRadius: 10, overflow: 'hidden', border: '1px solid #ddd' }}>
            <div style={{ background: '#f0436e', padding: '10px 14px' }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{clinicName || 'medicalforce clinic'}</span>
            </div>
            <div style={{ background: '#fff', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #f0f0f0' }}>
              {[['1','メニューの選択',true],['2','お客様情報',false],['3','完了',false]].map(([n,label,active]) => (
                <div key={n as string} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: active ? '#f0436e' : '#ddd', color: active ? '#fff' : '#999', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
                  <span style={{ fontSize: 10, color: active ? '#333' : '#aaa' }}>{label}</span>
                  {n !== '3' && <span style={{ color: '#ddd', fontSize: 12, marginLeft: 2 }}>—</span>}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 14px', background: '#fff' }}>
              <div style={{ background: '#f0436e', color: '#fff', textAlign: 'center', padding: '7px', fontSize: 13, fontWeight: 600, borderRadius: 6, marginBottom: 10 }}>施術メニューを選択してください</div>
              {tabDosens.map(d => (
                <button key={d.id} onClick={() => setPreviewDosen(d.id)}
                  style={{ display: 'block', width: '100%', padding: '10px 12px', border: `1px solid ${previewDosen === d.id ? '#f0436e' : '#f0d0da'}`, borderRadius: 6, background: previewDosen === d.id ? '#fff0f3' : '#fff', textAlign: 'center', color: '#f0436e', fontSize: 12, cursor: 'pointer', marginBottom: 6 }}>
                  {d.dosen}
                </button>
              ))}
              {prevDosen && prevDosen.cats.map(cat => (
                <div key={cat.id} style={{ border: '1px solid #eee', borderRadius: 6, marginBottom: 8, overflow: 'hidden' }}>
                  <div style={{ color: '#f0436e', padding: '6px 10px', fontSize: 12, fontWeight: 600 }}>{cat.name}</div>
                  {cat.menus.map(m => (
                    <div key={m.id} style={{ padding: '7px 10px', borderTop: '1px solid #f5f5f5' }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>{m.name}</div>
                      {(m.time || m.price) && <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{m.time && `時間目安：${m.time}`}{m.time && m.price && '　'}{m.price && `目安金額：${m.price}`}</div>}
                      {m.desc && <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{m.desc}</div>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
