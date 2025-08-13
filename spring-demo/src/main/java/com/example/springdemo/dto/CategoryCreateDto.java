package com.example.springdemo.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryCreateDto(@NotBlank String name) {}
