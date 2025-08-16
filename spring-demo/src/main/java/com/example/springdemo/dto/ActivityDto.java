package com.example.springdemo.dto;

import java.time.LocalDateTime;

public record ActivityDto(
        Long id,
        String name,
        String description,
        LocalDateTime startAt,
        Integer durationMinutes,
        Long categoryId,
        String categoryName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
