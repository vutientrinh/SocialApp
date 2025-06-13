package com.socialnetwork.repository;

import com.socialnetwork.model.enums.EGender;
import com.socialnetwork.model.user.Profile;
import com.socialnetwork.model.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Transactional
public interface ProfileRepository extends JpaRepository<Profile, String> {

    @Query("SELECT p FROM Profile p WHERE p.createdBy = ?1")
    Optional<Profile> findByUser(User user);

    @Query("SELECT p.firstName, p.lastName, p.isOnline " +
            "FROM Profile p LEFT JOIN User u ON p.createdBy.UUID = u.UUID " +
            "WHERE p.isOnline = ?1")
    ArrayList<Object> findAllUserOnline(Boolean isOnline);

    @Query("SELECT p FROM Profile p WHERE p.id = ?1")
    Optional<Profile> findByUUID(String UUID);

    @Query("SELECT p FROM Profile p WHERE p.createdBy = ?1")
    Optional<Profile> findProfileByCreatedBy(User user);

    @Query("SELECT p FROM Profile p WHERE p.createdBy.UUID = ?1")
    Profile findProfileByUserUUID(String userUUId);

    @Query("SELECT COUNT(p) FROM Profile p WHERE p.gender = ?1")
    Integer countByGender(EGender gender);

    @Query("SELECT p FROM Profile p " +
            "WHERE p.createdBy IN :friends AND p.isOnline = true")
    List<Profile> getOnlineProfilesOfFriends(List<User> friends);
}
