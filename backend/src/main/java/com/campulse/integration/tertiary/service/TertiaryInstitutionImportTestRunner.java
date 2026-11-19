package com.campulse.integration.tertiary.service;

import com.campulse.integration.tertiary.dto.TertiaryImportSummary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("tertiary-import-test")
public class TertiaryInstitutionImportTestRunner implements CommandLineRunner {

    private static final Logger log =
            LoggerFactory.getLogger(TertiaryInstitutionImportTestRunner.class);

    private final TertiaryInstitutionImportService importService;

    public TertiaryInstitutionImportTestRunner(
            TertiaryInstitutionImportService importService) {
        this.importService = importService;
    }

    @Override
    public void run(String... args) {

        log.info("Starting controlled import test...");

        TertiaryImportSummary summary =
                importService.importInstitutions(752);

        log.info("Test completed.");
        log.info("Total processed: {}", summary.getTotalProcessed());
        log.info("Successful: {}", summary.getSuccessful());
        log.info("Failed: {}", summary.getFailed());
        log.info("Schools created: {}", summary.getSchoolsCreated());
        log.info("Faculties created: {}", summary.getFacultiesCreated());
        log.info("Departments created: {}", summary.getDepartmentsCreated());
    }
}