package com.finetrack.project.repo;

import com.finetrack.project.domain.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<Project, String> {}
