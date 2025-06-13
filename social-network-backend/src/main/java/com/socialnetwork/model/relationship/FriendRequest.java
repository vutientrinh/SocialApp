package com.socialnetwork.model.relationship;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.socialnetwork.model.Auditable;
import com.socialnetwork.model.enums.RequestStatus;
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
public class FriendRequest extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String UUID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @JsonIgnore
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @JsonIgnore
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RequestStatus status;
}
