
package com.campulse.integration.tertiary.client;

import com.campulse.integration.tertiary.dto.InstitutionDetailDto;
import com.campulse.integration.tertiary.dto.InstitutionPageResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class TertiaryInstitutionApiClient {

    private final RestClient restClient;

    public TertiaryInstitutionApiClient(
            RestClient.Builder restClientBuilder,
            @Value("${campulse.integration.tertiary.base-url}")
            String baseUrl) {

        this.restClient = restClientBuilder
                .baseUrl(baseUrl)
                .build();
    }

    public InstitutionPageResponse getInstitutionsPage(
            int page, int limit) {

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/v1/institutions")
                        .queryParam("page", page)
                        .queryParam("limit", limit)
                        .build())
                .retrieve()
                .body(InstitutionPageResponse.class);
    }

    public InstitutionDetailDto getInstitutionBySlug(String slug) {

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .pathSegment(
                                "api", "v1", "institutions", slug)
                        .build())
                .retrieve()
                .body(InstitutionDetailDto.class);
    }
}
