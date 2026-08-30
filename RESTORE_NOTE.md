# Restored Industry Atlas source

This archive was reconstructed from the original uploaded project package on August 30, 2026 so it can be downloaded and added to GitHub.

Security cleanup performed during restoration:
- Removed the original `.env` file and all credential values.
- Added `.env.example` containing variable names only.
- Removed generated TypeScript build cache.
- Added a Git-friendly `.gitignore`.
- Included the original Industry Atlas dashboard build specification under `docs/`.

Before running the app, copy `.env.example` to `.env` and provide fresh credentials. Any credentials that existed in the original uploaded `.env` should be treated as exposed and rotated.
