# WebMorph - Guida alla Distribuzione

Questa guida spiega come distribuire WebMorph agli utenti finali.

---

## 📦 Pacchetto Pronto

Il pacchetto di distribuzione è stato creato nella cartella `release/`:

```
release/
├── webmorph-extension.zip      (19 KB)   - Estensione Firefox
├── INSTALL.bat                  (787 B)   - Launcher installer
├── webmorph-installer.ps1       (9.9 KB)  - Installer PowerShell
├── native-host/                          - File native messaging
│   ├── host.py
│   └── com.fimp4fx.webm_converter.json
└── README.txt                   (3.8 KB)  - Istruzioni utente
```

---

## 🚀 Opzioni di Distribuzione

### Opzione 1: Firefox Add-ons Store (AMO) - **CONSIGLIATA**

**Pro:**
- ✅ Installazione con 1 click
- ✅ Aggiornamenti automatici
- ✅ Massima fiducia degli utenti
- ✅ Visibilità nel marketplace

**Procedura:**

1. **Account Sviluppatore**
   - Vai su: https://addons.mozilla.org/developers/
   - Accedi con Firefox Account
   - Accetta l'accordo sviluppatore

2. **Carica Estensione**
   - Carica: `release/webmorph-extension.zip`
   - Compila i metadati:
     - Nome: **WebMorph - WebM to MP4 Converter**
     - Categoria: **Download Management**
     - Tag: video, converter, webm, mp4, ffmpeg

3. **Sottometti per Revisione**
   - Tempo: 1-7 giorni
   - Mozilla controlla il codice
   - Una volta approvato, pubblicato automaticamente

4. **Distribuzione Installer**
   - Comprimi la cartella `release/`
   - Rinomina: `WebMorph-v1.0.0-Setup.zip`
   - Carica su GitHub Releases / tuo sito
   - Gli utenti scaricano l'estensione da AMO + eseguono installer

---

### Opzione 2: Auto-distribuzione

**Pro:**
- ✅ Controllo totale
- ✅ Nessuna attesa revisione

**Contro:**
- ❌ Aggiornamenti manuali
- ❌ Installazione più complessa

**Procedura:**

1. **Firma l'Estensione** (obbligatorio)
   - Usa web-ext:
   ```bash
   npm install -g web-ext
   web-ext sign --source-dir=extension --api-key=... --api-secret=...
   ```
   - O carica su AMO selezionando "On your own"

2. **Distribuisci**
   - Comprimi tutta la cartella `release/` + estensione firmata
   - Carica su GitHub/tuo sito
   - Fornisci istruzioni agli utenti

---

## 👥 Istruzioni per gli Utenti

### Se l'estensione è su AMO:

1. **Installa da Firefox Add-ons**
   - https://addons.mozilla.org/firefox/addon/webmorph/
   - Click "Aggiungi a Firefox"

2. **Scarica e installa componenti nativi**
   - Scarica: `WebMorph-v1.0.0-Setup.zip`
   - Estrai la cartella
   - Esegui `INSTALL.bat`
   - Segui le istruzioni a schermo

3. **Riavvia Firefox**

4. **Pronto!** Scarica un file .webm per testare

---

### Se auto-distribuito:

1. **Scarica il pacchetto**
   - `WebMorph-v1.0.0-Complete.zip`
   - Estrai in una cartella permanente (es: `C:\WebMorph`)

2. **Installa componenti nativi**
   - Esegui `INSTALL.bat`
   - Aspetta il completamento

3. **Installa estensione**
   - Apri Firefox
   - Vai su: `about:addons`
   - Click sull'icona ⚙️ → "Installa componente aggiuntivo da file"
   - Seleziona `webmorph-extension-signed.xpi`

4. **Riavvia Firefox**

---

## 🧪 Test prima della Distribuzione

**Checklist:**

- [ ] Testa su Windows 10/11 pulito (VM)
- [ ] Verifica funzionamento installer
- [ ] Testa conversione automatica WebM → MP4
- [ ] Verifica notifiche
- [ ] Testa pagina opzioni
- [ ] Verifica funziona con Python già installato
- [ ] Verifica funziona con FFmpeg già installato
- [ ] Controlla log per errori
- [ ] Testa disinstallazione completa

---

## 📝 File da Preparare per AMO

