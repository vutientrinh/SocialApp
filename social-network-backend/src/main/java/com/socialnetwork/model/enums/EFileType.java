package com.socialnetwork.model.enums;

import lombok.Getter;

@Getter
public enum EFileType {
    PNG("image", ".png"),
    JPG("image", ".jpg"),
    MP4("video", ".mp4"),
    MP3("audio", ".mp3"),
    PDF("document", ".pdf"),
    DOCX("document", ".docx"),
    XLSX("document", ".xlsx"),
    TXT("document", ".txt"),
    ZIP("archive", ".zip"),
    RAR("archive", ".rar");

    private final String type;
    private final String extension;

    EFileType(String type, String extension) {
        this.type = type;
        this.extension = extension;
    }

    public String getExtension() {
        return extension;
    }

    public static EFileType toExtension(String fileExtension) {
        for (EFileType eFileType : EFileType.values()) {
            if (eFileType.getExtension().equals(fileExtension)) {
                return eFileType;
            }
        }
        return null;
    }
}

