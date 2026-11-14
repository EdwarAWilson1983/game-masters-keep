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


PHASE 3.0 — RULES LIBRARY FOUNDATION
- Built from the Phase 2.4.9 stable baseline.
- Adds a searchable Rules Library starter collection for D&D 5th Edition (2014).
- Includes category filtering and original quick-reference explanations for core rules, combat, spellcasting, conditions, and adventuring.
- AD&D 2nd Edition and D&D 3.5 are identified as planned, separate rulesets and are not populated or mixed into the 5E collection.
- Does not reproduce proprietary rulebook text. Source labels are navigational references, not page citations.
- Campaigns and catalog data continue to use browser-local storage; no cloud sync or multiplayer is added.


PHASE 3.3 — SPELL REFERENCE EXPANSION
- Expanded the 2014 5E spell reference collection with additional SRD 5.1 spell entries.
- Added a spell-level filter for cantrips and 1st–9th-level spells.
- The spell-level filter narrows the library to spell entries at the selected level.
- Existing Quick View overlays, search, category filters, and other application features are retained.
- SRD 5.1 attribution is displayed in the Rules Library content note.

PHASE 3.5: Adds equipment reference cards with weapon damage/properties, armor AC/requirements, and common adventuring gear details.


PHASE 3.20: Added the DM Command Center. Open the app and select DM Command Center in the sidebar. Choose a campaign to see its briefing, summary counts, recent sessions, adventures, world highlights and shortcuts.

PHASE 3.21 — THE DICE CHAMBER
The Game Tools dice roller has been upgraded with an animated dice reveal, all standard polyhedral dice plus percentile, multiple dice, modifiers, result breakdowns, natural 20/1 highlights, and a temporary recent-roll history. The interface adapts to all three universe themes. See PHASE_3_21_NOTES.txt for details.

PHASE 3.21.1 VISUAL REFINEMENT
The Dice Chamber now uses a custom faceted polyhedral die illustration rather than the earlier generic flat die shape. Its metal, facet, and numeral treatments adapt to all three universes. See PHASE_3_21_1_NOTES.txt.

PHASE 3.21.6
See PHASE_3_21_6_NOTES.txt for the latest Dice Chamber visual refinement.


Phase 3.21.8: Dice Chamber artifact cleanup. See PHASE_3_21_8_DICE_ARTIFACT_FIX.txt.

PHASE 3.22 — COMBAT CONSOLE
Game Tools now includes an integrated initiative and combat tracker. Encounters can be associated with a campaign and are included in campaign JSON backups. The tracker supports manually added combatants, importing campaign characters, initiative rolls, turn/round progression, HP adjustments, AC display, conditions/effects notes, and removal of combatants. It remains a local DM-side tool; it does not provide multiplayer or automated rules adjudication. See PHASE_3_22_NOTES.txt.

PHASE 3.23 UPDATE
See PHASE_3_23_NOTES.txt for integration fixes to campaign-scoped encounter deletion and persistent initiative turn selection.

PHASE 3.24 — FINAL QUALITY ASSURANCE & RELEASE PREPARATION
- Final static validation and release-preparation checklist added.
- See PHASE_3_24_FINAL_QA_NOTES.txt for validation results, owner acceptance checks, and GitHub Pages deployment precautions.
- This remains a local, single-browser application. GitHub Pages deployment does not add cloud synchronization, user accounts, private group access, or multiplayer.

PHASE 4.1 · DEVELOPMENT AUTHENTICATION ENTRY

This development build adds an email/password sign-in and registration gate
connected to the Neon Managed Better Auth endpoint for the development branch.
The browser loads the official @neondatabase/auth client as an ES module from
esm.sh. No database password, Neon API key, or administrator secret is stored
in the frontend.

Important limitations of this milestone:
- Email verification is enabled in Neon. Follow the verification instructions
  delivered by Neon before signing in.
- A successful sign-in confirms identity only. It does NOT yet grant a DM,
  moderator, or campaign role.
- Moderator approval is not yet enforced by the application. Do not invite
  other users or treat this as a production access-control release.
- Existing campaign records still use browser-local storage. Authentication
  does not yet synchronize or protect campaign data in the cloud.
- The Neon Auth endpoint belongs to the development branch. A separate
  production endpoint and configuration must be used before launch.

Next implementation step: connect the approval tables and campaign membership
policies to authenticated access, promote the first account to administrator,
and test a second account in a pending state before enabling invitations.
