import { generateResponse, generateChatTitle, streamResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"

import { getIO } from "../sockets/server.socket.js";

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId, socketId } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        let title = null, chat = null;

        if (!chatId) {
            title = await generateChatTitle(message);
            chat = await chatModel.create({ user: req.user.id, title });
        } else {
            chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
            if (!chat) {
                return res.status(404).json({ success: false, message: "Chat not found" });
            }
        }

        await messageModel.create({ chat: chat._id, content: message, role: "user" });

        const messages = await messageModel.find({ chat: chat._id });
        const io = getIO();

        let fullText = "";
        if (socketId) {
            fullText = await streamResponse(messages, {
                onToken: (token) => io.to(socketId).emit("ai:token", { chatId: chat._id.toString(), token }),
                onSearching: () => io.to(socketId).emit("ai:searching", { chatId: chat._id.toString() }),
            });
        } else {
            fullText = await generateResponse(messages);
        }

        const aiMessage = await messageModel.create({ chat: chat._id, content: fullText, role: "ai" });

        if (socketId) {
            io.to(socketId).emit("ai:done", { chatId: chat._id.toString() });
        }

        res.status(201).json({ title, chat, aiMessage: { content: fullText, role: "ai" } });

    } catch (err) {
        console.error(err);

        if (err.status === 429 || err.name === "GoogleGenerativeAIFetchError") {
            return res.status(429).json({
                success: false,
                message: "AI service is temporarily rate-limited. Please try again shortly."
            });
        }

        res.status(500).json({ success: false, message: "Something went wrong while sending your message" });
    }
}


export async function getChats(req, res) {
    try {
        const user = req.user
        const chats = await chatModel.find({ user: user.id })

        res.status(200).json({
            message: "chats retrieved succesfully",
            chats
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to retrieve chats" });
    }
}

export async function getMessages(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        })

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found"
            })
        }

        const messages = await messageModel.find({
            chat: chatId
        })

        res.status(200).json({
            message: "Messages retrieved successfully",
            messages
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to retrieve messages" });
    }
}

export async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: req.user.id
        })

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found"
            })
        }

        await messageModel.deleteMany({
            chat: chatId
        })

        res.status(200).json({
            message: "Chat deleted successfully"
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete chat" });
    }
}

export async function renameChat(req, res) {
    try {
        const { chatId } = req.params;
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        const chat = await chatModel.findOneAndUpdate(
            { _id: chatId, user: req.user.id },
            { title: title.trim() },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json({
            message: "Chat renamed successfully",
            chat
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to rename chat" });
    }
}