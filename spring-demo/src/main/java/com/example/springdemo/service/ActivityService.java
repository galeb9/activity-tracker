package com.example.springdemo.service;

import com.example.springdemo.dto.*;
import com.example.springdemo.model.Activity;
import com.example.springdemo.repo.ActivityRepository;
import com.example.springdemo.repo.ActivitySpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ActivityService {
    private final ActivityRepository repo;
    private final CategoryService categories;

    public ActivityService(ActivityRepository repo, CategoryService categories) {
        this.repo = repo;
        this.categories = categories;
    }

    public List<ActivityDto> all() {
        return repo.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public Page<ActivityDto> search(
            String q, Long categoryId, LocalDate from, LocalDate to,
            Integer minMinutes, Integer maxMinutes,
            Pageable pageable
    ) {
        var spec = ActivitySpecifications.withFilters(q, categoryId, from, to, minMinutes, maxMinutes);
        var p = pageable;
        if (p == null || p.getSort().isUnsorted()) {
            p = PageRequest.of(p == null ? 0 : p.getPageNumber(),
                    p == null ? 20 : p.getPageSize(),
                    Sort.by(Sort.Direction.DESC, "date").and(Sort.by("id").descending()));
        }
        return repo.findAll(spec, p).map(this::toDto);
    }

    public ActivityDto byId(Long id) {
        return toDto(getOr404(id));
    }

    public ActivityDto create(ActivityCreateDto req) {
        var cat = categories.getOr404(req.categoryId());
        var a = repo.save(new Activity(req.name(), req.description(), req.date(), req.durationMinutes(), cat));
        return toDto(a);
    }

    public ActivityDto update(Long id, ActivityUpdateDto req) {
        var a = getOr404(id);
        if (req.name() != null) a.setName(req.name());
        if (req.description() != null) a.setDescription(req.description());
        if (req.date() != null) a.setDate(req.date());
        if (req.durationMinutes() != null) a.setDurationMinutes(req.durationMinutes());
        if (req.categoryId() != null) a.setCategory(categories.getOr404(req.categoryId()));
        return toDto(repo.save(a));
    }

    public void delete(Long id) {
        if (!repo.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity %d not found".formatted(id));
        repo.deleteById(id);
    }

    private Activity getOr404(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity %d not found".formatted(id)));
    }

    private ActivityDto toDto(Activity a) {
        return new ActivityDto(
                a.getId(), a.getName(), a.getDescription(), a.getDate(), a.getDurationMinutes(),
                a.getCategory().getId(), a.getCategory().getName()
        );
    }
}
