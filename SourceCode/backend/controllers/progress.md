# Progress - `files.controller.ts`

- Task: Implementation of Local Server Upload for Gallery
- Status: Completed Additions for `localSingleImageUpload`
- Completed items:
  - Added `localSingleImageUpload` method utilizing `express-fileupload` to store a single image directly into `uploads/`.
  - Added `localMultipleImageUpload` method utilizing `express-fileupload` to map multiple image files and store them directly into `uploads/`. Added imports for `fs` and `path`.
  - `gallery.controller.ts`: Updated `deleteGallery` to support local file deletion from the `/uploads` directory using `fs.unlinkSync` and `path`.
- Pending items: None
- Known blockers: None
