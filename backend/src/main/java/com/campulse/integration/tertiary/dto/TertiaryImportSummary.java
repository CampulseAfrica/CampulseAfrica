package com.campulse.integration.tertiary.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TertiaryImportSummary {

    private int totalProcessed;
    private int successful;
    private int failed;

    private int schoolsCreated;
    private int facultiesCreated;
    private int departmentsCreated;

}