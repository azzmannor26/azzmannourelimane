package gestion_ecole.gestion_academique_springboot.controller;

import gestion_ecole.gestion_academique_springboot.model.Filiere;
import gestion_ecole.gestion_academique_springboot.service.FiliereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/filieres")
public class FiliereController {

    @Autowired
    private FiliereService filiereService;

    @GetMapping("/list")
    public String listFilieres(Model model) {
        model.addAttribute("filieres", filiereService.findAll());

        model.addAttribute("content", "filiere/list");
        model.addAttribute("title", "Liste des Filières");
        return "layout/base";  
    }

    @GetMapping("/new")
    public String newFiliere(Model model) {
        model.addAttribute("filiere", new Filiere());

        model.addAttribute("content", "filiere/form");
        model.addAttribute("title", "Nouvelle Filière");
        return "layout/base";
    }

    @PostMapping("/save")
    public String saveFiliere(@ModelAttribute Filiere filiere) {
        filiereService.save(filiere);
        return "redirect:/filieres/list";
    }


    @GetMapping("/edit/{id}")
    public String editFiliere(@PathVariable("id") Long id, Model model) {
        Filiere filiere = filiereService.findById(id);
        model.addAttribute("filiere", filiere);

        model.addAttribute("content", "filiere/form");
        model.addAttribute("title", "Modifier Filière");
        return "layout/base";
    }


    @GetMapping("/delete/{id}")
    public String deleteFiliere(@PathVariable("id") Long id) {
        filiereService.delete(id);
        return "redirect:/filieres/list";
    }
}