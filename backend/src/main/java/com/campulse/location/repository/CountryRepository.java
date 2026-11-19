package com.campulse.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campulse.location.entity.Country;

import java.util.Optional;
import java.util.UUID;

public interface CountryRepository extends JpaRepository<Country, UUID> {

    Optional<Country> findByCode(String code);

    boolean existsByNameIgnoreCase(String name);

    Optional<Country> findByNameIgnoreCase(String name);
}