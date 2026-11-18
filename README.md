# Shortlist

A growing collection of self-contained browser demos and rendering experiments. Each demo has its own directory, runnable HTML, controls and source credits.

**[Open the demo gallery](https://zixma13.github.io/shortlist/)**

| Demo | Play | Technique | Standalone HTML |
|---|---|---|---:|
| [Tidal Sanctuary](tidal-sanctury/README.md) | [Open](https://zixma13.github.io/shortlist/tidal-sanctury/) | WebGPU procedural coastal/underwater world |121116bytes|
| [The Mist](mist/README.md) | [Open](https://zixma13.github.io/shortlist/mist/) | WebGL2 procedural fog, lighting and synthesized sound |6296bytes|

## Local preview

```sh
python3 scripts/build_site.py
python3 -m http.server 5193 --directory _site --bind 127.0.0.1
```

Open http://127.0.0.1:5193/. Python3.9+ is enough to build and preview the gallery. Individual committed HTML files need no package installation. Source authoring commands, browser requirements, controls and performance evidence belong in each demo README.

## Add the next demo

1. Create a stable folder such as new-demo/ and put the self-contained page in new-demo/index.html. Use a standalone page; the current publish allowlist includes the HTML, optional preview and license/source notices.
2. Add README.md with controls, requirements, source/provenance and credits. Add THIRD_PARTY_NOTICES.md and the relevant LICENSE files. Preserve third-party copyright/permission notices in distributed files.
3. Add an entry in demos.json using the existing schema. Optionally add preview.jpg in the demo folder. Use project-relative links so Pages works below /shortlist/.
4. Run python3 scripts/build_site.py, then python3 scripts/build_site.py --check. Commit the demo, manifest and refreshed root index.html.
5. Push main. GitHub Actions rebuilds the catalogue and publishes the selected static files to GitHub Pages.

The Git repository root is shortlist/; individual demo folders are not nested Git repositories. _site contains only the public gallery, runnable pages, previews and notices, while authoring source and QA data stay available in GitHub. The Pages workflow is .github/workflows/pages.yml. Keep demo slugs stable after publication.

## Credits

**Tidal Sanctuary** adapts [Abyssal Garden](https://github.com/Noniv/abyssal-garden) by **Maksymilian Dendura**, MIT License, pinned to [`a596354`](https://github.com/Noniv/abyssal-garden/tree/a596354eff400d458bc2aeb9bdf5e0a9734b2bcf). Its original copyright and permission notice are retained in the HTML and [demo LICENSE](tidal-sanctury/LICENSE).

[Ultra-Water](https://github.com/Humpalumps/Ultra-Water) by **Humpalumps** informed earlier research into efficient ocean rendering. Its code and FFT implementation are **not bundled in Tidal Sanctuary**; the demo's water uses analytic waves.

**The Mist** was supplied by **Apisak Musikapan** as an original standalone HTML study. No additional upstream source was declared in the supplied file. See its [source notices](mist/THIRD_PARTY_NOTICES.md).

The repository's original contributions use [MIT](LICENSE). Third-party work retains its own notices and licenses. Each future demo must document its actual sources; research inspiration and adapted code should be credited distinctly.
