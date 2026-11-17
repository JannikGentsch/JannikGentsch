# Portfolio-Website — Anleitung

Reines HTML/CSS/JS, kein Build-Schritt nötig.

| Datei | Inhalt |
|---|---|
| `index.html` | Texte: Hero, About, Kontakt, Showreel-Einbindung |
| `main.js` | **Projektliste** (`PROJECTS` ganz oben) + WebGL-Hintergrund |
| `styles.css` | Farben der drei Looks (`html[data-mood=...]` ganz oben) |
| `impressum.html` | Impressum & Datenschutz (Platzhalter ausfüllen!) |

## Lokal ansehen
```bash
python3 -m http.server 8000   # dann http://localhost:8000 öffnen
```

## Projekte ändern
In `main.js` im Array `PROJECTS` Einträge anpassen. Bilder in einen Ordner `img/` legen und
`image: "img/dateiname.jpg"` setzen. Für kurze stumme Loops: `video: "img/loop.mp4"`
(unter ~5 MB halten). Weitere Bilder für die Detailansicht: `gallery: ["img/a.jpg", "img/b.jpg"]`.

## Showreel
In `index.html` den Block `reel-placeholder` durch ein Vimeo-`<iframe>` ersetzen (Beispiel steht im Kommentar).

## Looks
Oben rechts umschaltbar: **Club** (Neon-Nebel), **Minimal** (Höhenlinien, hell), **Exp** (Pixel/Acid).
Der Standard-Look ist `data-mood="club"` im `<html>`-Tag von `index.html`.
Wenn du dich für einen entscheidest, kann der Umschalter einfach entfernt werden.

## Online stellen (kostenlos)
- **GitHub Pages:** Repo → Settings → Pages → Branch wählen → `/ (root)`.
  Für die Adresse `jannikgentsch.github.io` ein Repo mit genau diesem Namen anlegen und die Dateien dort hineinlegen.
- **Netlify / Cloudflare Pages:** Ordner per Drag & Drop hochladen oder Repo verbinden.
- Eigene Domain (~10–15 €/Jahr) lässt sich bei allen drei Anbietern kostenlos verknüpfen.
