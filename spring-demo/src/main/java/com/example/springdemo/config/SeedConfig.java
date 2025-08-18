package com.example.springdemo.config;

import com.example.springdemo.model.Activity;
import com.example.springdemo.repo.ActivityRepository;
import com.example.springdemo.repo.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
@Profile({"dev", "local"})
public class SeedConfig {

    @Bean
    @Transactional
    CommandLineRunner seedData(CategoryRepository categories, ActivityRepository activities) {
        return args -> {
            var names = List.of("Reading", "Workout", "Coding", "Meditation", "Study");
            for (var n : names) {
                categories.findByNameIgnoreCase(n)
                        .orElseGet(() -> categories.save(new com.example.springdemo.model.Category(n)));
            }

            if (activities.count() == 0) {
                var reading = categories.findByNameIgnoreCase("Reading").orElseThrow();
                var coding = categories.findByNameIgnoreCase("Coding").orElseThrow();

                var now = LocalDateTime.now();

                var a1 = new Activity(
                        "Read 10 pages",
                        "Atomic Habits",
                        now.minusHours(2),
                        30,
                        reading
                );

                var a2 = new Activity(
                        "Build feature X",
                        "Activities page",
                        now.minusHours(1),
                        90,
                        coding
                );

                activities.saveAll(List.of(a1, a2));
            }
        };
    }
}
