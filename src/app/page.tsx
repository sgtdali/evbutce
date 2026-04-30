'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import TransactionForm from '@/components/TransactionForm'

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('ev_transactions')
      .select('*')
      .eq('type', 'gider')
      .order('date', { ascending: false })
      .limit(20)

    if (error) console.error('Hata:', error.message)
    else setTransactions(data || [])
    setLoading(false)
  }

  const totalExpense = transactions
    .reduce((acc, t) => acc + Number(t.amount), 0)

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem' }}>Ev Gider Takibi</h2>
        <p className="text-muted">Aylık harcamaların özeti ve yönetimi.</p>
      </header>

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr', marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <p className="text-sm text-muted">Toplam Harcama (Son 20 İşlem)</p>
          <h2 style={{ fontSize: '3rem', margin: '0.5rem 0', color: 'var(--danger)' }}>₺{totalExpense.toLocaleString('tr-TR')}</h2>
        </div>
      </div>

      <div className="grid gap-8" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <TransactionForm onSave={fetchTransactions} />

        <section className="card">
          <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
            <h3>Son Harcamalar</h3>
            <button onClick={fetchTransactions} className="text-sm" style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Yenile</button>
          </div>
          
          <div className="flex flex-direction-column gap-4" style={{ flexDirection: 'column' }}>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>Yükleniyor...</p>
            ) : transactions.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Henüz harcama kaydı bulunmuyor.</p>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className="flex justify-between items-center" style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--card-border)' }}>
                  <div className="flex gap-4 items-center">
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '10px', 
                      background: 'rgba(239, 68, 68, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--danger)',
                      fontWeight: 'bold'
                    }}>
                      -
                    </div>
                    <div>
                      <p style={{ fontWeight: 600 }}>{t.description || 'Harcama'}</p>
                      <p className="text-sm text-muted">{t.date}</p>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--danger)' }}>
                    ₺{Number(t.amount).toLocaleString('tr-TR')}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
