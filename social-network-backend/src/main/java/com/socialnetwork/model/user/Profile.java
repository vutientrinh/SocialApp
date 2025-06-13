package com.socialnetwork.model.user;

import com.socialnetwork.model.Auditable;
import com.socialnetwork.model.enums.EGender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Profile extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private EGender gender;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "bio")
    private String bio;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "is_online")
    private boolean isOnline;

    public Profile(
            String firstName,
            String lastName,
            String bio,
            boolean is_online) {

        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = bio;
        this.isOnline = is_online;
    }
}
