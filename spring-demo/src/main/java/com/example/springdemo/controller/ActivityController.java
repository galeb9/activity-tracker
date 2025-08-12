// src/main/java/com/example/springdemo/controller/ActivityController.java
package com.example.springdemo.controller;

import com.example.springdemo.model.Activity;
import com.example.springdemo.repo.ActivityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityRepository repo;

    public ActivityController(ActivityRepository repo) {
        this.repo = repo;
    }

    // GET all
    @GetMapping
    public List<Activity> getAll() {
        return repo.findAll();
    }

    // GET by id
    @GetMapping("/{id}")
    public Activity getById(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Activity %d not found".formatted(id)));
    }

    // Create (POST)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Activity create(@RequestBody CreateActivity req) {
        Activity a = new Activity(null, req.name(), req.time(), req.notes());
        return repo.save(a);
    }

    // Simple request DTO (keeps your JSON stable)
    public record CreateActivity(String name, String time, String notes) {}
}
