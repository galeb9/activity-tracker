package com.example.springdemo.service;

import com.example.springdemo.dto.CategoryCreateDto;
import com.example.springdemo.dto.CategoryDto;
import com.example.springdemo.model.Category;
import com.example.springdemo.repo.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class CategoryService {
    private final CategoryRepository repo;
    public CategoryService(CategoryRepository repo) { this.repo = repo; }

    public List<CategoryDto> all() { return repo.findAll().stream().map(c -> new CategoryDto(c.getId(), c.getName())).toList(); }

    public CategoryDto create(CategoryCreateDto req) {
        repo.findByNameIgnoreCase(req.name()).ifPresent(x -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Category exists"); });
        var c = repo.save(new Category(req.name()));
        return new CategoryDto(c.getId(), c.getName());
    }

    public Category getOr404(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category %d not found".formatted(id)));
    }
}
