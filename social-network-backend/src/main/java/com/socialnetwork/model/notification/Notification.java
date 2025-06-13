package com.socialnetwork.model.notification;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.socialnetwork.model.enums.ENotificationStatus;
import com.socialnetwork.model.enums.ENotificationType;
import com.socialnetwork.model.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification {

    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private String UUID;

    private ENotificationStatus status;

    private String title;

    private String message;

    private String imagesUrl;

    @Enumerated(EnumType.STRING)
    private ENotificationType type;

    private LocalDateTime createdAt;

    private Boolean unread;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private User receiver;
}
