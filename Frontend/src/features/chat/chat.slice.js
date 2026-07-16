import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
        streamingContent: '',
        isSearching: false,
        isStreaming: false,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },
        renameChatTitle: (state, action) => {
            const { chatId, title } = action.payload
            if (state.chats[chatId]) {
                state.chats[chatId].title = title
            }
        },
        removeChat: (state, action) => {
            const chatId = action.payload
            delete state.chats[chatId]
            if (state.currentChatId === chatId) {
                state.currentChatId = null
            }
        },
        startStreaming: (state) => {
            state.isStreaming = true
            state.streamingContent = ''
            state.isSearching = false
        },
        setSearching: (state) => {
            state.isSearching = true
        },
        appendStreamToken: (state, action) => {
            state.isSearching = false
            state.streamingContent += action.payload
        },
        endStreaming: (state) => {
            state.isStreaming = false
            state.streamingContent = ''
            state.isSearching = false
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            if (!state.chats[chatId]) return
            state.chats[chatId].messages.push({ content, role })
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            if (!state.chats[chatId]) return
            state.chats[chatId].messages.push(...messages)
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
    }
})

export const {
    setChats, setCurrentChatId, setLoading, setError,
    createNewChat, addNewMessage, addMessages,
    renameChatTitle, removeChat,
    startStreaming, setSearching, appendStreamToken, endStreaming
} = chatSlice.actions

export default chatSlice.reducer