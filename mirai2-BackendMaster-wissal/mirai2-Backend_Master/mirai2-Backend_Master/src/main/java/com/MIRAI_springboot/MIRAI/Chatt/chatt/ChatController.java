package com.MIRAI_springboot.MIRAI.Chatt.chatt;

import com.MIRAI_springboot.MIRAI.Chatt.config.WebSocketEventListener;
import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import com.MIRAI_springboot.MIRAI.entities.superviseur;
import com.MIRAI_springboot.MIRAI.superviseur.SuperviseurService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController

public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final SuperviseurService superviseurService;
    private final ChatService chatService;

    // ✅ Inject Dependencies Correctly
    public ChatController(SimpMessagingTemplate messagingTemplate, SuperviseurService superviseurService, ChatService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.superviseurService = superviseurService;
        this.chatService = chatService;
    }

    // ✅ Send and store messages
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        // ✅ Ensure the message is stored in DB before sending
        chatService.saveMessage(chatMessage);

        // ✅ Send message to the intended receiver via WebSocket
        String destination = "/topic/private." + chatMessage.getReceiverId();
        messagingTemplate.convertAndSend(destination, chatMessage);
    }

    // ✅ Handle User Connection via WebSocket
    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        Long userId = chatMessage.getSenderId();
        Long receiverId = chatMessage.getReceiverId();

        headerAccessor.getSessionAttributes().put("userId", userId);
        headerAccessor.getSessionAttributes().put("receiverId", receiverId);

        // ✅ Add session tracking
        WebSocketEventListener.addUserSession(userId, receiverId);

        // ✅ Notify receiver that user joined
        messagingTemplate.convertAndSend("/topic/private." + receiverId, chatMessage);
    }

    // ✅ Fetch Supervisor of an Intern
    @GetMapping("/stagiaire/{stagiaireId}/supervisor")
    public ResponseEntity<?> getSupervisor(@PathVariable Long stagiaireId) {
        Optional<superviseur> supervisor = superviseurService.getSupervisorByStagiaireId(stagiaireId);
        return supervisor.isPresent()
                ? ResponseEntity.ok(Map.of("supervisorId", supervisor.get().getId()))
                : ResponseEntity.status(404).body("No supervisor found for this intern.");
    }
    public record InternDto(Long id, String username) {}
    // ✅ Fetch all interns assigned to a Supervisor
    // Then in your controller:
    @GetMapping("/supervisor/{supervisorId}/interns")
    public ResponseEntity<List<InternDto>> getInterns(@PathVariable Long supervisorId) {
        List<stagiaire> interns = superviseurService.getInternsBySupervisorId(supervisorId);
        if (interns.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<InternDto> dtos = interns.stream()
                .map(i -> new InternDto(i.getId(), i.getUsername()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // ✅ Retrieve Chat History Between Two Users
    @GetMapping("/history/{userId}/{partnerId}")
    public ResponseEntity<?> getChatHistory(@PathVariable Long userId, @PathVariable Long partnerId) {
        List<ChatMessage> messages = chatService.getChatHistory(userId, partnerId);
        return ResponseEntity.ok(messages);
    }
}
