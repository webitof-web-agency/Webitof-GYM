# Progress - `page-settings/company/page.js`

- Task: Migrate company details page setting to use local server image uploads
- Status: Modifications Completed
- Completed items:
  - Replaced API call `postMultipleImage` with the new local variant `postLocalMultipleImage`. This forces the Company Detail settings' image payloads to persist to `/uploads` on the backend instead of S3.
- Pending items: None
- Known blockers: None
