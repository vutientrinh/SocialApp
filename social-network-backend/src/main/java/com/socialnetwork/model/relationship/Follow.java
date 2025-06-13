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
@NoArgsConstructor
@AllArgsConstructor
public class Follow extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JsonIgnore
    private String UUID;

    @Column(name = "is_blocked")
    private boolean isBlocked;

    @Column(name = "is_muted")
    private boolean isMuted;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @JsonIgnore
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @JsonIgnore
    private User following;
}
