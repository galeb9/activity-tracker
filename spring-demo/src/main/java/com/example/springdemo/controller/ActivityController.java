package com.example.springdemo.controller;

import com.example.springdemo.dto.*;
import com.example.springdemo.service.ActivityService;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService svc;

    public ActivityController(ActivityService svc) {
        this.svc = svc;
    }

    @GetMapping
    public Page<ActivityDto> getAll(@PageableDefault(size = 20, sort = {"startAt", "id"}, direction = Sort.Direction.DESC) Pageable pageable) {
        return svc.search(null, null, null, null, null, null, pageable);
    }

    @GetMapping("/{id}")
    public ActivityDto getOne(@PathVariable Long id) {
        return svc.byId(id);
    }

    @GetMapping("/search")
    public Page<ActivityDto> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) Integer minMinutes,
            @RequestParam(required = false) Integer maxMinutes,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return svc.search(q, categoryId, from, to, minMinutes, maxMinutes, pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActivityDto create(@RequestBody ActivityCreateDto req) {
        return svc.create(req);
    }

    @PutMapping("/{id}")
    public ActivityDto update(@PathVariable Long id, @RequestBody ActivityUpdateDto req) {
        return svc.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        svc.delete(id);
    }
}
