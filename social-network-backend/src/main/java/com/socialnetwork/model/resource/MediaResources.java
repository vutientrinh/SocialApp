package com.socialnetwork.model.resource;

import com.socialnetwork.model.Auditable;
import com.socialnetwork.model.enums.EFileType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class MediaResources extends Auditable {
    @Id
    @Column(name = "file_UUID", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private String UUID;

    @Column(name = "file_name")
    private String fileName;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_type")
    private EFileType fileType;

    @Column(name = "is_external")
    private boolean external;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_description")
    private String fileDescription;

    @Column(name = "file_thumbnail")
    private String fileThumbnail;

    @Column(name = "is_success")
    private boolean success;
}
