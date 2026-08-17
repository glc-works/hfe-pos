#!/usr/bin/env python3
"""Drama Engine for Headless World.Hfeit.
Procedural Conflict & Drama Scenario Generator simulating real-world municipal tax audits,
blackouts, supply chain disputes, IP theft, and forensic year-end audits.
"""

import random
from enum import Enum
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field


class DramaScenarioType(str, Enum):
    BAPENDA_PB1_AUDIT = "BAPENDA_PB1_AUDIT"
    RUSH_HOUR_BLACKOUT = "RUSH_HOUR_BLACKOUT"
    GAYO_INHERITANCE_DISPUTE = "GAYO_INHERITANCE_DISPUTE"
    STOLEN_ROAST_RECIPE = "STOLEN_ROAST_RECIPE"
    YEAR_END_FORENSIC_AUDIT = "YEAR_END_FORENSIC_AUDIT"


@dataclass
class DramaChoice:
    choice_id: str
    title: str
    description: str
    is_recommended: bool
    risk_level: str  # LOW, MEDIUM, CRITICAL
    journal_effect: Optional[Dict[str, Any]] = None
    outcome_summary: str = ""


@dataclass
class DramaEventPayload:
    event_id: str
    scenario_type: DramaScenarioType
    title: str
    severity: str  # INFO, WARNING, CRITICAL
    narrative: str
    stakeholders: List[str]
    context_data: Dict[str, Any]
    choices: List[DramaChoice]
    resolved_choice_id: Optional[str] = None
    resolution_details: Optional[Dict[str, Any]] = None


