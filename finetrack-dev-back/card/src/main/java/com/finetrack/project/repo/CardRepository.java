package com.finetrack.project.repo;

import com.finetrack.project.domain.Card;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CardRepository extends MongoRepository<Card, String> {
    List<Card> findByProjectId(String projectId);
}
