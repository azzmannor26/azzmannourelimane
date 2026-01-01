package gestion_ecole.gestion_academique_springboot.controller;

import gestion_ecole.gestion_academique_springboot.model.Cours;
import gestion_ecole.gestion_academique_springboot.model.Filiere;
import gestion_ecole.gestion_academique_springboot.service.CoursService;
import gestion_ecole.gestion_academique_springboot.service.FiliereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/cours")
public class CoursController {

    @Autowired
    private CoursService coursService;

    @Autowired
    private FiliereService filiereService;

    @GetMapping("/list")
    public String listCours(Model model) {
        List<Cours> coursList = coursService.findAllWithFilieres();
        model.addAttribute("cours", coursList);

        model.addAttribute("content", "cours/list");
        model.addAttribute("title", "Liste des Cours");
        return "layout/base";
    }

    @GetMapping("/new")
    public String newCours(Model model) {
        Cours cours = new Cours();
        model.addAttribute("cours", cours);
        model.addAttribute("filieres", filiereService.findAll());

        model.addAttribute("content", "cours/form");
        model.addAttribute("title", "Nouveau Cours");
        return "layout/base";
    }

    @PostMapping("/save")
    public String saveCours(@ModelAttribute Cours cours,
                            @RequestParam(name = "filiereIds", required = false) List<Long> filiereIds) {


        if (cours.getFilieres() == null) {
            cours.setFilieres(new ArrayList<>());
        } else {
            cours.getFilieres().clear();
        }

        if (filiereIds != null && !filiereIds.isEmpty()) {
            for (Long filiereId : filiereIds) {
                Filiere filiere = filiereService.findById(filiereId);
                if (filiere != null) {
                    cours.getFilieres().add(filiere);
                }
            }
        }
        coursService.save(cours);
        return "redirect:/cours/list";
    }

    @GetMapping("/edit/{id}")
    public String editCours(@PathVariable("id") Long id, Model model) {
        Cours cours = coursService.findByIdWithFilieres(id);
        if (cours == null) {
            cours = new Cours();
        }
        model.addAttribute("cours", cours);
        model.addAttribute("filieres", filiereService.findAll());
        // CRITICAL: Add layout variable
        model.addAttribute("content", "cours/form");
        model.addAttribute("title", "Modifier Cours");
        return "layout/base";
    }

    @GetMapping("/delete/{id}")
    public String deleteCours(@PathVariable("id") Long id) {
        coursService.delete(id);
        return "redirect:/cours/list";
    }

    @GetMapping("/associate/{id}")
    public String associateFiliere(@PathVariable("id") Long id, Model model, RedirectAttributes redirectAttributes) {
        // valider id
        if (id == null || id <= 0) {
            redirectAttributes.addFlashAttribute("error", "ID du cours invalide");
            return "redirect:/cours/list";
        }

        Cours cours = coursService.findByIdWithFilieres(id);
        if (cours == null) {
            redirectAttributes.addFlashAttribute("error", "Cours introuvable");
            return "redirect:/cours/list";
        }

        model.addAttribute("cour", cours);
        model.addAttribute("filieres", filiereService.findAll());

        model.addAttribute("content", "cours/associate");
        model.addAttribute("title", "Associer Filières");
        return "layout/base";
    }

    @PostMapping("/associateFiliere")
    public String associateFiliereToCours(@RequestParam("coursId") Long coursId,
                                          @RequestParam(value = "filiereIds", required = false) List<Long> filiereIds) {

        Cours cours = coursService.findById(coursId);
        if (cours == null) {
            return "redirect:/cours/list";
        }


        if (cours.getFilieres() == null) {
            cours.setFilieres(new ArrayList<>());
        }


        cours.getFilieres().clear();


        if (filiereIds != null && !filiereIds.isEmpty()) {
            for (Long filiereId : filiereIds) {
                Filiere filiere = filiereService.findById(filiereId);
                if (filiere != null) {
                    cours.getFilieres().add(filiere);
                }
            }
        }

        coursService.save(cours);
        return "redirect:/cours/list";
    }
}