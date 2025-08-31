package com.finetrack.project.service;

import com.finetrack.project.domain.Card;
import com.finetrack.project.domain.CardRules;
import com.finetrack.project.dto.*;
import com.finetrack.project.repo.CardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CardService {
    private final CardRepository repo;
    private final SecureRandom rnd = new SecureRandom();

    public CardResponse issue(IssueCardRequest r) {
        log.info("Issuing card for project: {}", r.projectId());
        var rules = CardRules.builder()
                .monthlyLimit(r.monthlyLimit())
                .perTxLimit(r.perTxLimit())
                .allowedMcc(r.allowedMcc())
                .build();
        var card = Card.builder()
                .projectId(r.projectId())
                .last4(String.format("%04d", rnd.nextInt(10_000)))
                .rules(rules)
                .status("ACTIVE")
                .build();
        card = repo.save(card);
        return toDto(card);
    }

    public List<CardResponse> getAllCards() {
        return repo.findAll().stream().map(this::toDto).toList();
    }

    public CardResponse get(String id) {
        log.info("Getting card: {}", id);
        return repo.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Card not found: " + id));
    }

    public List<CardResponse> byProject(String projectId) {
        return repo.findByProjectId(projectId).stream().map(this::toDto).toList();
    }

    public CardResponse updateRules(String id, UpdateRulesRequest r) {
        log.info("Updating rules for card: {} with data: {}", id, r);
        var c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found: " + id));

        if (c.getRules() == null) {
            c.setRules(new CardRules());
        }

        if (r.monthlyLimit() != null) c.getRules().setMonthlyLimit(Long.valueOf(r.monthlyLimit()));
        if (r.perTxLimit() != null) c.getRules().setPerTxLimit(Long.valueOf(r.perTxLimit()));
        if (r.allowedMcc() != null) c.getRules().setAllowedMcc(r.allowedMcc());

        var saved = repo.save(c);
        log.info("Rules updated successfully for card: {}", id);
        return toDto(saved);
    }

    public CardResponse changeStatus(String id, String status) {
        log.info("Changing status for card: {} to: {}", id, status);

        // Validate status
        if (!List.of("ACTIVE", "SUSPENDED", "LOST").contains(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        var c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found: " + id));

        c.setStatus(status);
        var saved = repo.save(c);
        log.info("Status changed successfully for card: {} to: {}", id, status);
        return toDto(saved);
    }

    public RulesResponse rules(String id) {
        var c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found: " + id));
        var r = c.getRules();
        return new RulesResponse(c.getId(),
                r != null ? r.getMonthlyLimit() : null,
                r != null ? r.getPerTxLimit() : null,
                r != null ? r.getAllowedMcc() : null);
    }

    private CardResponse toDto(Card c) {
        var r = c.getRules();
        return new CardResponse(
                c.getId(), c.getProjectId(), c.getLast4(), c.getStatus(),
                r != null ? r.getMonthlyLimit() : null,
                r != null ? r.getPerTxLimit() : null,
                r != null ? r.getAllowedMcc() : null
        );
    }
}
