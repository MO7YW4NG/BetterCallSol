# Extract notebook methods with Workers AI under the free limit

Scheduled GitHub Actions call the Workers AI REST API directly to extract schema-validated Method Claims with notebook-cell citations. Extraction is cached by notebook content hash; when the daily free allocation is exhausted, unprocessed work is deferred to a later run rather than invoking paid capacity or inventing incomplete output.
