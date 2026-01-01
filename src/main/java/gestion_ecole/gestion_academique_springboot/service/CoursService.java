package gestion_ecole.gestion_academique_springboot.service;

import gestion_ecole.gestion_academique_springboot.model.Cours;
import gestion_ecole.gestion_academique_springboot.repository.CoursRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CoursService {

    @Autowired
    private CoursRepository coursRepository;

    public List<Cours> findAll() {
        return coursRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Cours> findAllWithFilieres() {
        return coursRepository.findAllWithFilieres();
    }

    @Transactional(readOnly = true)
    public Cours findByIdWithFilieres(Long id) {
        return coursRepository.findByIdWithFilieres(id).orElse(null);
    }

    public Cours findById(Long id) {
        return coursRepository.findById(id).orElse(null);
    }

    @Transactional
    public Cours save(Cours cours) {
        return coursRepository.save(cours);
    }

    @Transactional
    public void delete(Long id) {
        coursRepository.deleteById(id);
    }
}