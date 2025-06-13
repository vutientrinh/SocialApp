package com.socialnetwork.model.user;

import jakarta.persistence.*;

import com.socialnetwork.model.enums.ERole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @Column(name = "role_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name")
    private ERole roleName;

    public static ERole getERole(String roleName) {
        return ERole.valueOf(roleName);
    }
}
