# Perplexity Clone — AI Chat App

A full-stack, real-time AI chat application with streaming responses, an agentic AI that decides when to search the web, and secure authentication. Built with the MERN stack, Socket.IO, and LangChain.

## Overview

This project is a real-time chat interface powered by an AI agent capable of reasoning over live web search results. It combines a streaming WebSocket layer for instant response delivery with a REST layer for persisted state, backed by a layered, production-style backend architecture.

## Features

- **Real-time streaming responses** — AI replies stream in token by token over WebSockets instead of a spinner-then-dump
- **Agentic web search** — the AI decides on its own when it needs current information and calls a live search tool, instead of relying on hardcoded triggers
- **Dual-model setup** — Mistral generates concise chat titles, Gemini handles the full conversation and tool use
- **Full chat management** — create, rename, delete, and revisit past conversations with persistent history
- **Secure authentication** — JWT-based auth with email verification, hashed passwords, and httpOnly cookies
- **Clean architecture** — layered backend (routes → controllers → services → models) with ownership checks and centralized error handling

## Tech Stack

**Frontend:** React, Redux Toolkit, React Router, Socket.IO Client, Tailwind CSS, React Markdown

**Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT, bcryptjs, express-validator, Nodemailer

**AI / Agent Layer:** LangChain, Google Gemini, Mistral AI, Tavily (web search)

## Architecture

```
Client (React)
   │
   ├── REST API ──────► Express Routes ──► Controllers ──► Models (MongoDB)
   │                                              │
   └── WebSocket ◄─── Socket.IO ◄─── AI Service ──┘
                                          │
                                          ├── LangChain Agent
                                          │      ├── Gemini (chat)
                                          │      └── Mistral (titles)
                                          │
                                          └── Tavily (web search tool)
```

REST handles durable state — auth, chat CRUD, and persisting the final AI message. WebSockets handle the live UX — streaming tokens and search status updates. The two layers are kept intentionally decoupled.

## Security

- Passwords hashed with bcrypt before storage
- JWTs stored in httpOnly, sameSite cookies
- Chat ownership verified on every read/write operation
- Request validation on all auth routes
- Centralized error handling to prevent leaking internal errors

## API Reference

| Method | Endpoint                        | Description                  |
|--------|----------------------------------|-------------------------------|
| POST   | `/api/auth/register`            | Register a new user          |
| POST   | `/api/auth/login`                | Log in and receive a session |
| GET    | `/api/auth/get-me`               | Get current user              |
| POST   | `/api/auth/logout`               | Log out                       |
| PATCH  | `/api/auth/profile`              | Update username               |
| PATCH  | `/api/auth/change-password`      | Change password               |
| POST   | `/api/chats/message`             | Send a message / start a chat |
| GET    | `/api/chats`                     | Get all chats for a user      |
| GET    | `/api/chats/:chatId/messages`    | Get messages for a chat       |
| PATCH  | `/api/chats/rename/:chatId`      | Rename a chat                 |
| DELETE | `/api/chats/delete/:chatId`      | Delete a chat                 |