### manifest.json
- ✅ Già pronto
- Versione: 1.0.0
- ID: webmorph@webmorph.com

### Descrizione per AMO

Usa quella in `PUBLISHING.md` sezione "Recommended Description for AMO"

### Screenshot (richiesti da AMO)

Prepara 3-5 screenshot:
1. Popup dell'estensione (mostrando status connesso)
2. Notifica di conversione completata
3. Pagina opzioni/impostazioni
4. Esempio prima/dopo (file .webm → .mp4)
5. (Opzionale) Installer in esecuzione

Dimensioni: 1280x800 o simili

### Icona

- ✅ Già presente in `extension/icons/`
- 48x48 e 96x96 PNG

---

## 🔄 Aggiornamenti Futuri

Quando rilasci una nuova versione:

1. **Aggiorna versione**
   - `extension/manifest.json` → cambia `"version"`
   - `installer.ps1` → aggiorna commenti se necessario

2. **Ricompila**
   ```powershell
   .\build-release.ps1
   ```

3. **Se su AMO:**
   - Carica nuova versione su AMO
   - Gli utenti ricevono update automatico

4. **Se auto-distribuito:**
   - Carica nuovo pacchetto
   - Comunica agli utenti di scaricare update

---

## 📊 Metriche di Successo

Dopo la pubblicazione, monitora:

- **Download** (se su AMO)
- **Recensioni** e rating
- **Bug report** (crea Issues su GitHub)
- **Richieste di funzionalità**

---

## 🆘 Supporto Utenti

**Problemi comuni:**

| Problema | Soluzione |
|----------|-----------|
| "Native Host: Not Found" | Eseguire/rieseguire INSTALL.bat |
| "FFmpeg: Not Found" | Rieseguire installer, controllare antivirus |
| Conversione non parte | Verificare impostazioni → Auto-conversion abilitata |
| Firefox non si connette | Riavviare completamente Firefox |

**Link utili per supporto:**
- Log dettagliati: `native-host\host.log`
- Console estensione: `about:debugging` → Inspect

---

## 📄 Licenza e Note Legali

**Prima della distribuzione pubblica:**

- [ ] Aggiungi file LICENSE (es: MIT)
- [ ] Crea Privacy Policy (richiesta da AMO)
- [ ] Aggiungi crediti per FFmpeg
- [ ] Verifica compatibilità licenze

**Esempio Privacy Policy:**

```
WebMorph Privacy Policy

Data Collection: NONE
WebMorph does not collect, store, or transmit any user data.

Local Processing: ALL
All video conversions happen locally on your computer.
No data is sent to external servers.

Third-party Components:
- FFmpeg: Used for video conversion (local only)
- Python: Runtime for native host (local only)

Contact: [your-email@domain.com]
Last Updated: [date]
```

---

## 📢 Marketing

**Dove promuovere:**

1. **Reddit**
   - r/firefox
   - r/opensource
   - r/software

2. **Social**
   - Twitter con #Firefox #WebExtensions
   - LinkedIn per professionale

3. **Blog/YouTube**
   - Tutorial video
   - Articolo tecnico su come funziona

4. **Alternativeto.net**
   - Aggiungi WebMorph come alternativa a converter online

---

## ✅ Checklist Finale

Prima di distribuire:

- [ ] Versione testata completamente
- [ ] Pacchetto release creato (`build-release.ps1`)
- [ ] Screenshot preparati
- [ ] Descrizione AMO scritta
- [ ] Privacy Policy creata
- [ ] LICENSE file aggiunto
- [ ] README.txt controllato
- [ ] Link supporto funzionanti
- [ ] Test su sistema pulito fatto
- [ ] Backup del codice (Git tag)

**Quando tutto è ✅:**

1. Crea Git tag: `git tag v1.0.0`
2. Push: `git push origin v1.0.0`
3. Carica su AMO o distribuisci pacchetto
4. Annuncia il rilascio! 🎉

---

## 📞 Contatti

Per domande sulla distribuzione:

- **Mozilla Add-ons Forum:** https://discourse.mozilla.org/c/add-ons/35
- **Extension Workshop:** https://extensionworkshop.com/
- **Documentazione:** Vedi `PUBLISHING.md`

---

**Buona distribuzione!** 🚀
