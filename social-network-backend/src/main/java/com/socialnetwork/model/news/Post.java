package com.socialnetwork.model.news;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.socialnetwork.model.PostFolder.PostFolder;
import com.socialnetwork.model.enums.EStatusPost;
import com.socialnetwork.model.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private String UUID;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Content content;

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Reaction> reactions = new ArrayList<>();

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_uuid", referencedColumnName = "UUID")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EStatusPost status;

    @Column(name = "created_date_at")
    private LocalDateTime createdDateAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_uuid", referencedColumnName = "UUID")
    @JsonIgnore
    private PostFolder folder;
}
