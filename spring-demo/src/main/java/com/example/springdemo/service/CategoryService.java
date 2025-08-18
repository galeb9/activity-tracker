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

    public CategoryService(CategoryRepository repo) {
        this.repo = repo;
    }

    public List<CategoryDto> all() {
        return repo.findAll().stream().map(this::toDto).toList();
    }

    public CategoryDto byId(Long id) {
        return toDto(getOr404(id));
    }

    public CategoryDto create(CategoryCreateDto req) {
        repo.findByNameIgnoreCase(req.name())
                .ifPresent(x -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Category exists"); });

        var c = repo.save(new Category(req.name()));
        return toDto(c);
    }

    public CategoryDto update(Long id, CategoryCreateDto req) {
        var c = getOr404(id);

        repo.findByNameIgnoreCase(req.name())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(x -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Category exists"); });

        c.setName(req.name());
        return toDto(repo.save(c));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category %d not found".formatted(id));
        }
        repo.deleteById(id);
    }

    public Category getOr404(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Category %d not found".formatted(id)));
    }

    private CategoryDto toDto(Category c) {
        return new CategoryDto(c.getId(), c.getName());
    }
}