class DramaEngine:
    """Procedural conflict and drama generator with double-entry journal accounting impact."""

    def __init__(self, seed: int = 42):
        self.rng = random.Random(seed)
        self.event_counter = 0

    def generate_scenario(self, scenario_type: DramaScenarioType, context: Optional[Dict[str, Any]] = None) -> DramaEventPayload:
        self.event_counter += 1
        eid = f"DRM-{self.event_counter:04d}"
        ctx = context or {}

        if scenario_type == DramaScenarioType.BAPENDA_PB1_AUDIT:
            tax_recorded = ctx.get("tax_collected", 4_500_000)
            return DramaEventPayload(
                event_id=eid,
                scenario_type=scenario_type,
                title="🚨 Inspeksi Mendadak Bapenda — Audit Pajak Restoran 10% (PB1)",
                severity="WARNING",
                narrative="Tim Pemeriksa Pajak Daerah Bapenda mendatangi gerai meminta rekonsiliasi kas register vs setoran SNAP BI.",
                stakeholders=["Inspektur Pajak Bapenda", "Kasir Siti", "Branch Manager Dewi"],
                context_data={"pb1_tax_collected_idr": tax_recorded},
                choices=[
                    DramaChoice(
                        choice_id="OPT_DISCLOSE_ALL",
                        title="(Recommended) Serahkan Arsip Transaksi & Rekening Koran SNAP BI",
                        description="Buka seluruh POS Z-report, log audit e-faktur, dan settlement mutasi SNAP BI.",
                        is_recommended=True,
                        risk_level="LOW",
                        journal_effect=None,  # 100% verified, 0 penalty
                        outcome_summary="Pemeriksaan tuntas dalam 30 menit. Bapenda menerbitkan Surat Keterangan Pajak Nihil (SKPN).",
                    ),
                    DramaChoice(
                        choice_id="OPT_CONCEAL_CASH",
                        title="Sembunyikan Buku Kas Laci Fisik",
                        description="Hanya menunjukkan transaksi QRIS elektronik dan menyembunyikan setoran tunai.",
                        is_recommended=False,
                        risk_level="CRITICAL",
                        journal_effect={
                            "debit_account": "6910",
                            "debit_name": "Beban Denda & Sanksi Bunga Pajak Daerah",
                            "credit_account": "2125",
                            "credit_name": "Hutang Denda SKPDKB Bapenda",
                            "amount_idr": 15_000_000,
                        },
                        outcome_summary="Bapenda menemukan selisih stock vs omzet. Diterbitkan SKPDKB plus denda 200% senilai Rp 15.000.000.",
                    ),
                ],
            )

        elif scenario_type == DramaScenarioType.RUSH_HOUR_BLACKOUT:
            unprocessed_orders = ctx.get("pending_orders", 8)
            return DramaEventPayload(
                event_id=eid,
                scenario_type=scenario_type,
                title="⚡ Pemadaman Listrik Mendadak Saat Rush Hour (12:30 WIB)",
                severity="CRITICAL",
                narrative="Trafo PLN lokal meledak saat antrean makan siang mencapai 8 pesanan aktif.",
                stakeholders=["Barista Budi", "Customer Antrean", "Sistem POS Offline Buffer"],
                context_data={"pending_orders": unprocessed_orders},
                choices=[
                    DramaChoice(
                        choice_id="OPT_OFFLINE_BUFFER",
                        title="(Recommended) Aktifkan SQLite Offline Buffer & Mobile Hotspot",
                        description="Lanjutkan penerimaan pesanan dan simpan transaksi di antrean lokal terenkripsi.",
                        is_recommended=True,
                        risk_level="LOW",
                        journal_effect=None,
                        outcome_summary="Transaksi offline berhasil direkonsiliasi otomatis via idempotent replay saat listrik menyala.",
                    ),
                    DramaChoice(
                        choice_id="OPT_ABORT_OPERATIONS",
                        title="Tutup Operasional Kasir & Tolak Antrean",
                        description="Membatalkan seluruh pesanan yang sedang menunggu di kasir.",
                        is_recommended=False,
                        risk_level="MEDIUM",
                        journal_effect={
                            "debit_account": "6810",
                            "debit_name": "Beban Kerugian Pembatalan Pesanan Rusak",
                            "credit_account": "1420",
                            "credit_name": "Persediaan Bahan Baku Makanan Terbuang",
                            "amount_idr": 850_000,
                        },
                        outcome_summary="Kehilangan omzet Rp 1.5M dan bahan makanan yang telah diekstraksi terbuang sia-sia.",
                    ),
                ],
            )

        elif scenario_type == DramaScenarioType.GAYO_INHERITANCE_DISPUTE:
            disputed_invoice = ctx.get("invoice_amount", 18_000_000)
            return DramaEventPayload(
                event_id=eid,
                scenario_type=scenario_type,
                title="⚖️ Sengketa Waris Hak Ulayat Kebun Kopi Gayo 25 Hektar",
                severity="WARNING",
                narrative="Dua faksi keluarga mengklaim hak atas royalti dan pembayaran panen 200kg green beans.",
                stakeholders=["Koperasi Gayo Faksi A", "Koperasi Gayo Faksi B", "Bagian Pengadaan"],
                context_data={"disputed_invoice_idr": disputed_invoice},
                choices=[
                    DramaChoice(
                        choice_id="OPT_LEGAL_ESCROW",
                        title="(Recommended) Alihkan Pembayaran ke Rekening Escrow Titipan Pengadilan",
                        description="Bekukan transfer langsung dan tahan dana di akun konsinyasi hingga putusan inkrah.",
                        is_recommended=True,
                        risk_level="LOW",
                        journal_effect={
                            "debit_account": "2110",
                            "debit_name": "Hutang Usaha Pemasok Gayo",
                            "credit_account": "2190",
                            "credit_name": "Titipan Dana Konsinyasi Pengadilan (Escrow)",
                            "amount_idr": disputed_invoice,
                        },
                        outcome_summary="Perusahaan terlindungi dari tuntutan ganda; pasokan biji kopi tetap aman terlindungi kontrak.",
                    ),
                    DramaChoice(
                        choice_id="OPT_DIRECT_PAYMENT",
                        title="Bayar Langsung ke Rekening Pribadi Pengurus Lama",
                        description="Mencairkan dana invoice langsung tanpa menunggu keabsahan surat waris.",
                        is_recommended=False,
                        risk_level="CRITICAL",
                        journal_effect={
                            "debit_account": "6920",
                            "debit_name": "Beban Kerugian Sengketa Hukum Pemasok",
                            "credit_account": "1110",
                            "credit_name": "Kas Laci / Bank",
                            "amount_idr": disputed_invoice,
                        },
                        outcome_summary="Faksi lawan melayangkan somasi dan perdata; perusahaan dipaksa membayar ganti rugi ganda.",
                    ),
                ],
            )

        elif scenario_type == DramaScenarioType.STOLEN_ROAST_RECIPE:
            return DramaEventPayload(
                event_id=eid,
                scenario_type=scenario_type,
                title="🕵️ Percobaan Spionase Profil Roasting Signature Blend",
                severity="WARNING",
                narrative="Mantan asisten roaster mencoba mengunduh telemetry curve mesin roaster Artisan.",
                stakeholders=["Head Roaster Agus", "Security Tim IT", "Pesaing Franchise"],
                context_data={"recipe_asset_value_idr": 50_000_000},
                choices=[
                    DramaChoice(
                        choice_id="OPT_ENFORCE_RBAC",
                        title="(Recommended) Kunci Akses IoT Roaster dengan Dual-Factor HMAC Token",
                        description="Cabut hak akses USB, enkripsi telemetry profile kurva roasting, dan terbitkan NDA breach warning.",
                        is_recommended=True,
                        risk_level="LOW",
                        journal_effect=None,
                        outcome_summary="Eksfiltrasi resep digagalkan 100%. Hak kekayaan intelektual signature blend tetap eksklusif.",
                    ),
                    DramaChoice(
                        choice_id="OPT_IGNORE_BREACH",
                        title="Abaikan Pelanggaran Prosedur Keamanan",
                        description="Menganggap profiling suhu roasting adalah pengetahuan umum tanpa perlindungan rahasia dagang.",
                        is_recommended=False,
                        risk_level="CRITICAL",
                        journal_effect={
                            "debit_account": "6930",
                            "debit_name": "Amortisasi Penurunan Nilai Goodwill / Brand",
                            "credit_account": "1810",
                            "credit_name": "Aset Tak Berwujud — Resep Kopi Rahasia",
                            "amount_idr": 25_000_000,
                        },
                        outcome_summary="Pesaing meluncurkan produk tiruan identik dengan harga 30% lebih murah; margin penjualan rontok.",
                    ),
                ],
            )

        elif scenario_type == DramaScenarioType.YEAR_END_FORENSIC_AUDIT:
            return DramaEventPayload(
                event_id=eid,
                scenario_type=scenario_type,
                title="🏆 Audit Forensik Tutup Buku Tahunan oleh KAP Santoso & Rekan",
                severity="INFO",
                narrative="Auditor independen memeriksa keabsahan jurnal debet/kredit, PSAK 69, dan integritas neraca saldo.",
                stakeholders=["Managing Partner KAP Santoso", "Finance Director", "Internal Auditor"],
                context_data={"fiscal_year": "2026", "standard": "SAK-EMKM & PSAK 69"},
                choices=[
                    DramaChoice(
                        choice_id="OPT_FULL_AUDIT_TRAIL",
                        title="(Recommended) Buka Akses Proof Map, Ledger Invariants, & Opname Stok",
                        description="Sajikan jejak audit immutable, kalkulasi susut 15% roasting, dan pembuktian matematis Debet == Kredit.",
                        is_recommended=True,
                        risk_level="LOW",
                        journal_effect=None,
                        outcome_summary="KAP Santoso menerbitkan Opini Wajar Tanpa Pengecualian (WTP) Clean Stamp.",
                    ),
                    DramaChoice(
                        choice_id="OPT_LIMIT_SCOPE",
                        title="Batasi Akses Auditor ke Log Pembelian Biji Hijau",
                        description="Menolak verifikasi fisik persediaan gudang kopi mentah.",
                        is_recommended=False,
                        risk_level="CRITICAL",
                        journal_effect={
                            "debit_account": "6940",
                            "debit_name": "Beban Biaya Investigasi Audit Tambahan",
                            "credit_account": "1120",
                            "credit_name": "Bank Settlement",
                            "amount_idr": 12_000_000,
                        },
                        outcome_summary="Auditor menerbitkan Disclaimer of Opinion (Menolak Memberikan Opini); akses fasilitas bank dibekukan.",
                    ),
                ],
            )

        raise ValueError(f"Unknown drama scenario type: {scenario_type}")

    def evaluate_choice(self, drama_event: DramaEventPayload, choice_id: str) -> Dict[str, Any]:
        """Resolves the user choice, sets outcomes, and returns double-entry journal impact."""
        selected_choice = next((c for c in drama_event.choices if c.choice_id == choice_id), None)
        if not selected_choice:
            raise ValueError(f"Choice {choice_id} not found in drama event {drama_event.event_id}")

        drama_event.resolved_choice_id = choice_id
        resolution = {
            "event_id": drama_event.event_id,
            "scenario_type": drama_event.scenario_type.value,
            "selected_choice_id": choice_id,
            "title": selected_choice.title,
            "risk_level": selected_choice.risk_level,
            "outcome_summary": selected_choice.outcome_summary,
            "journal_effect": selected_choice.journal_effect,
            "compliance_pass": selected_choice.risk_level == "LOW",
        }
        drama_event.resolution_details = resolution
        return resolution


