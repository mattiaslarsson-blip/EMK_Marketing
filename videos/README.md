# Videos – showreel-sidan

Lägg dina MP4-filer här. Showreel-sidan refererar redan dessa filnamn — så fort du droppar in filerna funkar de direkt. Innan dess visas `poster`-bilden istället.

## Förväntade filer

| Filnamn | Var används den | Längd | Ljud | Anteckningar |
|---|---|---|---|---|
| `hero-bg.mp4` | Bakgrundsvideo i hero-sektionen | 10–15s loop | Nej | Ska gå i loop oändligt. Komprimera hårt (~3–5 MB) |
| `showreel-2025.mp4` | Huvudreel (stora 16:9-spelaren) | 1–2 min | Ja | EMK:s officiella showreel. Klick spelar med ljud. |
| `clip-01.mp4` … `clip-06.mp4` | Korta loopar i bento-griden | 5–10s | Nej | Tysta loopar, autoplayar i viewport. Komprimera (~1–3 MB/st) |
| `storytelling.mp4` | Bakgrund i storytelling-break (Nobelfesten) | 10–15s loop | Nej | Parallax-effekt, så stäng av snabba klipp. Långsamt och atmosfäriskt. |

## Specs

- **Codec:** H.264 (mp4) — bästa kompatibilitet
- **Upplösning:** 1920×1080 räcker, 1280×720 funkar för bento-loopar
- **Bitrate:** 2–5 Mbps för loopar, 6–10 Mbps för huvudreel
- **Färgrymd:** sRGB (inte rec.709 eller P3)
- **Total page-weight ska helst hållas under ~30 MB** för snabb laddning på mobil

## Tips

- Kör allt genom **HandBrake** eller `ffmpeg` med "Web optimized" / faststart-flagga så browsern kan börja spela innan hela filen är hämtad:
  ```
  ffmpeg -i input.mov -c:v libx264 -preset slow -crf 23 -movflags +faststart -an output.mp4
  ```
  (`-an` tar bort ljudspåret för loopar — sparar storlek)

- Korta loopar **utan ljud** är bäst för bento-griden. Browsers tillåter bara autoplay om videon är muted.

- Behöver du ladda en stor showreel någon annanstans (Vimeo Pro)? Ändra `<source>` i `showreel.html` till en `<iframe>` så går det också.
