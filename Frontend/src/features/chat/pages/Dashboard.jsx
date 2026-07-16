import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useDispatch, useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { getSocket } from '../service/chat.socket'
import { setSearching, appendStreamToken } from '../chat.slice'
import UserMenu from '../../auth/components/UserMenu'

const Dashboard = () => {
  const chat = useChat()
  const dispatch = useDispatch()
  const [chatInput, setChatInput] = useState('')
  const [editingChatId, setEditingChatId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const streamingContent = useSelector((state) => state.chat.streamingContent)
  const isSearching = useSelector((state) => state.chat.isSearching)
  const isStreaming = useSelector((state) => state.chat.isStreaming)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()

    const socket = getSocket()
    socket.on('ai:searching', () => dispatch(setSearching(true)))
    socket.on('ai:token', ({ token }) => dispatch(appendStreamToken(token)))

    return () => {
      socket.off('ai:searching')
      socket.off('ai:token')
    }
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmed = chatInput.trim()
    if (!trimmed) return
    chat.handleSendMessage({ message: trimmed, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    setSidebarOpen(false)
  }

  const startNewChat = () => {
    chat.handleSetCurrentChatId?.(null)
    setSidebarOpen(false)
  }

  const startRename = (event, chatId, currentTitle) => {
    event.stopPropagation()
    setEditingChatId(chatId)
    setEditValue(currentTitle)
  }

  const submitRename = async (event, chatId) => {
    event.stopPropagation()
    event.preventDefault()
    const trimmed = editValue.trim()
    if (trimmed) await chat.handleRenameChat(chatId, trimmed)
    setEditingChatId(null)
  }

  const handleDelete = async (event, chatId) => {
    event.stopPropagation()
    if (!window.confirm('Delete this chat?')) return
    await chat.handleDeleteChat(chatId)
  }

  const sortedChats = Object.values(chats).sort(
    (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
  )

  const activeMessages = chats[currentChatId]?.messages || []

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#0a0c10] text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-white/8 bg-[#0d0f15] p-4 transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-5 flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400/15 text-teal-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 8l10 6 10-6-10-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M2 16l10 6 10-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M2 12l10 6 10-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide">Perplexity</span>
        </div>

        <button
          onClick={startNewChat}
          className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white/85 transition hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-200"
        >
          <span className="text-base leading-none">+</span> New chat
        </button>

        <div className="flex-1 space-y-1 overflow-y-auto">
          {sortedChats.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-white/25">No conversations yet</p>
          )}

          {sortedChats.map((c) => (
            <div
              key={c.id}
              onClick={() => openChat(c.id)}
              className={`group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                currentChatId === c.id
                  ? 'bg-teal-400/10 text-teal-100'
                  : 'text-white/65 hover:bg-white/5 hover:text-white/90'
              }`}
            >
              {editingChatId === c.id ? (
                <form onSubmit={(e) => submitRename(e, c.id)} className="flex-1">
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={(e) => submitRename(e, c.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full border-b border-teal-400/50 bg-transparent text-white outline-none"
                  />
                </form>
              ) : (
                <span className="truncate flex-1">{c.title}</span>
              )}

              <div className="ml-2 hidden shrink-0 items-center gap-2.5 group-hover:flex">
                <button
                  type="button"
                  onClick={(e) => startRename(e, c.id, c.title)}
                  className="text-white/40 hover:text-white"
                  title="Rename"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, c.id)}
                  className="text-white/40 hover:text-red-400"
                  title="Delete"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <UserMenu />
      </aside>

      {/* Main chat area */}
      <section className="relative flex h-full flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-white/70">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <span className="text-sm font-medium text-white/80">
            {chats[currentChatId]?.title || 'New chat'}
          </span>
        </div>

        <div className="messages flex-1 overflow-y-auto px-4 pb-40 pt-6 md:px-8">
          <div className="mx-auto w-full max-w-3xl space-y-5">
            {activeMessages.length === 0 && !isStreaming && (
              <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 8l10 6 10-6-10-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                    <path d="M2 16l10 6 10-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white/90">Start a new conversation</h2>
                <p className="mt-1.5 max-w-sm text-sm text-white/40">
                  Ask anything — I can search the web for up-to-date answers when needed.
                </p>
              </div>
            )}

            {activeMessages.map((message, idx) => (
              <div
                key={idx}
                className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed md:max-w-[75%] ${
                    message.role === 'user'
                      ? 'rounded-br-sm bg-teal-400/12 text-white border border-teal-400/15'
                      : 'rounded-bl-sm bg-white/[0.04] text-white/90 border border-white/6'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>,
                        code: ({ children }) => <code className="rounded bg-white/10 px-1.5 py-0.5 text-[13px]">{children}</code>,
                        pre: ({ children }) => <pre className="mb-2 overflow-x-auto rounded-xl bg-black/40 p-3 text-[13px]">{children}</pre>,
                        a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" className="text-teal-300 underline underline-offset-2">{children}</a>,
                      }}
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}

            {isStreaming && (
              <div className="flex w-full justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-white/6 bg-white/[0.04] px-4 py-3 text-[15px] leading-relaxed text-white/90 md:max-w-[75%]">
                  {isSearching ? (
                    <div className="flex items-center gap-2 text-white/45">
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300" />
                      </span>
                      <span className="text-sm italic">Searching the web…</span>
                    </div>
                  ) : streamingContent ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingContent}</ReactMarkdown>
                  ) : (
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40" />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input bar */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/95 to-transparent pb-5 pt-8">
          <form onSubmit={handleSubmitMessage} className="mx-auto w-full max-w-3xl px-4 md:px-8">
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-[#12151c] p-2 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)] focus-within:border-teal-400/40">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message Perplexity…"
                className="max-h-32 w-full resize-none bg-transparent px-3 py-2.5 text-[15px] text-white outline-none placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isStreaming}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-400 text-black transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Dashboard