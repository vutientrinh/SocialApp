package com.socialnetwork.model.news;

import com.socialnetwork.model.Auditable;
import com.socialnetwork.model.resource.MediaResources;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Content extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String UUID;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "file_uuid", referencedColumnName = "file_UUID")
    private MediaResources fileUUID;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

//    @JsonIgnore
    @OneToMany(mappedBy = "content", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Image> ImageURLs;
}
