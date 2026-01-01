package gestion_ecole.gestion_academique_springboot.controller;

import gestion_ecole.gestion_academique_springboot.model.Eleve;
import gestion_ecole.gestion_academique_springboot.model.Filiere;
import gestion_ecole.gestion_academique_springboot.service.EleveService;
import gestion_ecole.gestion_academique_springboot.service.FiliereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/eleves")
public class EleveController {

    @Autowired
    private EleveService eleveService;

    @Autowired
    private FiliereService filiereService;

    @GetMapping("/list")
    public String listEleves(Model model) {
        model.addAttribute("eleves", eleveService.findAll());

        model.addAttribute("content", "eleve/list");
        model.addAttribute("title", "Liste des Élèves");
        return "layout/base";  // Return the layout
    }

    @PostMapping("/save")
    public String saveEleve(@ModelAttribute Eleve eleve, @RequestParam Long filiereId) {
        Filiere filiere = filiereService.findById(filiereId);
        eleve.setFiliere(filiere);
        eleveService.save(eleve);
        return "redirect:/eleves/list";
    }

    @GetMapping("/new")
    public String newEleve(Model model) {
        model.addAttribute("eleve", new Eleve());
        model.addAttribute("filieres", filiereService.findAll());
        // CRITICAL: Add layout variable
        model.addAttribute("content", "eleve/form");
        model.addAttribute("title", "Nouvel Élève");
        return "layout/base";
    }

    @GetMapping("/edit/{id}")
    public String editEleve(@PathVariable("id") Long id, Model model) {
        Eleve eleve = eleveService.findById(id);
        model.addAttribute("eleve", eleve);
        model.addAttribute("filieres", filiereService.findAll());

        model.addAttribute("content", "eleve/form");
        model.addAttribute("title", "Modifier Élève");
        return "layout/base";
    }

    @GetMapping("/delete/{id}")
    public String deleteEleve(@PathVariable("id") Long id) {
        eleveService.delete(id);
        return "redirect:/eleves/list";
    }
}