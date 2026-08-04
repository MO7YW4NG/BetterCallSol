# Extract notebook methods with Workers AI under the free limit

Scheduled GitHub Actions call the Workers AI REST API directly to extract schema-validated Method Claims with notebook-cell citations. Extraction is cached by notebook content hash and notebook revision; when the daily free allocation is exhausted, the sync uses a conservative direct-token extractor with the same cell-reference validation rather than invoking paid capacity or inventing unsupported claims.
