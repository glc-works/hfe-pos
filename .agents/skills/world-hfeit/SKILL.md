---
name: world-hfeit
description: "Launcher, controller, and living testbed for World.Hfeit — the autonomous commercial business simulation, interactive coffee tycoon mini-game, novel-driven narrative generator, and Gymnasium RL environment."
---

# 🌐 World.Hfeit — Living Commercial Simulator, Novel Narrative Engine & RL Testbed

`World.Hfeit` (`world.hfeit.com`) adalah ekosistem simulasi bisnis hidup otonom berbasis arsitektur **Headless-First** yang menggabungkan:
1. **The Novel Narrative Story Engine**: Mencetak bab novel sastra, dialog karakter hidup, dan drama operasional (Sidak Bapenda PB1 10%, sengketa warisan Kebun Gayo, kebocoran resep).
2. **The Continuous 24-Hour Multi-Agent Simulation Engine**: Jam operasional dinamis dari Merchant Settings, siklus siang (POS & tamu) dan malam (Cold Brew 12h, Stocktake fisik, depresiasi).
3. **The Gymnasium Reinforcement Learning (RL) Environment**: Antarmuka `env.step(action)` deterministik berkecepatan **Warp Speed 10.000x** untuk training model AI.
4. **The Interactive Web Tycoon Mini-Game & UI Testbed**: Visualisasi kanvas 2D, tap kartu identitas NFC (*Pillar CARD*), dan testbed kartu meja anti-tabrakan.

---

## 🚀 Panduan Memulai Cepat (Quickstart Commands)

### 1. 📖 Menjalankan Mode Cerita Novel Interaktif (Vivid Novel Narrative)
Untuk membaca narasi novel bisnis, dialog karakter, dan drama operasional per bab:

```bash
python3 scripts/agent_town/world_sim.py --days 1 --speed fast --novel
```

*Opsi Tambahan*:
* `--speed slow` (500ms), `--speed fast` (50ms), `--speed warp` (0ms instan).
* `--hours 24h` (Paksa mode 24 jam nonstop) atau `--hours default` (Sesuai jam buka-tutup merchant).
* `--drama-rate 0.5` (Atur frekuensi munculnya drama bisnis dari 0.0 s/d 1.0).

---

### 2. 🤖 Menjalankan Simulasi Warp Speed & Verifikasi Jurnal (30 Hari)
Untuk memproses 30 hari penuh (2.880 ticks) dalam hitungan milidetik dan memverifikasi integritas $Debits == Credits$:

```bash
python3 scripts/hfe.py town sim --days 30 --speed warp
```

---

### 3. 🧠 Menjalankan Environment Reinforcement Learning (Gymnasium / RL Step)
Untuk menghubungkan agen AI otonom atau menjalankan optimasi kebijakan bisnis:

```python
from scripts.agent_town.world_env import WorldGymEnv

env = WorldGymEnv()
obs, info = env.reset()

# Actions: [0: NO_OP, 1: SET_PREMIUM, 2: SET_DISCOUNT, 3: HIRE_STAFF, 4: ROAST_BOM, 5: ORDER_BEANS, 6: PROMO_QRIS, 7: TAX_AUDIT]
obs, reward, terminated, truncated, info = env.step(action=4) # Roasting 100kg BOM
print(f"Reward: Rp {reward:,.0f} | Jurnal Klop: {info['balanced']}")
```

---

### 4. 🎭 Menjalankan Simulasi Horison Roleplay 5 Tahun
Untuk menonton drama perjalanan bisnis Mas Budi dari Day-0 sampai Tahun ke-5 Audit WTP:

```bash
python3 scripts/roleplay-runner.py --horizon-years 5 --speed fast
```

---

### 5. 🎮 Menjalankan Web Mini-Game & Living UI Testbed
Untuk membuka kanvas 2D kota, tap kartu NFC staf, dan denah meja kasir interaktif:

```bash
cd /Users/aldi/claudefiles/hfe-pos
npm run dev
```
Buka browser di **`http://localhost:5173`**, lalu klik tombol **`[🎮 World.Hfeit]`** di kotak mengambang kanan bawah (*HFE Dev Toolkit & QA Player*) atau tekan `Option+D` (*FloatKit*).

---

### 6. ⚡ 1-Click Interactive Menu Launcher
Cukup jalankan script launcher tunggal untuk memilih mode apa pun secara interaktif:

```bash
./scripts/start.sh
```

---

## 🛡️ Invariant Verifikasi & Pengujian

* **Verifikasi Engine Headless World**:
  ```bash
  python3 scripts/agent_town/spawn_engine.py && python3 scripts/agent_town/actor_engine.py && python3 scripts/agent_town/drama_engine.py
  ```
* **Jalankan Seluruh 96 Vitest Test Suites Frontend**:
  ```bash
  cd /Users/aldi/claudefiles/hfe-pos && npm test -- --run
  ```
* **Jalankan Audit Radar 9-Pillar**:
  ```bash
  python3 scripts/hfe-rad0.py && python3 ../hfe-pos/scripts/hfex-rad0.py
  ```
