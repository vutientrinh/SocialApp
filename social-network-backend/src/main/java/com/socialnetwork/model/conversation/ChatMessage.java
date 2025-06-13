package com.socialnetwork.model.conversation;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.socialnetwork.model.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private String UUID;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_uuid", referencedColumnName = "UUID")
    private User senderUUID;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_uuid", referencedColumnName = "UUID")
    private User receiverUUID;

    @OneToMany(mappedBy = "chatMessageUUID", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Thread> threads;

    @Column(name = "last_uploaded_at")
    private LocalDateTime lastUploadedAt;
}
