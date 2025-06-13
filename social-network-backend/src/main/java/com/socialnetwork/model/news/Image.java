package com.socialnetwork.model.news;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.socialnetwork.model.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "images")
public class Image extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "uuid")
    private String UUID;

    @Column(name = "name_image")
    private String name;

    @Column(name = "url_image")
    private String url;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "content_uuid", referencedColumnName = "UUID")
    @JsonIgnore
    private Content content;
}