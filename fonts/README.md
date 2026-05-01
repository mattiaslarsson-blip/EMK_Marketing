# Fonts

Lägg din **Bropella**-fontfil i den här mappen.

CSS pekar redan på alla fyra format-varianter — det räcker att du droppar in den fil du har:

```
Bropella.woff2   ← bäst (modern, liten)
Bropella.woff    ← ok
Bropella.otf     ← funkar
Bropella.ttf     ← funkar
```

Filnamnet måste vara exakt **`Bropella`** med stort B (inget `-Regular`, inget `_Bold`). Om din fil heter något annat, döp om den.

Så fort filen är på plats kommer SHOWREEL-titeln på sidan att rendras med Bropella vid nästa siduppdatering. Ingen omstart behövs.

## Tips för att minska filstorlek

Konvertera `.otf` eller `.ttf` till `.woff2` på [transfonter.org](https://transfonter.org) eller med `fonttools` i terminalen — `.woff2` är 30–60 % mindre och laddar snabbare.
