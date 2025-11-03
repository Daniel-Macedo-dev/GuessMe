package com.guessme.guessme.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class GameService {

    private final WebClient webClient;

    public GameService(@Value("${OPENAI_API_KEY}") String openAiKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader("Authorization", "Bearer " + openAiKey)
                .build();
    }

    public Mono<String> askAI(String question) {
        String body = "{"
                + "\"model\": \"gpt-3.5-turbo\","
                + "\"messages\": [{\"role\": \"user\", \"content\": \"" + escapeJson(question) + "\"}]"
                + "}";

        return webClient.post()
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class);
    }

    private String escapeJson(String text) {
        return text.replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}
