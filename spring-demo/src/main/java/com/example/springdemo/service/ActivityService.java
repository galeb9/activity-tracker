package com.example.springdemo.service;

import com.example.springdemo.dto.*;
import com.example.springdemo.model.Activity;
import com.example.springdemo.repo.ActivityRepository;
import com.example.springdemo.repo.ActivitySpecifications;
import org.springframework.data.domain.*;
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
        return repo.findAll(Sort.by(Sort.Order.desc("startAt"), Sort.Order.desc("id")))
                .stream().map(this::toDto).toList();
    }

    public ActivityDto byId(Long id) {
        return toDto(getOr404(id));
    }

    public ActivityDto create(ActivityCreateDto req) {
        var cat = categories.getOr404(req.categoryId());
        var a = new Activity(req.name(), req.description(), req.startAt(), req.durationMinutes(), cat);
        return toDto(repo.save(a));
    }

    public ActivityDto update(Long id, ActivityUpdateDto req) {
        var a = getOr404(id);
        if (req.name() != null) a.setName(req.name());
        if (req.description() != null) a.setDescription(req.description());
        if (req.startAt() != null) a.setStartAt(req.startAt());
        if (req.durationMinutes() != null) a.setDurationMinutes(req.durationMinutes());
        if (req.categoryId() != null) a.setCategory(categories.getOr404(req.categoryId()));
        return toDto(repo.save(a));
    }

    public void delete(Long id) {
        if (!repo.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity %d not found".formatted(id));
        repo.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<ActivityDto> search(
            String q,
            Long categoryId,
            LocalDate from,
            LocalDate to,
            Integer minMinutes,
            Integer maxMinutes,
            Pageable pageable
    ) {
        var spec = ActivitySpecifications.withFilters(q, categoryId, from, to, minMinutes, maxMinutes);
        var p = pageable == null || pageable.getSort().isUnsorted()
                ? PageRequest.of(pageable == null ? 0 : pageable.getPageNumber(),
                pageable == null ? 20 : pageable.getPageSize(),
                Sort.by(Sort.Order.desc("startAt"), Sort.Order.desc("id")))
                : pageable;

        return repo.findAll(spec, p).map(this::toDto);
    }

    private Activity getOr404(Long id) {
        return repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Activity %d not found".formatted(id)));
    }

    private ActivityDto toDto(Activity a) {
        return new ActivityDto(
                a.getId(),
                a.getName(),
                a.getDescription(),
                a.getStartAt(),
                a.getDurationMinutes(),
                a.getCategory().getId(),
                a.getCategory().getName(),
                a.getCreatedAt(),
                a.getUpdatedAt()
        );
    }
}