def test_drama_engine():
    print("Testing DramaEngine...")
    engine = DramaEngine(seed=42)

    # 1. Test BAPENDA PB1 Audit
    p1 = engine.generate_scenario(DramaScenarioType.BAPENDA_PB1_AUDIT, {"tax_collected": 5_000_000})
    assert p1.scenario_type == DramaScenarioType.BAPENDA_PB1_AUDIT
    assert len(p1.choices) == 2
    res1 = engine.evaluate_choice(p1, "OPT_DISCLOSE_ALL")
    assert res1["compliance_pass"] is True
    assert res1["journal_effect"] is None
    print("  ✓ BAPENDA PB1 Audit scenario & clean resolution verified.")

    # 2. Test RUSH HOUR BLACKOUT
    p2 = engine.generate_scenario(DramaScenarioType.RUSH_HOUR_BLACKOUT, {"pending_orders": 10})
    res2 = engine.evaluate_choice(p2, "OPT_OFFLINE_BUFFER")
    assert res2["compliance_pass"] is True
    print("  ✓ Rush Hour Blackout scenario & offline caching verified.")

    # 3. Test GAYO INHERITANCE DISPUTE Escrow
    p3 = engine.generate_scenario(DramaScenarioType.GAYO_INHERITANCE_DISPUTE, {"invoice_amount": 20_000_000})
    res3 = engine.evaluate_choice(p3, "OPT_LEGAL_ESCROW")
    assert res3["journal_effect"]["credit_account"] == "2190"  # Escrow account
    assert res3["journal_effect"]["amount_idr"] == 20_000_000
    print("  ✓ Gayo Inheritance Dispute escrow routing verified.")

    # 4. Test STOLEN ROAST RECIPE
    p4 = engine.generate_scenario(DramaScenarioType.STOLEN_ROAST_RECIPE)
    res4 = engine.evaluate_choice(p4, "OPT_ENFORCE_RBAC")
    assert res4["compliance_pass"] is True
    print("  ✓ Stolen Roast Recipe IP protection verified.")

    # 5. Test YEAR END FORENSIC AUDIT (WTP Stamp)
    p5 = engine.generate_scenario(DramaScenarioType.YEAR_END_FORENSIC_AUDIT)
    res5 = engine.evaluate_choice(p5, "OPT_FULL_AUDIT_TRAIL")
    assert res5["compliance_pass"] is True
    print("  ✓ Year-End Forensic Audit WTP clean opinion verified.")

    print("All DramaEngine tests passed successfully!")


if __name__ == "__main__":
    test_drama_engine()
