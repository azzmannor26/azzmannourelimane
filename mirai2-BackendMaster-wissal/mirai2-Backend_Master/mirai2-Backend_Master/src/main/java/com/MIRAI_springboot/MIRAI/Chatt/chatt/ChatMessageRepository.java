package com.MIRAI_springboot.MIRAI.Chatt.chatt;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // ✅ Fetch all messages between two users (intern & supervisor)
    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.senderId = :userId AND m.receiverId = :partnerId) OR " +
            "(m.senderId = :partnerId AND m.receiverId = :userId) " +
            "ORDER BY m.timestamp")
    List<ChatMessage> findChatHistory(@Param("userId") Long userId, @Param("partnerId") Long partnerId);
}
