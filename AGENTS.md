# Shortlist demos

Read README.md and the target demo README/THIRD_PARTY_NOTICES before changes. Root is a single Git repository; demo folders are independent runnable exhibits, not nested repos. Add demos with demos.json and scripts/build_site.py. Keep stable slugs and project-relative URLs for GitHub Pages under /shortlist/. Preserve source/license provenance and inline notices.

Do not overwrite accepted demo behavior while editing the catalogue. The initial tidal-sanctury/index.html is the reviewed build d4237b7057ff; mist/index.html is the unchanged user file with hash in its notices. Do not invent cross-demo performance or upstream-code claims. Keep local absolute paths, installed packages, temporary probes and lab-private handoff documents out of public commits.

Run the gallery generator and --check. If changing actual runtime code, use appropriate source checks and browser visual/input review; packaging-only changes do not require repeating a60s benchmark. Pages deploys on main through .github/workflows/pages.yml; verify the resulting public URLs after publishing.
