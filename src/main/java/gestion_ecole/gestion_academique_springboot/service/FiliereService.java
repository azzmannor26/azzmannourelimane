package gestion_ecole.gestion_academique_springboot.service;

import gestion_ecole.gestion_academique_springboot.model.Filiere;
import gestion_ecole.gestion_academique_springboot.repository.FiliereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FiliereService {
    @Autowired
    private FiliereRepository filiereRepository;

    public List<Filiere> findAll() {
        return filiereRepository.findAll();
    }

    public Filiere findById(Long id) {
        return filiereRepository.findById(id).orElse(null);
    }

    public void save(Filiere filiere) {
        filiereRepository.save(filiere);
    }

    public void delete(Long id) {
        filiereRepository.deleteById(id);
    }
}
