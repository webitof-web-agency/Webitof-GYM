# Progress - `admin/gallery/page.js`

- Task: Implementation of Local Server Upload for Gallery
- Status: Modifications Completed
- Completed items:
  - Replaced `postSingleImage` with `postLocalSingleImage` so the gallery image gets uploaded to the local server instead of an S3 bucket.
  - Updated `../components/form/table.js`'s `TableImage` component to properly prefix local paths starting with `/uploads` with `process.env.backend_url` so the image loads correctly.
- Pending items: None
- Known blockers: None
