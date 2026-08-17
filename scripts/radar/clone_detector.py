#!/usr/bin/env python3
"""
scripts/radar/clone_detector.py — Structural Clone & Duplicate Component Detector for HFE-POS.
Cadence: LARGE / LIVE (hfex-rad0 --large)
Standard: POS-ENG-STD-001 & HFE-UI-STD-001

Analyzes TSX/JSX components in src/components/, src/views/, and src/ui/.
Normalizes JSX structure (stripping variable names, props, comments, string literals, whitespace)
and computes Jaccard and MinHash token similarity to identify structural duplicate candidates (>85%).
"""

import os
import sys
import glob
import re
import json
import argparse
import time
import hashlib
from typing import List, Dict, Tuple, Set, Any, Optional
from dataclasses import dataclass, field

DEFAULT_SIMILARITY_THRESHOLD = 0.85
DEFAULT_MIN_TOKENS = 12
SHINGLE_SIZE = 3
NUM_MINHASH_PERMUTATIONS = 64

TARGET_DIRS = ["src/components", "src/views", "src/ui"]
EXCLUDE_DIRS = {"node_modules", "dist", ".git", ".storybook", "src/tests"}

@dataclass
class ClonePair:
    file_a: str
    file_b: str
    jaccard_similarity: float
    minhash_similarity: float
    tokens_a_count: int
    tokens_b_count: int
    shared_shingles_count: int
    total_unique_shingles: int

@dataclass
class CloneDetectionSummary:
    total_files_scanned: int
    total_pairs_evaluated: int
    clones_found_count: int
    clone_pairs: List[ClonePair]
    elapsed_seconds: float
    threshold: float
    is_healthy: bool
    details: List[str] = field(default_factory=list)

def strip_comments(code: str) -> str:
    """Strip JSX, multi-line, and single-line comments."""
    # JSX comments: {/* ... */}
    code = re.sub(r'\{\s*/\*.*?\*/\s*\}', ' ', code, flags=re.DOTALL)
    # Multi-line comments: /* ... */
    code = re.sub(r'/\*.*?\*/', ' ', code, flags=re.DOTALL)
    # Single-line comments: // ...
    code = re.sub(r'//.*', ' ', code)
    return code

def normalize_jsx_structure(code: str) -> List[str]:
    """
    Normalizes JSX structure into a sequence of structural tokens.
    Strips variable names, string literals, attribute values, and formatting whitespace.
    Retains JSX tag names, tag opening/closing/self-closing structural markers,
    control-flow constructs (if, else, return, map, switch, case, etc.),
    and standard React hooks (useState, useEffect, useMemo, useCallback, useRef).
    """
    code = strip_comments(code)
    
    # Strip string literals and template literals
    code = re.sub(r'"(?:[^"\\]|\\.)*"', '""', code)
    code = re.sub(r"'(?:[^'\\]|\\.)*'", "''", code)
    code = re.sub(r'`(?:[^`\\]|\\.)*`', '``', code)
    
    # Pattern to match JSX tags and standard structural keywords
    # Matches:
    # 1. Closing tags: </TagName>
    # 2. Self-closing tags: <TagName ... />
    # 3. Opening tags: <TagName ... >
    # 4. Control flow & hooks keywords
    
    tokens: List[str] = []
    
    # Regular expression for JSX tags vs control flow
    tag_regex = re.compile(
        r'(</\s*[A-Za-z0-9_.$]+\s*>)'                             # 1: Closing tag
        r'|(<\s*([A-Za-z0-9_.$]+)(?:\s+[^>]*?)?(/\s*>|>))'        # 2: Open or Self-close tag
        r'|\b(return|if|else|switch|case|default|map|filter|reduce|forEach|useState|useEffect|useMemo|useCallback|useRef|useContext)\b' # 3: Keywords
    )
    
    for match in tag_regex.finditer(code):
        closing_tag = match.group(1)
        open_or_self = match.group(2)
        tag_name = match.group(3)
        tag_end = match.group(4)
        keyword = match.group(5)
        
        if closing_tag:
            clean_tag = re.sub(r'\s+', '', closing_tag)
            tokens.append(clean_tag)
        elif open_or_self:
            is_self = tag_end and '/' in tag_end
            if is_self:
                tokens.append(f"<{tag_name}/>")
            else:
                tokens.append(f"<{tag_name}>")
        elif keyword:
            tokens.append(f":{keyword}")
            
    return tokens

