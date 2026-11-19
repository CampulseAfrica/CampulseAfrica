
package com.campulse.integration.tertiary.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ExternalSchoolDto {

    private Long id;

    private String name;

    private List<ExternalDepartmentDto> departments = new ArrayList<>();
}
