/**
 * Build and deploy to Cloudflare Workers.
 *
 *   npm run deploy            # build, patch, deploy to the custom domains
 *   npm run deploy -- --preview      # deploy to workers.dev instead
 *   npm run deploy -- --skip-build   # deploy the existing .output as-is
 *
 * Why this exists: nitro regenerates `.output/server/wrangler.json` on every
 * build, so anything hand-added there is silently wiped. On the Tamaris fork
 * that cost us the custom-domain routes twice — the deploy "succeeded" and the
 * site kept serving the old version on the live domain. This script re-applies
 * the settings that have to survive a rebuild, then deploys.
 *
 * Per fork, change DOMAINS. Everything else is client-agnostic.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

/**
 * The custom domains this Worker answers on. First is canonical.
 *
 * A custom domain only attaches once its zone is Active in the Cloudflare
 * account you are deploying with. Until then `--preview` deploys to the
 * account's workers.dev subdomain instead, which is the right shape for
 * showing the agency the site early.
 */
const ALL_DOMAINS = ["anjoomvoyage.com", "www.anjoomvoyage.com"];

/**
 * The Cloudflare account that owns THIS client's site.
 *
 * `wrangler login` holds one account at a time and each client owns a
 * different one, so the login in the terminal is whichever client was
 * deployed last. Pinning the account here turns a wrong-account deploy into
 * an authentication failure instead of a successful publish into another
 * client's account. Get it from `npx wrangler whoami` as this client.
 */
const ACCOUNT = "bca1bb6285dc798014c31e24055e7abe"; // Admin@anjoomvoyage.com

const CONFIG = ".output/server/wrangler.json";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

const skipBuild = process.argv.includes("--skip-build");
const preview = process.argv.includes("--preview");
const DOMAINS = preview ? [] : ALL_DOMAINS;

if (!skipBuild) {
  console.log("\n▸ building\n");
  run("npm run build");
}

if (!existsSync(CONFIG)) {
  console.error(`\n✗ ${CONFIG} not found — run without --skip-build.\n`);
  process.exit(1);
}

console.log("\n▸ patching generated wrangler.json\n");
const config = JSON.parse(readFileSync(CONFIG, "utf8"));

// Custom domains. `custom_domain: true` is what creates the DNS record and the
// certificate; a plain route pattern would attach the Worker but leave the
// domain unresolvable.
//
// With no domains, ask for the workers.dev URL instead. Leaving both off would
// deploy a Worker that nothing can reach — a "successful" deploy with no link.
config.routes = DOMAINS.map((pattern) => ({ pattern, custom_domain: true }));
config.workers_dev = DOMAINS.length === 0;

// Retain logs. Without this, console.log/console.error exist only for the
// instant the request runs — a silently failing booking enquiry leaves no trace
// unless someone happens to be running `wrangler tail` at that second. This
// site has no email account yet, so the log IS the booking record.
// Free plan: 200k events/day, 3-day retention. Sampling stays at 1 (100%)
// because this site's traffic is nowhere near the limit.
config.observability = { enabled: true, head_sampling_rate: 1 };

// The account. CLOUDFLARE_ACCOUNT_ID silently outranks the OAuth login and
// persists for the life of the terminal, which is how one client's deploy
// ended up aimed at another client's account; dropping it here means only
// ACCOUNT decides. Fails closed: an unset ACCOUNT refuses to deploy rather
// than falling back to whoever happens to be logged in.
if (!/^[0-9a-f]{32}$/.test(ACCOUNT)) {
  console.error(
    `\n\u2717 ACCOUNT is not set in scripts/deploy.mjs.\n` +
      `  Run \`npx wrangler whoami\` logged in as this client and paste its Account ID.\n`,
  );
  process.exit(1);
}
delete process.env.CLOUDFLARE_ACCOUNT_ID;
config.account_id = ACCOUNT;

writeFileSync(CONFIG, JSON.stringify(config, null, 2));
console.log(`  routes        ${DOMAINS.join(", ") || "workers.dev (no custom domain yet)"}`);
console.log(`  observability enabled\n`);
console.log(`  account       ${ACCOUNT}\n`);

console.log("▸ deploying\n");
// Pinnable: a bare `npx wrangler` resolves to whatever npm published most
// recently, and a broken publish (a version whose tarball 404s) then blocks a
// client deploy for reasons that have nothing to do with this site.
//   WRANGLER_SPEC=wrangler@4.145.0 npm run deploy
const WRANGLER = process.env.WRANGLER_SPEC || "wrangler";
run(`npx ${WRANGLER} deploy -c ${CONFIG}`);

console.log(
  DOMAINS.length
    ? `\n✓ deployed — https://${DOMAINS[0]}\n`
    : `\n✓ deployed — the workers.dev URL is printed above\n`,
);
