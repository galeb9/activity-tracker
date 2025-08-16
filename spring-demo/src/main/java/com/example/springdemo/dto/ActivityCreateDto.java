package com.example.springdemo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ActivityCreateDto(
        @NotBlank String name,
        String description,
        @NotNull Long categoryId,
        @NotNull LocalDateTime startAt,
        @Positive Integer durationMinutes
) {
}
