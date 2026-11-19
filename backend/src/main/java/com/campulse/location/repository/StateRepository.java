package com.campulse.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campulse.location.entity.State;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StateRepository extends JpaRepository<State, UUID> {

    List<State> findByCountryId(UUID countryId);

    boolean existsByCountryIdAndNameIgnoreCase(UUID countryId, String name);

    Optional<State> findByCountryIdAndNameIgnoreCase(
        UUID countryId,
        String name
    );
}