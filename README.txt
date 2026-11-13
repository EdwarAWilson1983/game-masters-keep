GAME MASTER'S KEEP — PROTOTYPE 0.6
==================================

GALACTIC ADVENTURES DESIGN PASS
- Deep-black, starfield-inspired backdrop across the Star Wars universe.
- Stronger cinematic contrast between the Jedi / Light Side (blue) and Sith / Dark Side (crimson).
- Crossed blue and red energy blades at the center of the Force display.
- More dramatic split-panel treatment for Jedi Archives and Sith Holocrons.
- Force balance bar now visually communicates tension between the two sides.
- Adds layered space atmosphere to the hero and dashboard panels.
- Classic LCARS Starfleet theme and supplied emblem are retained.
- Fantasy Realms remains unchanged.
- Existing local campaign storage key is retained.

NOTE
The crossed energy blades and balance bar are visual design elements only. The era selector remains a presentation control; no new game mechanics or persistent Force-alignment tracking have been added.
This is still a local, single-browser prototype with no subscription or server costs.

INSTALLATION
Upload the contents of game_masters_keep_v1 to the root of the GitHub repository, replacing matching files and retaining the assets folder.


PROTOTYPE 0.6 — FORCE-DUALITY EMBLEM
- Integrates the user's uploaded blue / red Jedi-versus-Sith insignia in the Galactic Adventures sidebar identity and hero emblem positions.
- Black background is keyed to transparency so the emblem's smoke, glow and outlines blend into the starfield.
- The emblem is scoped to Galactic Adventures; Fantasy Realms and Starfleet Command retain their own brand marks.

PROTOTYPE 0.7 — FORCE-DUALITY DASHBOARD
- Extended the Jedi blue / Sith red visual language into Galactic Adventures stats, campaign panel, quick access, and prototype note.
- Added subtle faction gradients, split-light accents, and a clearer Light // Dark dashboard header while preserving readability.

PROTOTYPE 0.8 — FORCE MEDALLION REFINEMENT
- Refined the central Force insignia with a restrained circular seal, subtle blue/red split illumination, cleaner concentric rings, and shorter centered lightsabers.
- The central emblem is designed to sit naturally between the Jedi and Sith panels and use the same dark-space visual language.


Prototype 1.0 — Fantasy Chronicle visual pass — Fantasy Realms visual identity pass
Fantasy-only high-fantasy styling and a decorative campaign-inspiration atlas have been added. Starfleet Command and Galactic Adventures styling and assets are preserved.

Prototype 14: Fantasy universe renamed The Chronicles of Puma; restored original Galactic Adventures Force emblem visibility.

Prototype 15: corrected the Fantasy hero title display; the visible title is now live HTML text reading The Chronicles of Puma, masking the obsolete lettering in the legacy hero art.

Prototype 16: replaced the old Fantasy Realms hero banner artwork with newly generated The Chronicles of Puma artwork. Removed the prior title-overlay patch; the new Puma wordmark is part of the replacement banner image itself.

Phase 2, Campaign Management: campaigns can now be created, edited, assigned Active/Paused/Completed status, searched, filtered by universe and status, sorted, deleted with confirmation, and included in JSON backups. Older campaign records are upgraded automatically with Active status.

Phase 2, Chronicle Room: campaigns now hold session records (date, title, summary, cast and turning points). The Chronicle Room assembles records into an editable Epic Narrative, Historical Chronicle or Adventurer's Journal and opens a print-ready layout for printing or Save as PDF. This is a structured compilation of the DM's own notes; it does not invent events or require an AI subscription. Session records are included in JSON backups.

Phase 2.1, Character Dossiers: each campaign now has its own character vault. Dossiers capture name, role/class, species, appearance, personality, biography, equipment and an optional portrait/visual reference. Character data and portraits are stored with the campaign and included in JSON backups. Portrait uploads are limited to 700 KB in this local prototype to protect browser storage. This is the foundation for later character-linked AI artwork; AI generation is not included in this build.

Phase 2.2, Free Visual Creation Studio: character dossiers include a prompt builder that uses dossier details to prepare a reusable portrait prompt. Choose an art direction, add optional scene/pose guidance, copy the prompt to an image generator of your choice, then upload the result as the character's portrait. No AI image API, subscription, external service integration, or recurring cost is included.


Phase 2.3 — Visual Creation Studio
- Added a dedicated Visual Creation Studio workspace.
- Added launch links for Perchance, ChatGPT, CharGen, D&D Playbook, NightCafe, and Perchance story/RPG tools.
- Added a campaign-specific artwork gallery for portraits, maps, locations, scenes, chapter illustrations and other artwork.
- Artwork can optionally be associated with a character and a chapter/session label.
- Artwork is stored locally in the campaign record and included in JSON export/import backups.
- Image uploads accept JPG, PNG and WebP up to 700 KB each in this prototype.
- External generators open in separate tabs; campaign information is not transmitted automatically.
- No cloud storage, paid API, subscription, or recurring cost has been introduced.
\nRealm isolation fix: campaigns, dashboard summaries, character selectors, session selectors, and artwork selectors are scoped to the currently selected universe. Campaign records remain stored locally together but are not displayed across universes.\n

LIBRARY & ARCHIVES
------------------
The Library & Archives screen is a local catalog for files hosted by this GitHub Pages repository.
1. Upload a file to the matching universe folder (Puma, Starfleet, or Galactic-Adventures).
2. Open Library & Archives in the app.
3. Enter a title, category, and repository-relative path, for example:
   Puma/Images/aria-portrait.png
4. The app creates a link to the file on the published GitHub Pages site.
5. Export the archive catalog JSON periodically as a backup. The catalog is stored in this browser;
   the actual documents and images are hosted in the repository.
Removing an archive entry only removes its local catalog record; it does not delete the GitHub file.
The repository is public, so do not upload private or sensitive material.


PHASE 2.4.4 — ILLUSTRATED CHRONICLES
- Session records can be linked to one or more images in that campaign's Artwork Gallery.
- Linked images appear as previews on the relevant session record.
- Printed / Save PDF campaign chronicles include an Illustrated Plates section grouped by session.
- Artwork remains campaign-specific and is included in existing JSON backup/export.
- All data remains local in this browser; no subscription or cloud storage is introduced.
