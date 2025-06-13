package com.socialnetwork.model.relationship;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.socialnetwork.model.Auditable;
import com.socialnetwork.model.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Friend extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String UUID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @JsonIgnore
    private User user; // current user

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @JsonIgnore
    private User friend; // friend of current user

    @Column(name = "is_active", nullable = false)
    private boolean isActive; // friend is active or not
}
