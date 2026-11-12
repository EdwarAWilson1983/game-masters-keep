# Game Master's Keep

**A free, browser-based command center for tabletop role-playing
campaigns.**

Game Master's Keep is a developing toolkit for Game Masters who want one
place to organize campaigns, prepare adventures, and keep game materials
close at hand. It brings together three distinct themed workspaces while
keeping the project simple to host and free to run.

## The three universes

-   **The Chronicles of Puma** --- an original high-fantasy setting with
    an ancient-chronicle atmosphere, forest-green and antique-gold
    styling, a White Tree emblem, and five themed halls.
-   **Starfleet Command** --- a Star Trek-inspired command interface
    with a classic LCARS visual language.
-   **Galactic Adventures** --- a Star Wars-inspired galaxy organized
    around the visual contrast of the Jedi and Sith.

Each universe has its own visual identity. The three designs are
considered established; future development should focus on functionality
unless a design change is specifically requested.

## Current capabilities

The current prototype includes:

-   Switching between the three themed universes.
-   Creating campaigns with a name, selected universe, and optional
    premise.
-   Viewing and searching saved campaigns.
-   Rolling common polyhedral dice, with multiple dice per roll.
-   Exporting campaign data to a JSON backup.
-   Importing a previously exported JSON backup.
-   Responsive navigation for desktop and smaller screens.

## Important: current development status

Game Master's Keep is an early prototype, not yet a complete virtual
tabletop or multiplayer platform.

The following areas are planned for future development and are **not yet
implemented as full features**:

-   Character and NPC record management.
-   Session notes, quests, and adventure tracking.
-   A populated, searchable rules and reference library.
-   Maps, campaign-world building tools, and richer DM utilities.
-   Online multiplayer, accounts, and cloud synchronization.
-   AI-assisted solo play.

Some of these sections may appear in the interface as planned
destinations or placeholders. Their presence in the navigation does not
mean the functionality is already available.

## Data storage and privacy

The current prototype stores campaign data in the browser's
`localStorage` on the device and browser where it is used.

-   There is currently no user account or central database.
-   Campaigns do not automatically sync between devices or browsers.
-   Clearing browser site data can erase locally stored campaigns.
-   Use **Settings & Backup** to export a JSON backup regularly.
-   Keep the exported backup somewhere safe. Import it to restore
    campaign data in another browser or after clearing local data.

The current app is designed for local, single-browser use. Online
collaboration and shared campaign data are future development goals.

## Hosting

The project is designed to be hosted as a static website using **GitHub
Pages**.

There is no required paid hosting service or subscription for the
current prototype. A public GitHub repository and GitHub Pages can be
used at no monthly hosting cost within GitHub's applicable limits and
terms.

To publish the site:

1.  Keep `index.html`, `styles.css`, `app.js`, and
    `manifest.webmanifest` in the repository's published root (or
    configure GitHub Pages to use the folder where they live).
2.  Keep the complete `assets` folder and all of its contents alongside
    those files. The app references images using paths inside `assets`.
3.  In the repository, open **Settings → Pages**.
4.  Select the intended branch (usually `main`) and the repository root
    (`/`) as the publishing source, then save.
5.  Wait for the GitHub Pages deployment to complete, then open the
    Pages URL shown in the repository settings.

If the project files are placed inside a subfolder, configure GitHub
Pages to publish that subfolder or move the site files to the selected
publishing root.

## Project files

``` text
game-masters-keep/
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── README.md
└── assets/
    ├── puma-chronicle-banner.jpg
    ├── fantasy-hall-1.jpg
    ├── fantasy-hall-2.jpg
    ├── fantasy-hall-3.jpg
    ├── fantasy-hall-4.jpg
    ├── fantasy-hall-5.jpg
    ├── force-duality-emblem.png
    ├── force-duality-icon.png
    ├── starfleet-command-emblem.png
    └── supporting artwork and images
```

The exact contents of `assets` may expand as the project develops. **Do
not upload only the folder name or omit its contents**---the individual
image files are required.

## Development priorities

The visual-design milestone for all three universes has been approved.
The next development phase is focused on making the toolkit genuinely
useful, beginning with core campaign organization and then expanding
into character records, session and quest management, reference tools,
and eventually online play.

## License and third-party material

This repository is a personal project in active development. Before
redistributing the project or adding third-party rules text, artwork,
logos, or other material, review the relevant licenses and permissions.
The themed universes are intended as fan-inspired campaign interfaces,
not official products or endorsements by the owners of their respective
franchises.
