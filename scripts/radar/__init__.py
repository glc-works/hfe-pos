"""
HFE-POS Radar Subsystem Package (hfex-rad0).
"""

from .base import PillarResult
from .plan_scanner import (
    scan_plans,
    get_plan_summary,
    parse_simple_yaml_frontmatter
)
from .dimensions import (
    DimensionIndex,
    parse_dimension_filter,
    DIMENSIONS,
    POS_NODES,
    CI_SHARD_CONFIG,
    query_dimensions,
    render_dimension_matrix,
    generate_ci_matrix,
    print_tools_directory,
    print_plans_directory
)
from .engine import (
    run_radar,
    run_cadence,
    PILLAR_REGISTRY,
    PILLAR_NAME_MAP
)
from .clone_detector import (
    run_clone_detection,
    audit as audit_clones
)
from .p2_layer_boundaries import (
    scan_layer_boundaries,
    audit as audit_layer_boundaries
)
from .ast_scanner import (
    ASTScanner,
    ASTViolation,
    scan_ast,
    audit as audit_ast
)

__all__ = [
    "PillarResult",
    "DimensionIndex",
    "parse_dimension_filter",
    "DIMENSIONS",
    "POS_NODES",
    "CI_SHARD_CONFIG",
    "query_dimensions",
    "render_dimension_matrix",
    "generate_ci_matrix",
    "print_tools_directory",
    "print_plans_directory",
    "scan_plans",
    "get_plan_summary",
    "parse_simple_yaml_frontmatter",
    "run_radar",
    "run_cadence",
    "PILLAR_REGISTRY",
    "PILLAR_NAME_MAP",
    "run_clone_detection",
    "audit_clones",
    "scan_layer_boundaries",
    "audit_layer_boundaries",
    "ASTScanner",
    "ASTViolation",
    "scan_ast",
    "audit_ast"
]
