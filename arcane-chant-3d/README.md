# Arcane Chant 3D

[Play the demo](https://zixma13.github.io/shortlist/arcane-chant-3d/) · [Download the HTML](index.html) · [Back to all demos](../README.md)

A 3D voice-spellcasting arena built as a standalone single-file HTML experience. Speak Thai incantations into your microphone to awaken fire energy, wait for the elemental gather timer, and shout **"Fireball!"** to unleash projectiles—progressing through **Fireball Vol. 1 to Vol. 9** as incantations shrink, charge times drop to zero, range doubles from `10m` to `20m`, and damage climbs by `+200%`.

## Controls & Requirements

- **Browser**: Requires WebGL2 on `https://` or `localhost`. Voice recognition (`th-TH` + English `"fireball"`) uses the **Web Speech API** (Chrome, Edge, Safari); a full keyboard/text simulation mode (`Space` / text input) is built in for silent play or browsers without SpeechRecognition.
- **Voice Spellcasting**: Click **เปิดไมค์ร่ายเวทย์**, speak the highlighted Thai incantation segments on the Spell Altar, wait for the gather timer, then say `"Fireball"` (or `"ไฟร์บอล"` / `"ไฟบอล"`).
- **Movement & Aim**: `W A S D` or Arrow keys to move; drag mouse (or **Double-Click** canvas for pointer lock, `Esc` to release) to aim.
- **Shortcuts**: `V` toggles 1st-person staff view / 3rd-person mage view; `G` opens the **Grimoire Codex** (includes a Sandbox toggle to test any volume from **Vol. 1 – Vol. 9** immediately); `Space` simulates chanting/firing without a microphone.

## Spell Progression (Vol. 1 – Vol. 9)

| Volume | Incantation | Gather | Condense | Range | Damage |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Vol. 1** | Full Thai prayer (`ข้าขอสักการะเทพอัคคี...`) | 3.5s | 2.5s | 10m | 20 |
| **Vol. 2** | Shortened prayer | 3.5s | 2.5s | 10m | 20 |
| **Vol. 3** | Shortened prayer | **1.0s** | 2.5s | 10m | 20 |
| **Vol. 4** | Shortened prayer | 1.0s | **0s (Instant)** | **20m** | 20 |
| **Vol. 5** | **`ชาร์จพลังไฟ`** | 1.0s | 0s | 20m | 20 |
| **Vol. 6** | `ชาร์จพลังไฟ` | **0s (Instant)** | 0s | 20m | 20 |
| **Vol. 7** | **None (Silent Chant)** | 0s | 0s | 20m | 20 |
| **Vol. 8** | None | 0s | 0s | 20m | **30 (+50%)** |
| **Vol. 9** | None | 0s | 0s | 20m | **60 (+200%)** |

## Packaging & Credits

- Standalone single-file HTML (**831,582 bytes**, zero external runtime requests).
- Bundles **Three.js r170** (MIT License) with procedural textures, particles, and Web Audio API sound synthesis. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and [LICENSE](LICENSE).

![Arcane Chant 3D](preview.jpg)
