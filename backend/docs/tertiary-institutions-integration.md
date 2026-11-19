# Campulse: Nigerian Tertiary Institutions Integration

## 1. Overview

Campulse integrates an open-source Nigerian tertiary institutions dataset to populate its academic structure.

The integration provides information about Nigerian universities, polytechnics and colleges of education, including their faculties and departments.

The purpose is to avoid manually creating academic institutions and their structures in Campulse.

## 2. Data Source

**Source:** [Nigeria Tertiary Institutions API](https://github.com/reality-farouqk/nigeria-tertiary-institutions-api)

**Local API base URL:** `http://localhost:3000`

The source dataset contains:

| Institution type | Source records |
|---|---:|
| Universities | 312 |
| Polytechnics | 200 |
| Colleges of Education | 240 |
| **Total** | **752** |

Campulse consumes the institution listing and detail endpoints.

## 3. Data Mapping

The external dataset uses a different academic hierarchy from Campulse. The integration maps the records as follows:

| External dataset | Campulse entity |
|---|---|
| Institution | School |
| School / Faculty | Faculty |
| Department | Department |

The resulting Campulse hierarchy is:

`School → Faculty → Department`

Only explicitly provided faculties and departments are imported. Inferred courses and unparsed structure data are not used to create records.

## 4. External ID Management

Campulse stores the source's IDs to identify imported records.

| Campulse entity | External ID field |
|---|---|
| School | `external_institution_id` |
| Faculty | `external_faculty_id` |
| Department | `external_department_id` |

These identifiers help the importer recognise existing records during subsequent imports.

The importer uses external IDs as its primary matching mechanism, with name-based matching as a fallback.

This helps prevent duplicate records when the same dataset is imported more than once.

External IDs are unique within their respective Campulse tables.

## 5. Import Architecture

The integration is implemented in the package:

`com.campulse.integration.tertiary`

Its main components include:

- **DTOs:** Represent the institution, faculty and department data returned by the external API.
- **TertiaryInstitutionApiClient:** Communicates with the external API.
- **TertiaryInstitutionRecordImporter:** Maps and persists individual institution records and their academic structures.
- **TertiaryInstitutionImportService:** Coordinates the import process and records import statistics.
- **TertiaryInstitutionImportTestRunner:** Executes the import under the test profile.

The external API URL is configurable through:

```yaml
campulse:
  integration:
    tertiary:
      base-url: ${TERTIARY_API_BASE_URL:http://localhost:3000}
```

## 6. Import Results and Verification

The full dataset was imported successfully and subsequently re-imported to test repeatability.

### Database totals

| Entity | Records |
|---|---:|
| Schools | 752 |
| Faculties | 2,043 |
| Departments | 1,370 |

### Full re-import results (11 November 2026)

| Metric | Result |
|---|---:|
| Institutions processed | 752 |
| Successful | 752 |
| Failed | 0 |
| Schools created | 0 |
| Faculties created | 0 |
| Departments created | 0 |

The zero creation counts indicate that the importer matched existing records instead of creating additional records during the repeat import.

### External ID checks

The following checks passed:

- All schools have populated, unique external institution IDs.
- All faculties have populated, unique external faculty IDs.
- All departments have populated, unique external department IDs.
- No missing external IDs were found.

### Relationship integrity checks

The following checks returned zero:

- Faculties without a valid school.
- Departments without a valid faculty.
- Departments whose faculty has no valid school.

These checks establish database relationship integrity. They do not independently prove that every parent-child relationship matches the external source.

## 7. Known Limitations and Considerations

1. The accuracy and completeness of imported information depend on the external dataset.
2. External IDs assume that the source maintains stable identifiers.
3. Name-based fallback matching requires care when institutions or academic units have similar names.
4. The integration does not yet establish a fully automated synchronisation process.
5. Changes to the external dataset should be reviewed before being applied to Campulse records.
6. Campulse-managed fields, such as school verification status, should not be overwritten by routine imports.

## 8. Future Improvements

Potential improvements include:

- A controlled process for importing newly added institutions.
- A review mechanism for renamed or reorganised institutions.
- Detection of records removed from the external source.
- Better handling of duplicate-looking institutions.
- Import history and audit logging.
- Administrative tools for reviewing and correcting academic structures.
- Automated tests for duplicate prevention and parent-child matching.

---

**Documentation status:** Initial integration documentation.

**Last verified:** 11 November 2026.