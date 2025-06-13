package com.socialnetwork.model.conversation;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.socialnetwork.model.news.Content;
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
public class Thread {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private String UUID;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chat_message_uuid", referencedColumnName = "UUID")
    @JsonBackReference
    private ChatMessage chatMessageUUID;

    private String senderUUID;


    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "content_uuid", referencedColumnName = "UUID")
    private Content content;

    @Column(name = "time_stamps")
    private LocalDateTime timeStamps;
}
