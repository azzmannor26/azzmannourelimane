package com.MIRAI_springboot.MIRAI.Chatt.config;

import com.MIRAI_springboot.MIRAI.Chatt.chatt.ChatMessage;
import com.MIRAI_springboot.MIRAI.Chatt.chatt.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    // **Track active users and their assigned supervisors**
    private static final Map<Long, Long> activeUsers = new ConcurrentHashMap<>();

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        Object senderObj = headerAccessor.getSessionAttributes().get("userId");
        Object receiverObj = headerAccessor.getSessionAttributes().get("receiverId");

        if (senderObj instanceof String) senderObj = Long.parseLong((String) senderObj);
        if (receiverObj instanceof String) receiverObj = Long.parseLong((String) receiverObj);

        Long senderId = (Long) senderObj;
        Long receiverId = (Long) receiverObj;

        if (senderId != null && receiverId != null) {
            log.info("User disconnected: {}", senderId);

            // ✅ Remove user from active sessions
            activeUsers.remove(senderId);

            // ✅ Notify ONLY the assigned receiver
            var chatMessage = new ChatMessage();
            chatMessage.setSenderId(senderId);
            chatMessage.setReceiverId(receiverId);
            chatMessage.setType(MessageType.LEAVE);
            chatMessage.setContent("User " + senderId + " has left the chat.");

            messagingTemplate.convertAndSend("/topic/private." + receiverId, chatMessage);
        }
    }

    // ✅ Store user-session mapping (Intern-Supervisor pair)
    public static void addUserSession(Long userId, Long receiverId) {
        activeUsers.put(userId, receiverId);
    }
}
