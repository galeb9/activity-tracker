package com.example.springdemo.dto;

import java.time.LocalDate;

public record ActivityDto(
        Long id,
        String name,
        String description,
        LocalDate date,
        Integer durationMinutes,
        Long categoryId,
        String categoryName
) {}
