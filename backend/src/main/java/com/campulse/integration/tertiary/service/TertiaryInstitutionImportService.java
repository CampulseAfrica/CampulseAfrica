
package com.campulse.integration.tertiary.service;

import com.campulse.integration.tertiary.client.TertiaryInstitutionApiClient;
import com.campulse.integration.tertiary.dto.InstitutionDetailDto;
import com.campulse.integration.tertiary.dto.InstitutionImportDto;
import com.campulse.integration.tertiary.dto.InstitutionPageResponse;
import com.campulse.integration.tertiary.dto.TertiaryImportSummary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class TertiaryInstitutionImportService {

    private static final Logger log =
            LoggerFactory.getLogger(TertiaryInstitutionImportService.class);

    private final TertiaryInstitutionApiClient apiClient;
    private final TertiaryInstitutionRecordImporter recordImporter;

    public TertiaryInstitutionImportService(
            TertiaryInstitutionApiClient apiClient,
            TertiaryInstitutionRecordImporter recordImporter) {
        this.apiClient = apiClient;
        this.recordImporter = recordImporter;
    }

    public TertiaryImportSummary importInstitutions(int maxInstitutions) {

        int page = 1;
        int limit = 25;

        TertiaryImportSummary totalSummary = new TertiaryImportSummary();

        if (maxInstitutions < 1) {
            throw new IllegalArgumentException(
                    "Maximum institutions must be greater than zero");
        }

        while (true) {

            InstitutionPageResponse response =
                    apiClient.getInstitutionsPage(page, limit);

            if (response == null
                    || response.getResults() == null
                    || response.getResults().isEmpty()) {
                break;
            }

            log.info("Processing institution page {} of {}",
                    page, response.getTotal_pages());

            for (InstitutionImportDto institution : response.getResults()) {

                if (totalSummary.getTotalProcessed() >= maxInstitutions) {
                    break;
                }

                totalSummary.setTotalProcessed(
                        totalSummary.getTotalProcessed() + 1);

                if (institution.getSlug() == null
                        || institution.getSlug().isBlank()) {

                    log.warn("Skipping institution without a slug: {}",
                            institution.getName());

                    totalSummary.setFailed(
                            totalSummary.getFailed() + 1);

                    continue;
                }

                try {
                    InstitutionDetailDto detail =
                            apiClient.getInstitutionBySlug(institution.getSlug());

                    TertiaryImportSummary result =
                            recordImporter.importInstitution(detail);

                    totalSummary.setSuccessful(
                            totalSummary.getSuccessful() + 1);

                    totalSummary.setSchoolsCreated(
                            totalSummary.getSchoolsCreated()
                                    + result.getSchoolsCreated());

                    totalSummary.setFacultiesCreated(
                            totalSummary.getFacultiesCreated()
                                    + result.getFacultiesCreated());

                    totalSummary.setDepartmentsCreated(
                            totalSummary.getDepartmentsCreated()
                                    + result.getDepartmentsCreated());

                } catch (Exception exception) {

                    totalSummary.setFailed(
                            totalSummary.getFailed() + 1);

                    log.error(
                            "Failed to import institution: {}",
                            institution.getName(),
                            exception);
                }
            }

            if (totalSummary.getTotalProcessed() >= maxInstitutions) {
                break;
            }
            if (page >= response.getTotal_pages()) {
                break;
            }

            page++;
        }

        log.info("========== INSTITUTION IMPORT SUMMARY ==========");
        log.info("Total processed: {}", totalSummary.getTotalProcessed());
        log.info("Successful: {}", totalSummary.getSuccessful());
        log.info("Failed: {}", totalSummary.getFailed());
        log.info("Schools created: {}", totalSummary.getSchoolsCreated());
        log.info("Faculties created: {}", totalSummary.getFacultiesCreated());
        log.info("Departments created: {}", totalSummary.getDepartmentsCreated());
        log.info("================================================");

        return totalSummary;
    }
}