def generate_shingles(tokens: List[str], k: int = SHINGLE_SIZE) -> Set[Tuple[str, ...]]:
    """Generates k-gram shingles from a sequence of normalized tokens."""
    if not tokens:
        return set()
    if len(tokens) < k:
        return {tuple(tokens)}
    return {tuple(tokens[i:i + k]) for i in range(len(tokens) - k + 1)}

def compute_minhash_signature(shingles: Set[Tuple[str, ...]], num_perm: int = NUM_MINHASH_PERMUTATIONS) -> List[int]:
    """
    Computes a MinHash signature vector for a set of shingles.
    Uses MD5 with different seeds for uniform hash dispersion.
    """
    if not shingles:
        return [0] * num_perm
    
    shingle_strings = ["_".join(s) for s in shingles]
    signature = []
    
    for seed in range(num_perm):
        min_val = float('inf')
        for s in shingle_strings:
            # Deterministic hash function per permutation seed
            h = int(hashlib.md5(f"{seed}:{s}".encode('utf-8')).hexdigest()[:8], 16)
            if h < min_val:
                min_val = h
        signature.append(min_val if min_val != float('inf') else 0)
        
    return signature

def estimate_minhash_similarity(sig_a: List[int], sig_b: List[int]) -> float:
    """Estimates Jaccard similarity from two MinHash signatures."""
    if not sig_a or not sig_b or len(sig_a) != len(sig_b) or len(sig_a) == 0:
        return 0.0
    matches = sum(1 for a, b in zip(sig_a, sig_b) if a == b)
    return matches / len(sig_a)

def compute_exact_jaccard(set_a: Set[Any], set_b: Set[Any]) -> float:
    """Computes exact Jaccard similarity between two sets: |A ∩ B| / |A ∪ B|."""
    if not set_a or not set_b:
        return 0.0
    intersection_len = len(set_a.intersection(set_b))
    union_len = len(set_a.union(set_b))
    return intersection_len / union_len if union_len > 0 else 0.0

def scan_component_files(root_dir: str) -> List[str]:
    """Scans all TSX component files in target directories."""
    matched_files = []
    for rel_dir in TARGET_DIRS:
        target_path = os.path.join(root_dir, rel_dir)
        if not os.path.exists(target_path):
            continue
        for root, dirs, files in os.walk(target_path):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for f in files:
                if f.endswith(".tsx") and not f.endswith(".d.ts"):
                    full = os.path.join(root, f)
                    matched_files.append(full)
    return sorted(matched_files)

