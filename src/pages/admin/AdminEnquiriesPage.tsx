import { useEffect, useState, useCallback } from 'react'
import { Search, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Enquiry } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from '@/lib/utils'

const PAGE_SIZE = 20
const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive'> = {
  new: 'destructive',
  in_progress: 'default',
  resolved: 'secondary',
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchEnquiries = useCallback(async () => {
    setLoading(true)
    let q = supabase
      .from('enquiries')
      .select('*, products(id, name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
    if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    if (statusFilter) q = q.eq('status', statusFilter)
    const { data, count } = await q
    setEnquiries(data as Enquiry[] ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }, [search, statusFilter, page])

  useEffect(() => { setPage(0) }, [search, statusFilter])
  useEffect(() => { fetchEnquiries() }, [fetchEnquiries])

  const openEnquiry = (e: Enquiry) => {
    setSelected(e)
    setNotes(e.internal_notes ?? '')
  }

  const updateEnquiry = async (status: string) => {
    if (!selected) return
    setSaving(true)
    await supabase.from('enquiries').update({ status, internal_notes: notes } as any).eq('id', selected.id)
    setSaving(false)
    setSelected(null)
    fetchEnquiries()
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Product', 'Message', 'Status', 'Date']
    const rows = enquiries.map(e => [
      e.name, e.email, e.phone ?? '', e.company ?? '',
      (e.products as { name: string } | undefined)?.name ?? '',
      e.message.replace(/,/g, ';'), e.status, formatDate(e.created_at),
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'enquiries.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Product</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">View</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3">
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                </td></tr>
              ))
            ) : enquiries.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No enquiries found</td></tr>
            ) : (
              enquiries.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{e.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{e.email}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500">
                    {(e.products as { name: string } | undefined)?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500">{formatDate(e.created_at)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_COLORS[e.status] ?? 'secondary'}>
                      {e.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="icon" variant="ghost" onClick={() => openEnquiry(e)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {total > PAGE_SIZE && (
          <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
            <span className="text-sm text-gray-500">{total} total</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button size="sm" variant="outline" disabled={(page + 1) * PAGE_SIZE >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enquiry from {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-gray-400">Email</span><p className="font-medium">{selected.email}</p></div>
                <div><span className="text-gray-400">Phone</span><p className="font-medium">{selected.phone ?? '—'}</p></div>
                <div><span className="text-gray-400">Company</span><p className="font-medium">{selected.company ?? '—'}</p></div>
                <div><span className="text-gray-400">Date</span><p className="font-medium">{formatDate(selected.created_at)}</p></div>
              </div>
              {(selected.products as { name: string } | undefined)?.name && (
                <div><span className="text-gray-400">Product</span><p className="font-medium">{(selected.products as { name: string }).name}</p></div>
              )}
              <div>
                <span className="text-gray-400">Message</span>
                <p className="mt-1 bg-gray-50 rounded p-3 whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div>
                <Label>Internal Notes</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="mt-1" rows={3} />
              </div>
              <div className="flex gap-2 pt-2">
                {['new', 'in_progress', 'resolved'].map(s => (
                  <Button key={s} size="sm" variant={selected.status === s ? 'default' : 'outline'}
                    disabled={saving} onClick={() => updateEnquiry(s)}
                    className={selected.status === s ? 'bg-green-700 hover:bg-green-800' : ''}>
                    {s.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
