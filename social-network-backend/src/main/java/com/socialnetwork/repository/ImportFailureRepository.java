package com.socialnetwork.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.socialnetwork.model.importFailure.ImportFailure;

public interface ImportFailureRepository extends JpaRepository<ImportFailure, Long> {

    @Query(
            "SELECT f FROM ImportFailure f WHERE " + " (f.fileUUID = :fileUUID) "
                    + " AND (:search is null or (lower(f.primaryKey) like lower(concat('%', :search, '%')) "
                    + " or lower(f.reasonValue) like lower(concat('%', :search, '%')) "
                    + " or lower(f.type) like lower(concat('%', :search, '%'))))"
                    + " ORDER BY similarity( f.primaryKey, :search) DESC, similarity(f.reasonValue, :search) DESC, similarity(f.type, :search) DESC")
    List<ImportFailure> getByFilter(String fileUUID, String search, Pageable pageable);

    @Query("SELECT count(f) FROM ImportFailure f WHERE " + " (f.fileUUID = :fileUUID) "
            + " AND (:search is null or (lower(f.primaryKey) like lower(concat('%', :search, '%')) "
            + " or lower(f.reasonValue) like lower(concat('%', :search, '%')) "
            + " or lower(f.type) like lower(concat('%', :search, '%'))))")
    long countAllWithFilter(String fileUUID, String search);

    @Query("SELECT count(f) FROM ImportFailure f WHERE f.fileUUID = :fileUUID and f.type = 'error'")
    int countError(String fileUUID);

    @Query("SELECT count(f) FROM ImportFailure f WHERE f.fileUUID = :fileUUID")
    int countAll(String fileUUID);
}
