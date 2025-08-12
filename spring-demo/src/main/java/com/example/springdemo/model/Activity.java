package com.example.springdemo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String time;   // keep as String for now; swap to LocalDateTime later
    private String notes;

    public Activity() {}  // JPA needs it

    public Activity(Long id, String name, String time, String notes) {
        this.id = id;
        this.name = name;
        this.time = time;
        this.notes = notes;
    }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
