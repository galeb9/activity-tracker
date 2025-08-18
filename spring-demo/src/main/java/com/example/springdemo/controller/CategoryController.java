package com.example.springdemo.controller;

import com.example.springdemo.dto.CategoryCreateDto;
import com.example.springdemo.dto.CategoryDto;
import com.example.springdemo.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService svc;
    public CategoryController(CategoryService svc) { this.svc = svc; }

    @GetMapping
    public List<CategoryDto> getAll() { return svc.all(); }

    @GetMapping("/{id}")
    public CategoryDto getOne(@PathVariable Long id) { return svc.byId(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDto create(@Valid @RequestBody CategoryCreateDto req) { return svc.create(req); }

    @PutMapping("/{id}")
    public CategoryDto update(@PathVariable Long id, @Valid @RequestBody CategoryCreateDto req) {
        return svc.update(id, req); // reuse create DTO (only 'name'), or make a CategoryUpdateDto if you prefer
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { svc.delete(id); }
}