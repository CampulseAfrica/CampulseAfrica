
package com.campulse.integration.tertiary.service;

import java.util.Locale;
import java.util.Map;
import java.util.Set;

public final class NigerianRegionMapper {

    private NigerianRegionMapper() {
    }

    private static final Map<String, Set<String>> REGIONS = Map.of(
        "North Central", Set.of(
            "Benue", "Kogi", "Kwara", "Nasarawa",
            "Niger", "Plateau", "Federal Capital Territory", "FCT"
        ),
        "North East", Set.of(
            "Adamawa", "Bauchi", "Borno",
            "Gombe", "Taraba", "Yobe"
        ),
        "North West", Set.of(
            "Jigawa", "Kaduna", "Kano", "Katsina",
            "Kebbi", "Sokoto", "Zamfara"
        ),
        "South East", Set.of(
            "Abia", "Anambra", "Ebonyi", "Enugu", "Imo"
        ),
        "South South", Set.of(
            "Akwa Ibom", "Bayelsa", "Cross River",
            "Delta", "Edo", "Rivers"
        ),
        "South West", Set.of(
            "Ekiti", "Lagos", "Ogun", "Ondo", "Osun", "Oyo"
        )
    );

    
    public static String getRegionName(String stateName) {
        if (stateName == null || stateName.isBlank()) {
            throw new IllegalArgumentException(
                "State name cannot be empty"
            );
        }

        String normalized = stateName.trim();

        if (normalized.equalsIgnoreCase("FCT")) {
            normalized = "Federal Capital Territory";
        } else if (normalized.toLowerCase(Locale.ROOT)
                .endsWith(" state")) {
            normalized = normalized.substring(
                0, normalized.length() - " state".length()
            ).trim();
        }

        for (Map.Entry<String, Set<String>> entry : REGIONS.entrySet()) {
            for (String name : entry.getValue()) {
                if (name.equalsIgnoreCase(normalized)) {
                    return entry.getKey();
                }
            }
        }

        throw new IllegalArgumentException(
            "No Nigerian region mapping for state: " + stateName
        );
    }

}
