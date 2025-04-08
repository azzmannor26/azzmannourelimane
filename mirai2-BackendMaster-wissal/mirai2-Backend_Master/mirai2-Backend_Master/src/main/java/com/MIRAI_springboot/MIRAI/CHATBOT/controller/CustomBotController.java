package com.MIRAI_springboot.MIRAI.CHATBOT.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/bot")
public class CustomBotController {

    private static final Logger logger = LoggerFactory.getLogger(CustomBotController.class);

    private static final Map<String, String> predefinedAnswers = new HashMap<>();

    static {
        // ✅ Greetings
        predefinedAnswers.put("hello", "Hello! How can I assist you today?");
        predefinedAnswers.put("hi", "Hi there! How can I help you?");
        predefinedAnswers.put("hey", "Hey! What can I do for you?");
        predefinedAnswers.put("good morning", "Good morning! How's your day going?");
        predefinedAnswers.put("good afternoon", "Good afternoon! How can I assist you?");
        predefinedAnswers.put("good evening", "Good evening! How can I help?");
        predefinedAnswers.put("how are you", "I'm just a chatbot, but I'm here to help! What do you need?");

        // ✅ General Assistance
        predefinedAnswers.put("how can you help me", "I can assist you with internship-related questions, document submissions, certificate requests, and more! Just ask.");
        predefinedAnswers.put("what can you do", "I can provide guidance on submitting reports, requesting certificates, improving your performance, and other internship-related topics.");
        predefinedAnswers.put("i need help", "Sure! Please let me know what you need help with.");

        // ✅ Internship & Document Questions
        predefinedAnswers.put("how can i submit my report", "Go to the documents section, upload your file, and wait for your supervisor to validate it.");
        predefinedAnswers.put("how can i ask for my certificate", "Go to the documents section, check 'Certificate,' and submit a request to ask for it.");
        predefinedAnswers.put("how can i improve from my performance as an intern", "Seek feedback from your supervisor, set measurable goals, and work on consistent learning and time management.");

        // ✅ Miscellaneous
        predefinedAnswers.put("thank you", "You're welcome! Let me know if you need anything else.");
        predefinedAnswers.put("thanks", "No problem! Happy to help.");
        predefinedAnswers.put("bye", "Goodbye! Have a great day ahead.");
        predefinedAnswers.put("see you later", "See you later! Don't hesitate to reach out if you need anything.");
    }


    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/chat")
    public ResponseEntity<String> chat(
            @RequestParam("prompt") String question,
            @RequestHeader("Authorization") String authorizationHeader) {  // ✅ Change from @RequestAttribute to @RequestHeader

        logger.info("Received question: '{}'", question);

        // ✅ Extract role from token
        String role = extractUserRoleFromToken(authorizationHeader);

        if (!isAuthenticated(role)) {
            logger.warn("Unauthorized access attempt with role: '{}'", role);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: User not authorized.");
        }

        // ✅ Normalize the question
        String normalizedQuestion = normalizeQuestion(question);

        // ✅ Check for predefined answers
        if (predefinedAnswers.containsKey(normalizedQuestion)) {
            logger.info("Returning predefined answer for question: '{}'", normalizedQuestion);
            return ResponseEntity.ok(predefinedAnswers.get(normalizedQuestion));
        }

        // ✅ Query Hugging Face API for dynamic answers
        String answer = getAnswerFromHuggingFace(question);
        return ResponseEntity.ok(answer);
    }

    // ✅ Function to Extract Role from Token (Replace with JWT Parser)
    private String extractUserRoleFromToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        try {
            String token = authorizationHeader.substring(7);
            // ✅ Decode Token (Replace with actual JWT Parsing Logic)
            String[] tokenParts = token.split("\\.");
            String payload = new String(java.util.Base64.getDecoder().decode(tokenParts[1]));
            JsonNode jsonNode = objectMapper.readTree(payload);
            return jsonNode.get("role").asText();
        } catch (Exception e) {
            logger.error("Failed to extract role from token", e);
            return null;
        }
    }


    private boolean isAuthenticated(String role) {
        return role != null && (
                role.equalsIgnoreCase("SUPERVISEUR") ||
                        role.equalsIgnoreCase("RH") ||
                        role.equalsIgnoreCase("STAGIAIRE")
        );
    }

    private String normalizeQuestion(String question) {
        return question.trim().toLowerCase().replaceAll("[^a-z0-9 ]", "");
    }

    private String getAnswerFromHuggingFace(String question) {
        // Create payload for Hugging Face
        Map<String, Object> payload = Map.of(
                "inputs", question,
                "parameters", Map.of(
                        "temperature", 0.0, // Factual and deterministic
                        "max_length", 100,  // Allow sufficient response length
                        "top_p", 1.0,
                        "top_k", 50
                )
        );

        int maxRetries = 3;
        int retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                // Send the request to Hugging Face API
                ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, payload, String.class);

                if (response.getStatusCode() == HttpStatus.OK) {
                    String responseBody = response.getBody();
                    JsonNode root = objectMapper.readTree(responseBody);

                    if (root.isArray() && root.size() > 0) {
                        JsonNode firstNode = root.get(0);
                        if (firstNode.has("generated_text")) {
                            return firstNode.get("generated_text").asText("No answer found.");
                        }
                    }
                    logger.warn("Unexpected response structure from Hugging Face API: {}", responseBody);
                    return "I couldn't find an answer. Please try again.";
                } else if (response.getStatusCode() == HttpStatus.SERVICE_UNAVAILABLE) {
                    logger.warn("Hugging Face model is loading. Retrying...");
                    Thread.sleep(5000); // Wait for 5 seconds before retrying
                    retryCount++;
                } else {
                    logger.error("Hugging Face API call failed with status: {}", response.getStatusCode());
                    return "Error: Unable to retrieve answer.";
                }
            } catch (Exception e) {
                logger.error("Failed to call Hugging Face API", e);
                return "Error: Unable to retrieve answer.";
            }
        }

        logger.error("Max retries reached for Hugging Face API.");
        return "Error: Unable to retrieve answer after multiple attempts.";
    }



}
