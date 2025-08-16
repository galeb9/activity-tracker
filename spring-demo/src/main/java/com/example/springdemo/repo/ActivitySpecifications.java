// src/main/java/com/example/springdemo/repo/ActivitySpecifications.java
package com.example.springdemo.repo;

import com.example.springdemo.model.Activity;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
            List<Predicate> preds = new ArrayList<>();

            if (q != null && !q.isBlank()) {
                String like = "%" + q.toLowerCase() + "%";
                preds.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }

            if (categoryId != null) {
                var cat = root.join("category", JoinType.INNER);
                preds.add(cb.equal(cat.get("id"), categoryId));
            }

            if (from != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("date"), from));
            }
            if (to != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("date"), to));
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
