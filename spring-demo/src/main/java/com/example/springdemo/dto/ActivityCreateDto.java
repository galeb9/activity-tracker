package com.example.springdemo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public record ActivityCreateDto(
        @NotBlank String name,
        String description,
        @NotNull Long categoryId,
        @NotNull LocalDate date,
        @Positive Integer durationMinutes
) {}
