package com.example.springdemo.dto;

import java.time.LocalDate;

public record ActivityUpdateDto(
        String name,
        String description,
        Long categoryId,
        LocalDate date,
        Integer durationMinutes
) {}
