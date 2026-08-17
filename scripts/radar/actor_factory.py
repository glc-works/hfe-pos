#!/usr/bin/env python3
"""
Actor & Persona Factory Engine (scripts/radar/actor_factory.py)
Standard: POS-ENG-STD-001 & HFE-ECOSYSTEM-STD-001

Dynamically spawns, synthesizes, and registers multi-dimensional Personas/Actors
into CRM Contact entities with 5 canonical dimensions.
"""

import uuid
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class ActorPersona:
    id: str
    name: str
    role: str
    surface: str
    pillar: str
    cluster: str
    cadence: str
    contact_type: str
    phone: str
    company_book_id: str
    labels: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_contact_payload(self) -> Dict[str, Any]:
        dimension_labels = [
            f"ACTOR:{self.role}",
            f"SURFACE:{self.surface}",
            f"PILLAR:{self.pillar}",
            f"CLUSTER:{self.cluster}",
            f"CADENCE:{self.cadence}",
        ] + self.labels
        
        return {
            "id": self.id,
            "company_book_id": self.company_book_id,
            "name": self.name,
            "contact_type": self.contact_type,
            "phone": self.phone,
            "labels": dimension_labels,
            "metadata": self.metadata,
        }

class ActorPersonaFactory:
    @staticmethod
    def create(
        name: str,
        role: str,
        surface: str,
        pillar: str,
        cluster: str,
        cadence: str,
        contact_type: str = "EMPLOYEE",
        phone: str = "+6281200000000",
        company_book_id: str = "cb-tenancy-downstream-0099",
        labels: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> ActorPersona:
        actor_id = f"ct-{uuid.uuid4().hex[:12]}"
        return ActorPersona(
            id=actor_id,
            name=name,
            role=role,
            surface=surface,
            pillar=pillar,
            cluster=cluster,
            cadence=cadence,
            contact_type=contact_type,
            phone=phone,
            company_book_id=company_book_id,
            labels=labels or [],
            metadata=metadata or {},
        )

    @classmethod
    def get_canonical_roster(cls, company_book_id: str = "cb-tenancy-downstream-0099") -> List[ActorPersona]:
        return [
            cls.create(
                name="Mas Budi (Founder & Store Owner)",
                role="STORE_OWNER",
                surface="COMPANY_BOOK",
                pillar="ADMIN",
                cluster="HOSPITALITY",
                cadence="ASYNC_DAILY",
                contact_type="OWNER",
                phone="+6281111111111",
                company_book_id=company_book_id,
                labels=["TIER:FOUNDER_ADMIN"],
                metadata={"title": "Founder & Owner PT Artisan Kopi", "pos_pin": "999999"}
            ),
            cls.create(
                name="Siti Rahma (Head Barista & Cashier)",
                role="BARISTA",
                surface="POS_CASHIER",
                pillar="POS",
                cluster="HOSPITALITY",
                cadence="RUNTIME_<30s",
                contact_type="EMPLOYEE",
                phone="+6281222222222",
                company_book_id=company_book_id,
                labels=["SHIFT:MORNING", "SECURITY:PIN_AUTH"],
                metadata={"title": "Head Barista", "pos_pin": "123456"}
            ),
            cls.create(
                name="Chef Wayan (Kitchen Master)",
                role="CHEF",
                surface="KDS_KITCHEN",
                pillar="ORDER",
                cluster="HOSPITALITY",
                cadence="RUNTIME_<30s",
                contact_type="EMPLOYEE",
                phone="+6281333333333",
                company_book_id=company_book_id,
                labels=["STATION:HOT_KITCHEN"],
                metadata={"title": "Executive Kitchen Chef"}
            ),
            cls.create(
                name="Bpk. Alexander Raden Christopher III (VIP Guest)",
                role="GUEST_VIP",
                surface="CUSTOMER_MOBILE",
                pillar="ORDER",
                cluster="HOSPITALITY",
                cadence="RUNTIME_INTERACTIVE",
                contact_type="CUSTOMER",
                phone="+6281444444444",
                company_book_id=company_book_id,
                labels=["TIER:GOLD_LOYALTY", "ALLERGEN:LACTOSE_INTOLERANT"],
                metadata={"points": 1250, "loyalty_tier": "GOLD"}
            ),
            cls.create(
                name="Mas Agus (Roaster Pabrik Sangrai)",
                role="ROASTER_MFG",
                surface="COMPANY_BOOK",
                pillar="BOOK",
                cluster="MFG",
                cadence="ASYNC_DAILY",
                contact_type="VENDOR",
                phone="+6281555555555",
                company_book_id="cb-tenancy-upstream-0098",
                labels=["PRODUCE:ROASTED_BEANS", "BOM:ASSEMBLY_PROBAT"],
                metadata={"factory": "Nusantara Sangrai Roastery"}
            ),
            cls.create(
                name="Pak Hendra (Mandor Kebun Gayo)",
                role="FARM_MANAGER",
                surface="COMPANY_BOOK",
                pillar="BOOK",
                cluster="AGRI",
                cadence="PERIODIC_HARVEST",
                contact_type="VENDOR",
                phone="+6281666666666",
                company_book_id="cb-tenancy-upstream-0098",
                labels=["ASSET:PSAK69_BIOLOGICAL", "PRODUCE:GREEN_BEANS"],
                metadata={"plantation_size_ha": 50, "trees_count": 50000}
            ),
            cls.create(
                name="Drs. Santoso, Ak., M.Ak., CPA (Auditor Eksternal)",
                role="CPA_AUDITOR",
                surface="COMPANY_BOOK",
                pillar="BOOK",
                cluster="PRACTICE",
                cadence="PERIODIC_MONTH_END",
                contact_type="AUDITOR_PARTNER",
                phone="+6281777777777",
                company_book_id=company_book_id,
                labels=["AUDIT:WTP_CERTIFIED", "ACCESS:READ_ONLY"],
                metadata={"firm": "KAP Santoso & Rekan Registered CPA"}
            ),
        ]

if __name__ == "__main__":
    roster = ActorPersonaFactory.get_canonical_roster()
    print(f"✅ ActorPersonaFactory Initialized: {len(roster)} Canonical Personas Registered.")
