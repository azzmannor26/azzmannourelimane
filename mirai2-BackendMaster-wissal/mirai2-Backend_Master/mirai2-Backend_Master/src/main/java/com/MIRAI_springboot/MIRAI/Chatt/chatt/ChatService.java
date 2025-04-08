package com.MIRAI_springboot.MIRAI.Chatt.chatt;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    // ✅ Inject `ChatMessageRepository`
    public ChatService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    // ✅ Store a new message in the database
    public void saveMessage(ChatMessage message) {
        chatMessageRepository.save(message);
    }

    // ✅ Retrieve chat history between two users
    public List<ChatMessage> getChatHistory(Long userId, Long partnerId) {
        return chatMessageRepository.findChatHistory(userId, partnerId);
    }
}
