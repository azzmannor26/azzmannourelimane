package com.finetrack.gateway.repo;


import com.finetrack.gateway.model.RefreshToken;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface RefreshTokenRepository extends ReactiveMongoRepository<RefreshToken, String> {
    Mono<RefreshToken> findByToken(String token);
}

