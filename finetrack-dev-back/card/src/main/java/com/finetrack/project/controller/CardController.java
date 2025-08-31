package com.finetrack.project.controller;

import com.finetrack.project.dto.*;
import com.finetrack.project.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
@Slf4j
public class CardController {

    private final CardService svc;

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<CardResponse> issue(@RequestBody @Valid IssueCardRequest req) {
        log.info("Issuing card for project: {}", req.projectId());
        var out = svc.issue(req);
        return ResponseEntity.created(URI.create("/api/cards/" + out.id())).body(out);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN','EMPLOYEE')")
    public CardResponse one(@PathVariable String id) {
        log.info("Getting card: {}", id);
        return svc.get(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN','EMPLOYEE')")
    public List<CardResponse> byProject(@RequestParam String projectId) {
        log.info("Getting cards for project: {}", projectId);
        return svc.byProject(projectId);
    }

    @PatchMapping("/{id}/rules")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public CardResponse updateRules(@PathVariable String id, @RequestBody @Valid UpdateRulesRequest req) {
        log.info("Updating rules for card: {} with data: {}", id, req);
        return svc.updateRules(id, req);
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public List<CardResponse> getAllCardsForManager() {
        log.info("Getting all cards for manager");
        return svc.getAllCards();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public CardResponse status(@PathVariable String id, @RequestBody @Valid ChangeStatusRequest req) {
        log.info("Changing status for card: {} to: {}", id, req.status());
        return svc.changeStatus(id, req.status());
    }

    @GetMapping("/{id}/rules")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN','EMPLOYEE')")
    public RulesResponse rules(@PathVariable String id) {
        log.info("Getting rules for card: {}", id);
        return svc.rules(id);
    }
}
