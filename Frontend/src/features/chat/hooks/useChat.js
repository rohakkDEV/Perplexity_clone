import { getSocket, initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat, renameChat } from "../service/chat.api";
import {
    setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages,
    renameChatTitle, removeChat, startStreaming, setSearching, appendStreamToken, endStreaming
} from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        dispatch(startStreaming())

        try {
            const socket = getSocket()
            const socketId = socket?.id

            const data = await sendMessage({ message, chatId, socketId })
            const { chat, aiMessage } = data

            if (!chatId) {
                dispatch(createNewChat({ chatId: chat._id, title: chat.title }))
            }

            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: message,
                role: "user",
            }))
            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: aiMessage.content,
                role: aiMessage.role,
            }))
            dispatch(setCurrentChatId(chat._id))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to send message"))
        } finally {
            dispatch(endStreaming())
        }
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats) {

        if (chats[chatId]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }
    async function handleRenameChat(chatId, newTitle) {
        await renameChat(chatId, newTitle)
        dispatch(renameChatTitle({ chatId, title: newTitle }))
    }
    async function handleDeleteChat(chatId) {
        await deleteChat(chatId)
        dispatch(removeChat(chatId))
    }
    function handleSetCurrentChatId(chatId) {
        dispatch(setCurrentChatId(chatId))
    }



    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleRenameChat,
        handleDeleteChat,
        handleSetCurrentChatId,
    }

}