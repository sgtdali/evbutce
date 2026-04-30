'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export default function TransactionForm({ onSave }: { onSave: () => void }) {
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('ev_transactions')
      .insert([
        {
          type: 'gider',
          amount: parseFloat(amount),
          date,
          description
        }
      ])

    setLoading(true) // Keep loading for a bit for visual feedback
    setTimeout(() => setLoading(false), 500)

    if (error) {
      alert('Hata: ' + error.message)
    } else {
      setAmount('')
      setDescription('')
      onSave()
    }
  }

  const handleExport = async () => {
    setExporting(true)
    const { data, error } = await supabase
      .from('ev_transactions')
      .select('date, amount, description, type')
      .order('date', { ascending: false })

    if (error) {
      alert('Dışa aktarma hatası: ' + error.message)
    } else if (data) {
      // Prepare data for Excel (translating headers)
      const excelData = data.map(t => ({
        'Tarih': t.date,
        'Miktar (₺)': t.amount,
        'Açıklama': t.description || '',
        'Tür': t.type === 'gider' ? 'Gider' : 'Gelir'
      }))

      const worksheet = XLSX.utils.json_to_sheet(excelData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Harcamalar')
      
      // Generate and download
      const fileName = `Ev_Butcesi_Export_${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(workbook, fileName)
    }
    setExporting(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <form onSubmit={handleSubmit} className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Harcama Ekle</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="text-sm text-muted">Miktar (₺)</label>
          <input 
            type="number" 
            step="0.01" 
            required 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="text-sm text-muted">Tarih</label>
          <input 
            type="date" 
            required 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="text-sm text-muted">Açıklama</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Örn: Market alışverişi"
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }}
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', background: 'var(--danger)' }}>
          {loading ? 'Kaydediliyor...' : 'Harcamayı Kaydet'}
        </button>
      </form>

      <button 
        onClick={handleExport} 
        disabled={exporting}
        className="btn" 
        style={{ 
          background: 'var(--secondary)', 
          color: 'white',
          width: '100%',
          opacity: exporting ? 0.7 : 1
        }}
      >
        {exporting ? 'Dosya Hazırlanıyor...' : 'Excel Çıktısı Al (.xlsx)'}
      </button>
    </div>
  )
}