def run_clone_detection(
    root_dir: Optional[str] = None,
    threshold: float = DEFAULT_SIMILARITY_THRESHOLD,
    min_tokens: int = DEFAULT_MIN_TOKENS
) -> CloneDetectionSummary:
    """
    Executes the full structural clone and duplicate component detector.
    Returns a CloneDetectionSummary.
    """
    if root_dir is None:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    start_time = time.time()
    files = scan_component_files(root_dir)
    
    file_data: Dict[str, Dict[str, Any]] = {}
    
    for f in files:
        rel_path = os.path.relpath(f, root_dir)
        try:
            with open(f, "r", encoding="utf-8", errors="ignore") as fp:
                raw_code = fp.read()
            tokens = normalize_jsx_structure(raw_code)
            if len(tokens) >= min_tokens:
                shingles = generate_shingles(tokens, k=SHINGLE_SIZE)
                minhash_sig = compute_minhash_signature(shingles)
                file_data[rel_path] = {
                    "tokens": tokens,
                    "token_count": len(tokens),
                    "shingles": shingles,
                    "minhash": minhash_sig
                }
        except Exception:
            pass
            
    items = list(file_data.items())
    total_pairs = (len(items) * (len(items) - 1)) // 2 if len(items) > 1 else 0
    clone_pairs: List[ClonePair] = []
    
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            f_a, data_a = items[i]
            f_b, data_b = items[j]
            
            jaccard_sim = compute_exact_jaccard(data_a["shingles"], data_b["shingles"])
            
            if jaccard_sim >= threshold:
                minhash_sim = estimate_minhash_similarity(data_a["minhash"], data_b["minhash"])
                inter_cnt = len(data_a["shingles"].intersection(data_b["shingles"]))
                union_cnt = len(data_a["shingles"].union(data_b["shingles"]))
                
                clone_pairs.append(ClonePair(
                    file_a=f_a,
                    file_b=f_b,
                    jaccard_similarity=jaccard_sim,
                    minhash_similarity=minhash_sim,
                    tokens_a_count=data_a["token_count"],
                    tokens_b_count=data_b["token_count"],
                    shared_shingles_count=inter_cnt,
                    total_unique_shingles=union_cnt
                ))
                
    clone_pairs.sort(key=lambda x: -x.jaccard_similarity)
    elapsed = time.time() - start_time
    
    details = []
    details.append(f"• Component Directories:   {', '.join(TARGET_DIRS)}")
    details.append(f"• TSX Components Scanned:  {len(files)} total files ({len(file_data)} qualified with >={min_tokens} tokens)")
    details.append(f"• Pairwise Comparisons:    {total_pairs} pair evaluations (Shingle Size: {SHINGLE_SIZE}, MinHash: {NUM_MINHASH_PERMUTATIONS} perms)")
    details.append(f"• Similarity Threshold:    >={threshold * 100:.0f}% Structural Jaccard Similarity")
    details.append(f"• Candidate Clones Found:  {len(clone_pairs)} duplicate pair(s) flagged")
    
    # Healthy status: 0 duplicate clones exceeding threshold
    is_healthy = (len(clone_pairs) == 0)
    
    return CloneDetectionSummary(
        total_files_scanned=len(files),
        total_pairs_evaluated=total_pairs,
        clones_found_count=len(clone_pairs),
        clone_pairs=clone_pairs,
        elapsed_seconds=elapsed,
        threshold=threshold,
        is_healthy=is_healthy,
        details=details
    )

def audit(root_dir: Optional[str] = None) -> Any:
    """
    Audit entry point for integration into radar engine / cadences.
    Returns a PillarResult-compatible or audit dict structure.
    """
    from .base import PillarResult
    summary = run_clone_detection(root_dir=root_dir)
    
    gaps = []
    summary_lines = list(summary.details)
    
    if summary.clones_found_count > 0:
        summary_lines.append(f"\n⚠️  [DUPLICATE DETECTIONS] {summary.clones_found_count} candidate duplicate clone(s) flagged (>={summary.threshold * 100:.0f}%):")
        for cp in summary.clone_pairs[:10]:
            line = f"   - [{cp.jaccard_similarity * 100:.1f}% Jaccard / {cp.minhash_similarity * 100:.0f}% MinHash] {cp.file_a} <==> {cp.file_b} ({cp.shared_shingles_count}/{cp.total_unique_shingles} shared shingles)"
            summary_lines.append(line)
            gaps.append(f"Structural clone candidate: {cp.file_a} and {cp.file_b} ({cp.jaccard_similarity * 100:.1f}% similarity)")
    else:
        summary_lines.append("✅ Structural Clone Detector: 100% Unique Architecture (0 duplicate clones >=85%)")
        
    return PillarResult(
        pillar_id=10,
        title="STRUCTURAL CLONE & DUPLICATE COMPONENT DETECTOR (LARGE CADENCE)",
        is_healthy=summary.is_healthy,
        summary_lines=summary_lines,
        gaps=gaps,
        metadata={
            "files_scanned": summary.total_files_scanned,
            "pairs_evaluated": summary.total_pairs_evaluated,
            "clones_found": summary.clones_found_count,
            "elapsed_seconds": summary.elapsed_seconds
        }
    )

