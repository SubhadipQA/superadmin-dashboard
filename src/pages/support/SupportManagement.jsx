import { useState } from 'react'
import {
  ArrowLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  MessageCircle,
  Plus,
  Search,
  Send,
  Ticket,
} from 'lucide-react'

const statusTabs = [
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
]

const mockTickets = [
  {
    id: 1,
    ticketNumber: 'T-12345',
    category: 'Payment',
    title: 'Payment was not reflected',
    description: 'The payment for Salt Lake Sector V is not showing in the settlement summary.',
    status: 'OPEN',
    createdAt: 'Today, 10:30 AM',
    replies: [
      { from: 'You', message: 'The payment for Salt Lake Sector V is not showing in the settlement summary.', time: '10:30 AM' },
    ],
  },
  {
    id: 2,
    ticketNumber: 'T-12344',
    category: 'Parking Area',
    title: 'Zone details need an update',
    description: 'Please update the operating hours for the selected parking area.',
    status: 'IN_PROGRESS',
    createdAt: 'Yesterday, 4:15 PM',
    replies: [
      { from: 'You', message: 'Please update the operating hours for the selected parking area.', time: '4:15 PM' },
      { from: 'Support Team', message: 'We are checking this with the zone operations team.', time: '4:40 PM' },
    ],
  },
  {
    id: 3,
    ticketNumber: 'T-12340',
    category: 'Account',
    title: 'Vendor access request',
    description: 'The vendor has confirmed that access is working now.',
    status: 'RESOLVED',
    createdAt: '08 Oct 2026, 1:20 PM',
    replies: [],
  },
]

const statusStyles = {
  OPEN: 'bg-blue-50 text-ypark-bright-blue',
  IN_PROGRESS: 'bg-amber-50 text-amber-700',
  RESOLVED: 'bg-green-50 text-ypark-success',
}

