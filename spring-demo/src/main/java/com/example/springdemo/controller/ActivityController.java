package com.example.springdemo.controller;

import com.example.springdemo.dto.*;
import com.example.springdemo.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService svc;
    public ActivityController(ActivityService svc) { this.svc = svc; }

    @GetMapping
    public List<ActivityDto> getAll() { return svc.all(); }

    @GetMapping("/{id}")
    public ActivityDto getOne(@PathVariable Long id) { return svc.byId(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActivityDto create(@Valid @RequestBody ActivityCreateDto req) { return svc.create(req); }

    @PutMapping("/{id}")
    public ActivityDto update(@PathVariable Long id, @RequestBody ActivityUpdateDto req) { return svc.update(id, req); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { svc.delete(id); }
}
