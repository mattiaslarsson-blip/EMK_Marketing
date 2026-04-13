# EMK Marketing – Webbplats

Statisk webbplats för EMK Marketing — byggd för att matcha den nuvarande Squarespace-designen. Vanlig HTML, CSS och JavaScript. Inga byggsteg, inga beroenden.

## Filer
- `index.html` – hela sidan
- `styles.css` – design och layout
- `script.js` – meny, formulär, scroll-animationer
- `README.md` – denna fil

## Bilder (viktigt att läsa)
Sidan använder just nu **placeholder-bilder från Unsplash** (gratis stockfoton) på följande ställen:
- Hero-bakgrund (berg)
- De fyra tjänste-kortens bilder (Foto, Film, Sociala Medier, Paid Ads)
- Bakgrunden bakom "Du är i trygga händer" och "Vi är EMK Marketing"
- Galleriet med 4 bilder

**Innan du publicerar bör du byta dessa till dina egna bilder.** Så här gör du:
1. Lägg dina bilder i en mapp `images/` bredvid `index.html`
2. Öppna `index.html`, sök på `unsplash.com` — varje träff är en placeholder
3. Byt ut URL:en mot t.ex. `images/hero.jpg`
4. För hero- och team-bakgrunderna: öppna `styles.css`, sök på `unsplash.com` och byt på samma sätt

Samma sak gäller team-avatarerna och referensbilderna — just nu visas bara initialer (ML, MS, etc.) i runda cirklar som platshållare. Byt mot riktiga porträtt när du är redo.

## Lägga upp på GitHub + publicera (steg för steg)

### 1. Skapa ett nytt repo
1. Gå till https://github.com/new
2. Repository name: `emk-marketing` (eller vad du vill)
3. Sätt det till **Public**
4. **Bocka inte** i någon av rutorna (README, .gitignore, license)
5. Klicka **Create repository**

### 2. Ladda upp filerna
1. På den nya repo-sidan: klicka **uploading an existing file** (länken i mitten)
2. Dra in `index.html`, `styles.css`, `script.js` och `README.md`
3. Scrolla ner och klicka **Commit changes**

### 3. Aktivera GitHub Pages
1. Klicka på **Settings** (högst upp i repo:t)
2. I vänstermenyn: klicka **Pages**
3. Under **Source**: välj **Deploy from a branch**
4. Under **Branch**: välj **main** och **/ (root)**, klicka **Save**
5. Vänta 1–2 minuter. Sidan är nu live på:
   `https://<ditt-användarnamn>.github.io/emk-marketing/`

### 4. (Valfritt) Koppla din egen domän emkmarketing.se
1. På GitHub: gå tillbaka till **Settings → Pages**
2. Under **Custom domain**: skriv `emkmarketing.se` och klicka **Save**
3. Hos din domänleverantör (där du köpte emkmarketing.se), lägg till följande DNS-poster:
   - **A** `@` → `185.199.108.153`
   - **A** `@` → `185.199.109.153`
   - **A** `@` → `185.199.110.153`
   - **A** `@` → `185.199.111.153`
   - **CNAME** `www` → `<ditt-användarnamn>.github.io`
4. Vänta 10–60 minuter på DNS-uppdatering
5. Tillbaka i GitHub Pages: bocka i **Enforce HTTPS**

Klart — sidan är live på `https://emkmarketing.se`.

## Redigera innehåll
All text ligger i `index.html`. Sök på texten du vill ändra och skriv över. Spara, committa, GitHub Pages publicerar automatiskt.

## Lokal förhandsvisning
Du behöver inget byggsteg. Dubbelklicka på `index.html` så öppnas den i din webbläsare.

## Färger (om du vill ändra)
Öppna `styles.css` och ändra dessa rader högst upp:
```css
--bg: #000000;        /* bakgrund */
--accent: #F5B800;    /* gul accent */
--text: #ffffff;      /* text */
```
