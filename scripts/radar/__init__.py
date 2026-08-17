"""
HFE-POS Radar Subsystem Package (hfex-rad0).
"""

from .base import PillarResult
from .dimensions import (
    DimensionIndex,
    parse_dimension_filter,
    DIMENSIONS,
    POS_NODES,
    CI_SHARD_CONFIG,
    query_dimensions,
    render_dimension_matrix,
    generate_ci_matrix,
    print_tools_directory
)
from .engine import (
    run_radar,
    run_cadence,
    PILLAR_REGISTRY,
    PILLAR_NAME_MAP
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
    "run_radar",
    "run_cadence",
    "PILLAR_REGISTRY",
    "PILLAR_NAME_MAP"
]
