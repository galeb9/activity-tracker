// src/main/java/com/example/springdemo/repo/ActivitySpecifications.java
package com.example.springdemo.repo;

import com.example.springdemo.model.Activity;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;

public class ActivitySpecifications {

    public static Specification<Activity> withFilters(
            String q,
            Long categoryId,
            LocalDate from,
            LocalDate to,
            Integer minMinutes,
            Integer maxMinutes
    ) {
        return (root, query, cb) -> {
            var preds = new ArrayList<Predicate>();

            if (q != null && !q.isBlank()) {
                var like = "%" + q.toLowerCase() + "%";
                preds.add(
                        cb.or(
                                cb.like(cb.lower(root.get("name")), like),
                                cb.like(cb.lower(root.get("description")), like)
                        )
                );
            }
            if (categoryId != null) {
                var cat = root.join("category", JoinType.INNER);
                preds.add(cb.equal(cat.get("id"), categoryId));
            }
            if (from != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("startAt"), LocalDateTime.of(from, LocalTime.MIN)));
            }
            if (to != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("startAt"), LocalDateTime.of(to, LocalTime.MAX)));
            }
            if (minMinutes != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("durationMinutes"), minMinutes));
            }
            if (maxMinutes != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("durationMinutes"), maxMinutes));
            }
            return cb.and(preds.toArray(new Predicate[0]));
        };
    }
}
