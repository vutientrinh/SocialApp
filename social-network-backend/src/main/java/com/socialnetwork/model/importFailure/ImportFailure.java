package com.socialnetwork.model.importFailure;

import java.util.Objects;

import jakarta.persistence.*;

import com.socialnetwork.model.enums.ImportFailureType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "import_failure")
@NoArgsConstructor
@AllArgsConstructor
public class ImportFailure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "primary_key")
    private String primaryKey;

    @Column(name = "reason_key")
    private String reasonKey;

    @Column(name = "reason_value")
    private String reasonValue;

    @Column(name = "file_uuid")
    private String fileUUID;

    private String type;

    @Transient
    private String reason;

    public ImportFailure(String primaryKey, String reasonKey, String reasonValue, String type) {
        this.primaryKey = primaryKey;
        this.reasonKey = reasonKey;
        this.reasonValue = reasonValue;
        this.type = type;
    }

    public ImportFailure(ImportFailureType type, String reasonKey, String... reasonValues) {
        this.type = type.getValue();
        this.reasonKey = reasonKey;

        if (reasonValues.length == 1) {
            this.reasonValue = reasonValues[0];
        } else if (reasonValues.length > 1) {
            this.reasonValue = String.join("###", reasonValues);
        }
    }

    public String toString() {
        return String.format("%s (%s): %s", primaryKey, type, reason);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ImportFailure that = (ImportFailure) o;
        return Objects.equals(reasonKey, that.reasonKey)
                && Objects.equals(reasonValue, that.reasonValue)
                && Objects.equals(fileUUID, that.fileUUID)
                && Objects.equals(type, that.type);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reasonKey, reasonValue, fileUUID, type);
    }
}
