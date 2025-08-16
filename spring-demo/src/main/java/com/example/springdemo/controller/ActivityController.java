package com.example.springdemo.controller;

import com.example.springdemo.dto.*;
import com.example.springdemo.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService svc;

    public ActivityController(ActivityService svc) {
        this.svc = svc;
    }

    @GetMapping
    public List<ActivityDto> getAll() {
        return svc.all();
    }

    @GetMapping("/search")
    public Page<ActivityDto> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) Integer minMinutes,
            @RequestParam(required = false) Integer maxMinutes,
            @PageableDefault(size = 20, sort = {"date", "id"}, direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        return svc.search(q, categoryId, from, to, minMinutes, maxMinutes, pageable);
    }


    @GetMapping("/{id}")
    public ActivityDto getOne(@PathVariable Long id) {
        return svc.byId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActivityDto create(@Valid @RequestBody ActivityCreateDto req) {
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
