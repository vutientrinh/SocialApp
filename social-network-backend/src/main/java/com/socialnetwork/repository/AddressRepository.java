package com.socialnetwork.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.socialnetwork.model.user.Address;

public interface AddressRepository extends JpaRepository<Address, String> {}
