package com.example.springdemo.dto;

import java.time.LocalDateTime;

public record ActivityUpdateDto(
        String name,
        String description,
        Long categoryId,
        LocalDateTime startAt,
        Integer durationMinutes
) {}
