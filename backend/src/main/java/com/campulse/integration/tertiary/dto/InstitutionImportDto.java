
package com.campulse.integration.tertiary.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class InstitutionImportDto {

    private Long id;

    private String type;

    private String name;

    private String slug;

    private String category;

    private String state;

    private Integer year_established;

    private String website;

    private String structure_raw;
}
