# WebMorph - Guida all'Installazione

## Installazione Rapida (Windows)

### Step 1: Scarica

Scarica l'ultima versione o clona il repository:
```bash
git clone https://github.com/yourusername/webmorph.git
```

**⚠️ IMPORTANTE:** Estrai in un percorso semplice come `C:\WebMorph`

❌ **NON usare:** Cartella Download, Desktop o Programmi
✅ **USA:** `C:\WebMorph`, `D:\Tools\WebMorph`, ecc.

---

### Step 2: Esegui l'Installer

Apri la cartella di installazione e fai doppio clic su:
```
scripts\INSTALL.bat
```

L'installer farà automaticamente:
- ✅ Download di Python 3.11 (se non già installato) → ~10 MB
- ✅ Download di FFmpeg (se non già installato) → ~75 MB
- ✅ Configurazione del native messaging host
- ✅ Registrazione con Firefox

**Non servono diritti di amministratore!** Tutto viene installato nella cartella locale.

---

### Step 3: Carica l'Estensione in Firefox

1. Apri Firefox
2. Digita `about:debugging` nella barra degli indirizzi
3. Clicca **"Questo Firefox"** (barra laterale sinistra)
4. Clicca **"Carica componente aggiuntivo temporaneo..."**
5. Vai a `[cartella-installazione]\extension\`
6. Seleziona `manifest.json`
7. Fatto! 🎉

---

### Step 4: Verifica

Clicca sull'icona WebMorph nella barra degli strumenti di Firefox.

Dovresti vedere:
- ✅ Extension: Active
- ✅ Native Host: Ready
- ✅ FFmpeg: Ready

**Tutto verde?** Sei pronto per usare WebMorph!

---

## Problemi Comuni

### "Native Host: Not Found"

**Causa:** Percorso di installazione sbagliato o installer non eseguito

**Soluzione:**
1. Sposta la cartella in `C:\WebMorph`
2. Esegui `scripts\INSTALL.bat` di nuovo
3. Riavvia Firefox completamente

---

### "Disconnected from native host"

**Causa:** Installazione nella cartella Download o percorso con spazi

**Soluzione:**
1. Sposta in `C:\WebMorph` (percorso semplice)
2. Esegui `scripts\INSTALL.bat`
3. Ricarica l'estensione in Firefox

---

### Hai ancora problemi?

Controlla `native-host\host.log` per messaggi di errore dettagliati.

---

## Note Importanti

⚠️ **Esegui l'installer su OGNI computer**
- I file di configurazione sono specifici per ogni macchina
- Copiare semplicemente la cartella non funzionerà
- Devi eseguire `INSTALL.bat` su ogni PC

⚠️ **Non spostare la cartella dopo l'installazione**
- Se devi spostarla, esegui di nuovo l'installer
- I percorsi sono salvati nei file di configurazione

⚠️ **Usa percorsi semplici**
- ✅ Bene: `C:\WebMorph`
- ❌ Male: `C:\Users\Nome\Downloads\WebMorph--WebM-to-MP4-Converter-main`

---

## Disinstallazione

1. Rimuovi l'estensione da Firefox
2. Elimina la cartella di installazione
3. Fatto!

Non serve pulire il registro (a meno che tu non voglia).

---

## Hai bisogno di aiuto?

- 📖 [Documentazione Completa](README.md)
- 🐛 [Segnala Problemi](https://github.com/yourusername/webmorph/issues)

---

**WebMorph** - Converti WebM in MP4 automaticamente in Firefox
Versione 1.0.0 | Licenza MIT
