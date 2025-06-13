package com.socialnetwork.model.news;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.socialnetwork.model.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Comment extends Auditable {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private String UUID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Post post;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_uuid", referencedColumnName = "UUID")
    private Content content;
}
