import React from 'react';
import { Card, Button, Badge } from '@/ui';

export interface CardIdentityItem {
  id: string;
  cardType: 'STAFF_BADGE' | 'VIP_LOYALTY' | 'SUPPLIER_PASS' | 'AUDITOR_CLEARANCE';
  holderName: string;
  role: string;
  badgeLabel: string;
  icon: string;
  actionText: string;
}

interface CardTapIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTapCard: (card: CardIdentityItem) => void;
}

const CANONICAL_CARDS: CardIdentityItem[] = [
  {
    id: 'crd-siti-01',
    cardType: 'STAFF_BADGE',
    holderName: 'Siti Rahma',
    role: 'ACTOR:BARISTA (Head Cashier)',
    badgeLabel: 'PIN 123456 • Shift Pagi',
    icon: '☕',
    actionText: 'Tap untuk Login Kasir POS',
  },
  {
    id: 'crd-wayan-02',
    cardType: 'STAFF_BADGE',
    holderName: 'Chef Wayan',
    role: 'ACTOR:CHEF (Kitchen Master)',
    badgeLabel: 'Station: Hot Kitchen',
    icon: '🍳',
    actionText: 'Tap untuk Nyalakan KDS Dapur',
  },
  {
    id: 'crd-alexander-03',
    cardType: 'VIP_LOYALTY',
    holderName: 'Bpk. Alexander III',
    role: 'ACTOR:GUEST_VIP (Meja 03)',
    badgeLabel: 'Gold Tier • 1.250 Poin • Alergen Susu',
    icon: '👑',
    actionText: 'Tap untuk Order Meja QR',
  },
  {
    id: 'crd-agus-04',
    cardType: 'SUPPLIER_PASS',
    holderName: 'Mas Agus',
    role: 'ACTOR:ROASTER_MFG (Pabrik)',
    badgeLabel: 'BOM 100kg • Susut 15%',
    icon: '🚚',
    actionText: 'Tap untuk Kirim 85kg Biji Kopi',
  },
  {
    id: 'crd-santoso-05',
    cardType: 'AUDITOR_CLEARANCE',
    holderName: 'Drs. Santoso, CPA',
    role: 'ACTOR:CPA_AUDITOR (KAP Mitra)',
    badgeLabel: 'Read-Only Audit • Closing Seal',
    icon: '📑',
    actionText: 'Tap untuk Audit 5-Tahun WTP',
  },
];

export const CardTapIdentityModal: React.FC<CardTapIdentityModalProps> = ({
  isOpen,
  onClose,
  onTapCard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-lg bg-slate-900 border-slate-700 text-white shadow-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪪</span>
            <div>
              <h2 className="text-sm font-bold tracking-wide text-slate-100">
                Pillar CARD: Tap-to-Identity NFC Simulator
              </h2>
              <p className="text-[11px] text-slate-400">
                Pilih kartu fisik/digital untuk beralih konteks operator & aktor secara instan
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </Button>
        </div>

        <div className="space-y-2.5 my-4 max-h-[60vh] overflow-y-auto pr-1">
          {CANONICAL_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                onTapCard(card);
                onClose();
              }}
              className="group p-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-amber-500/50 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-xl border border-slate-700">
                  {card.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white">{card.holderName}</span>
                    <Badge variant="outline" className="text-[9px] text-slate-300 border-slate-600">
                      {card.role}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-amber-400/90 font-mono mt-0.5">{card.badgeLabel}</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="text-[11px] h-7 px-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                Tap ➔
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
          <span>🔒 Enkripsi: NFC ISO-14443 Type A • SHA-256</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Tutup
          </Button>
        </div>
      </Card>
    </div>
  );
};