const SupportManagement = () => {
  const [activeStatus, setActiveStatus] = useState('OPEN')
  const [tickets, setTickets] = useState(mockTickets)
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [reply, setReply] = useState('')
  const [newTicket, setNewTicket] = useState({ category: 'Payment', title: '', description: '' })

  const filteredTickets = tickets.filter((ticket) => ticket.status === activeStatus)
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId)

  const createTicket = (event) => {
    event.preventDefault()
    const ticket = {
      id: Date.now(),
      ticketNumber: `T-${String(Date.now()).slice(-5)}`,
      ...newTicket,
      status: 'OPEN',
      createdAt: 'Just now',
      replies: [],
    }
    setTickets((currentTickets) => [ticket, ...currentTickets])
    setActiveStatus('OPEN')
    setSelectedTicketId(ticket.id)
    setShowForm(false)
    setNewTicket({ category: 'Payment', title: '', description: '' })
  }

  const sendReply = (event) => {
    event.preventDefault()
    if (!reply.trim() || !selectedTicket) return

    setTickets((currentTickets) => currentTickets.map((ticket) => (
      ticket.id === selectedTicket.id
        ? { ...ticket, replies: [...ticket.replies, { from: 'You', message: reply.trim(), time: 'Just now' }] }
        : ticket
    )))
    setReply('')
  }

  return (
    <section className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-ypark-text-muted text-xs font-medium mb-2">
            <CircleHelp className="w-4 h-4 text-ypark-deep-blue" />
            Support Center
          </div>
          <h1 className="text-ypark-text text-2xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-ypark-text-muted text-sm mt-1">Track your questions and get help from the support team.</p>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(true); setSelectedTicketId(null) }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-ypark-deep-blue px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ypark-deep-blue/20 transition hover:bg-ypark-bright-blue"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {showForm ? (
        <form onSubmit={createTicket} className="rounded-xl border border-ypark-black/10 bg-white p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-ypark-black/10 pb-4">
            <div>
              <h2 className="text-ypark-text font-bold">Raise a new ticket</h2>
              <p className="text-ypark-text-muted text-xs mt-1">Share the issue and the team will get back to you.</p>
            </div>
            <button type="button" onClick={() => setShowForm(false)} className="text-ypark-text-muted text-sm hover:text-ypark-text">Cancel</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-ypark-text text-sm font-medium">
              Category
              <select
                value={newTicket.category}
                onChange={(event) => setNewTicket({ ...newTicket, category: event.target.value })}
                className="mt-2 w-full rounded-lg border border-ypark-black/10 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-ypark-deep-blue"
              >
                <option>Payment</option>
                <option>Parking Area</option>
                <option>Account</option>
                <option>Other</option>
              </select>
            </label>
            <label className="text-ypark-text text-sm font-medium">
              Title
              <input
                required
                value={newTicket.title}
                onChange={(event) => setNewTicket({ ...newTicket, title: event.target.value })}
                placeholder="What do you need help with?"
                className="mt-2 w-full rounded-lg border border-ypark-black/10 px-3 py-2.5 text-sm font-normal outline-none placeholder:text-ypark-text-muted/60 focus:border-ypark-deep-blue"
              />
            </label>
          </div>
          <label className="block text-ypark-text text-sm font-medium">
            Description
            <textarea
              required
              rows="5"
              value={newTicket.description}
              onChange={(event) => setNewTicket({ ...newTicket, description: event.target.value })}
              placeholder="Describe the issue in detail"
              className="mt-2 w-full resize-none rounded-lg border border-ypark-black/10 px-3 py-2.5 text-sm font-normal outline-none placeholder:text-ypark-text-muted/60 focus:border-ypark-deep-blue"
            />
          </label>
          <button type="submit" className="w-full rounded-lg bg-ypark-deep-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ypark-bright-blue sm:w-auto">Submit Ticket</button>
        </form>
      ) : selectedTicket ? (
        <div className="rounded-xl border border-ypark-black/10 bg-white overflow-hidden">
          <div className="flex items-center gap-3 border-b border-ypark-black/10 p-4 sm:p-5">
            <button type="button" onClick={() => setSelectedTicketId(null)} className="rounded-lg p-2 text-ypark-text-muted hover:bg-ypark-light-gray hover:text-ypark-text" aria-label="Back to tickets">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-ypark-text-muted text-xs">{selectedTicket.ticketNumber} · {selectedTicket.category}</p>
              <h2 className="truncate text-ypark-text font-bold">{selectedTicket.title}</h2>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[selectedTicket.status]}`}>
              {selectedTicket.status.replace('_', ' ')}
            </span>
          </div>
          <div className="space-y-4 p-4 sm:p-6">
            <div className="rounded-lg bg-ypark-light-gray p-4 text-sm text-ypark-text">
              {selectedTicket.description}
              <p className="mt-2 text-xs text-ypark-text-muted">Created {selectedTicket.createdAt}</p>
            </div>
            {selectedTicket.replies.map((item, index) => (
              <div key={`${item.time}-${index}`} className={`max-w-xl rounded-lg border border-ypark-black/10 p-4 text-sm ${item.from === 'You' ? 'ml-auto bg-blue-50' : 'bg-white'}`}>
                <div className="mb-1 flex items-center justify-between gap-4 text-xs font-semibold text-ypark-text-muted">
                  <span>{item.from}</span>
                  <span>{item.time}</span>
                </div>
                <p className="text-ypark-text">{item.message}</p>
              </div>
            ))}
            <form onSubmit={sendReply} className="flex items-end gap-2 border-t border-ypark-black/10 pt-4">
              <textarea value={reply} onChange={(event) => setReply(event.target.value)} rows="2" placeholder="Write a reply..." className="min-w-0 flex-1 resize-none rounded-lg border border-ypark-black/10 px-3 py-2.5 text-sm outline-none placeholder:text-ypark-text-muted/60 focus:border-ypark-deep-blue" />
              <button type="submit" className="rounded-lg bg-ypark-deep-blue p-3 text-white transition hover:bg-ypark-bright-blue" aria-label="Send reply"><Send className="w-4 h-4" /></button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1 rounded-lg bg-white p-1 border border-ypark-black/10 w-fit">
              {statusTabs.map((tab) => (
                <button key={tab.value} type="button" onClick={() => setActiveStatus(tab.value)} className={`rounded-md px-3 py-2 text-xs font-semibold transition ${activeStatus === tab.value ? 'bg-ypark-deep-blue text-white' : 'text-ypark-text-muted hover:bg-ypark-light-gray'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-ypark-black/10 bg-white px-3 py-2 text-ypark-text-muted sm:w-64">
              <Search className="w-4 h-4" />
              <span className="text-xs">Search tickets</span>
            </div>
          </div>

          {filteredTickets.length > 0 ? (
            <div className="grid gap-3">
              {filteredTickets.map((ticket) => (
                <button key={ticket.id} type="button" onClick={() => setSelectedTicketId(ticket.id)} className="group flex w-full items-center gap-4 rounded-xl border border-ypark-black/10 bg-white p-4 text-left transition hover:border-ypark-deep-blue/40 hover:shadow-md sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ypark-deep-blue/10 text-ypark-deep-blue"><Ticket className="w-5 h-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-ypark-text-muted">{ticket.ticketNumber}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[ticket.status]}`}>{ticket.status.replace('_', ' ')}</span>
                    </div>
                    <h3 className="truncate text-sm font-bold text-ypark-text">{ticket.title}</h3>
                    <p className="mt-1 truncate text-xs text-ypark-text-muted">{ticket.description}</p>
                  </div>
                  <div className="hidden shrink-0 items-center gap-1 text-xs text-ypark-text-muted sm:flex"><Clock3 className="w-3.5 h-3.5" />{ticket.createdAt}</div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-ypark-text-muted transition group-hover:translate-x-0.5 group-hover:text-ypark-deep-blue" />
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-ypark-black/15 bg-white px-6 py-16 text-center">
              <MessageCircle className="mx-auto h-10 w-10 text-ypark-deep-blue/60" />
              <h2 className="mt-4 text-sm font-bold text-ypark-text">No tickets here</h2>
              <p className="mt-1 text-xs text-ypark-text-muted">Create a new ticket and it will appear in this list.</p>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default SupportManagement
