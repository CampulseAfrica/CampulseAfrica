
package com.campulse.integration.tertiary.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class InstitutionDetailDto {

    private Long id;

    private String type;

    private String name;

    private String slug;

    private String category;

    private String state;

    private Integer year_established;

    private String website;

    private String structure_raw;

    private List<ExternalSchoolDto> schools = new ArrayList<>();

    private Boolean schools_parsed;
}
