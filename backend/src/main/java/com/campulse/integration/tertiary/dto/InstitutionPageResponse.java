
package com.campulse.integration.tertiary.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class InstitutionPageResponse {

    private int page;

    private int limit;

    private int total;

    private int total_pages;

    private List<InstitutionImportDto> results;
}
