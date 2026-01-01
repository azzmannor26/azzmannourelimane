package gestion_ecole.gestion_academique_springboot.service;

import gestion_ecole.gestion_academique_springboot.model.Eleve;
import gestion_ecole.gestion_academique_springboot.repository.EleveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EleveService {
    @Autowired
    private EleveRepository eleveRepository;

    public List<Eleve> findAll() {
        return eleveRepository.findAll();
    }

    public Eleve findById(Long id) {
        return eleveRepository.findById(id).orElse(null);
    }

    public void save(Eleve eleve) {
        eleveRepository.save(eleve);
    }

    public void delete(Long id) {
        eleveRepository.deleteById(id);
    }
}
