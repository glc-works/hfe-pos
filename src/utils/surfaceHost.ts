/**
 * Hostname → surface resolution shares one rule, in one place.
 *
 * The app decides which surface to show from `window.location.hostname`:
 * `order.` is the customer ordering experience, `card.` the card portal,
 * `board.` the merchant showcase, and so on. Shared Preview runs the same build
 * on a prefixed host, so the prefix has to come off before that match happens.
 *
 * ── WHY THIS IS ITS OWN MODULE ───────────────────────────────────────────────
 * The stripping used to be duplicated inline in App.tsx and
 * MerchantConfigContext.tsx. Two copies of a rule that must agree is a rule that
 * eventually will not: the two files match on different sets of prefixes, so a
 * surface can resolve one way for the merchant config and another for the staff
 * surface, on the same page load.
 *
 * ── WHY `prv-` HAD TO BE ADDED ───────────────────────────────────────────────
 * Preview hosts are `prv-<surface>` (owner decision, hfe-deployment-governance
 * issue #11). Only `dev-` and `dev.` were stripped, so `prv-order.hfeit.com`
 * matched no rule and fell through to the default — which is `cafe`, the POS
 * surface. It would have served POS while claiming to be ORDER, with nothing
 * failing anywhere.
 *
 * `prv-pos` was the one host that would have looked correct, because POS is also
 * what the fallback returns. That is the worst possible way for this to be
 * wrong: the first surface deployed is the one that hides the bug.
 *
 * The superseded nested form `prv.` is stripped too. It costs one line and
 * removes a trap if any record in that shape outlives the decision.
 */
const PREFIKS = ['dev-', 'dev.', 'prv-', 'prv.'] as const

/**
 * Remove a preview/development prefix so the surface rules below it see the
 * canonical host. Returns the host lowercased and otherwise untouched.
 */
export function normalizeSurfaceHost(hostname: string): string {
  const host = hostname.toLowerCase()
  for (const prefiks of PREFIKS) {
    if (host.startsWith(prefiks)) return host.slice(prefiks.length)
  }
  return host
}