def main():
    parser = argparse.ArgumentParser(
        prog="clone_detector",
        description="Structural Clone & Duplicate Component Detector for HFE-POS (TSX / React / JSX)",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--threshold", "-t",
        type=float,
        default=DEFAULT_SIMILARITY_THRESHOLD,
        help=f"Similarity threshold between 0.0 and 1.0 (default: {DEFAULT_SIMILARITY_THRESHOLD})"
    )
    parser.add_argument(
        "--min-tokens", "-m",
        type=int,
        default=DEFAULT_MIN_TOKENS,
        help=f"Minimum tokens required to evaluate component (default: {DEFAULT_MIN_TOKENS})"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output results in JSON format"
    )
    parser.add_argument(
        "--dir", "-d",
        type=str,
        default=None,
        help="Root directory to scan (defaults to repository root)"
    )
    
    args = parser.parse_args()
    summary = run_clone_detection(root_dir=args.dir, threshold=args.threshold, min_tokens=args.min_tokens)
    
    if args.json:
        payload = {
            "version": "1.0.0",
            "standard": "POS-ENG-STD-001 / HFE-UI-STD-001",
            "cadence": "LARGE",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "elapsed_seconds": round(summary.elapsed_seconds, 4),
            "files_scanned": summary.total_files_scanned,
            "pairs_evaluated": summary.total_pairs_evaluated,
            "similarity_threshold": summary.threshold,
            "clones_found_count": summary.clones_found_count,
            "is_healthy": summary.is_healthy,
            "candidate_clones": [
                {
                    "file_a": cp.file_a,
                    "file_b": cp.file_b,
                    "jaccard_similarity": round(cp.jaccard_similarity, 4),
                    "minhash_similarity": round(cp.minhash_similarity, 4),
                    "tokens_a": cp.tokens_a_count,
                    "tokens_b": cp.tokens_b_count,
                    "shared_shingles": cp.shared_shingles_count,
                    "total_unique_shingles": cp.total_unique_shingles
                }
                for cp in summary.clone_pairs
            ]
        }
        print(json.dumps(payload, indent=2))
        sys.exit(0 if summary.is_healthy else 1)
        
    print("\n" + "=" * 90)
    print(" 🧬 HFE-POS STRUCTURAL CLONE & DUPLICATE COMPONENT DETECTOR")
    print("    Standard: POS-ENG-STD-001 & HFE-UI-STD-001 (Cadence: LARGE / LIVE)")
    print("=" * 90)
    
    for d in summary.details:
        print(f" {d}")
        
    print("-" * 90)
    if summary.clones_found_count > 0:
        print(f" ⚠️  Found {summary.clones_found_count} candidate duplicate pair(s) with >={summary.threshold * 100:.0f}% structural similarity:\n")
        print(f" {'SIMILARITY':<12} | {'SHARED':<10} | {'COMPONENT A':<32} <==> {'COMPONENT B'}")
        print(" " + "-" * 88)
        for cp in summary.clone_pairs:
            sim_str = f"{cp.jaccard_similarity * 100:.1f}%"
            shared_str = f"{cp.shared_shingles_count}/{cp.total_unique_shingles}"
            print(f" {sim_str:<12} | {shared_str:<10} | {cp.file_a:<32} <==> {cp.file_b}")
        print("\n" + "=" * 90)
        print(f" 💡 [RECOMMENDATION] Review candidate duplicates above and consolidate into shared primitives in Tier 2/3.")
        print("=" * 90 + "\n")
        sys.exit(1)
    else:
        print(f" 🎉 [AUDIT PASSED] 0 structural duplicate clones detected across all components ({summary.elapsed_seconds:.3f}s)")
        print("=" * 90 + "\n")
        sys.exit(0)

if __name__ == "__main__":
    main()
