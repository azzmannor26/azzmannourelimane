package gestion_ecole.gestion_academique_springboot.controller;

import gestion_ecole.gestion_academique_springboot.model.DossierAdministratif;
import gestion_ecole.gestion_academique_springboot.model.Eleve;
import gestion_ecole.gestion_academique_springboot.service.DossierService;
import gestion_ecole.gestion_academique_springboot.service.EleveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Controller
@RequestMapping("/dossiers")
public class DossierController {

    @Autowired
    private DossierService dossierService;

    @Autowired
    private EleveService eleveService;

    @GetMapping("/list")
    public String listDossiers(Model model) {
        model.addAttribute("dossiers", dossierService.findAllWithEleves());
        model.addAttribute("content", "dossier/list");
        model.addAttribute("title", "Gestion des Dossiers");
        return "layout/base";
    }

    @GetMapping("/new")
    public String newDossier(Model model) {
        DossierAdministratif dossier = new DossierAdministratif();
        dossier.setDateCreation(LocalDate.now());

        model.addAttribute("dossier", dossier);
        model.addAttribute("eleves", eleveService.findAll());
        model.addAttribute("content", "dossier/form");
        model.addAttribute("title", "Nouveau Dossier");
        return "layout/base";
    }

    @PostMapping("/save")
    public String saveDossier(@ModelAttribute DossierAdministratif dossier,
                              @RequestParam("eleveId") Long eleveId) {
        Eleve eleve = eleveService.findById(eleveId);
        if (eleve != null) {
            dossier.setEleve(eleve);
            dossierService.save(dossier);
        }
        return "redirect:/dossiers/list";
    }

    @GetMapping("/edit/{id}")
    public String editDossier(@PathVariable("id") Long id, Model model) {
        DossierAdministratif dossier = dossierService.findByIdWithEleve(id);
        if (dossier == null) {
            return "redirect:/dossiers/list";
        }
        model.addAttribute("dossier", dossier);
        model.addAttribute("eleves", eleveService.findAll());
        model.addAttribute("content", "dossier/form");
        model.addAttribute("title", "Modifier Dossier");
        return "layout/base";
    }

    @GetMapping("/delete/{id}")
    public String deleteDossier(@PathVariable("id") Long id) {
        dossierService.delete(id);
        return "redirect:/dossiers/list";
    }
}