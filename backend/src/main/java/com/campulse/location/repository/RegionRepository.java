
package com.campulse.location.repository;

import com.campulse.location.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RegionRepository extends JpaRepository<Region, UUID> {

    Optional<Region> findByCountryIdAndNameIgnoreCase(
            UUID countryId,
            String name
    );
}
