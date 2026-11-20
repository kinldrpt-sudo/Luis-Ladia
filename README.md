# Vánoční a novoroční přání · Luis Rodríguez a Ladislav Prištic

Statická webová pohlednice připravená k otevření a sdílení, bez nutnosti sestavení.

## Spuštění lokálně

```bash
python -m http.server 4175
```

Otevřete `http://localhost:4175`.

## Úpravy textů

Veškerý obsah je na jednom místě v souboru `config.js`:

- **Odesílatelé a monogram**: `senders`, `monogram`, `season`.
- **Dopis a přání**: `letter` a `wishes` (dostupné ikony: `star`, `gift`, `candle`, `heart`, `glass`).
- **Interaktivní přípitek**: texty v poli `toast.phrases`.
- **Hudba na pozadí**: doplňte cestu k souboru `.mp3` do pole `music` pro zobrazení plovoucího tlačítka.

## Publikace

Nahrajte složku `vanoce-luis-a-ladislav` na Netlify, Vercel, Cloudflare Pages nebo GitHub Pages a v `index.html` upravte `og:image` na absolutní URL pro náhled při sdílení přes WhatsApp.
