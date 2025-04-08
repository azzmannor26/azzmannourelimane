package com.MIRAI_springboot.MIRAI.CHATBOT.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HuggingFaceResponse {

    @JsonProperty("generated_text")
    private String generatedText;

    public String getGeneratedText() {
        return generatedText;
    }

    public void setGeneratedText(String generatedText) {
        this.generatedText = generatedText;
    }
}
