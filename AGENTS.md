# AGENTS.md

Wolfy is a CommonJS discord.js v14 bot with a MongoDB (mongoose) backing store. `struct/Client.js` extends discord.js `Client`; most features hang off it (`client.config`, `client.database`, guild/user caches).

## Commands

- `npm start` / `npm run dev` (nodemon) — run the bot. Requires `.env` (copy `.example.env`; `TOKEN` + `MONGO_URI` needed for most features).
- `npm run build` — regenerates `assets/json/commands-database.json` by `require`-ing every file under `commands/<category>/`. Command files must be require-able **without side effects** (it `delete`s `run`/`permissions`/`examples` and serializes). Run after editing prefix/text commands.
- **Do not rely on `npm test`** — it runs `node test.js`, which does not exist. Real tests are plain `assert` scripts in `tests/*.test.js` (run via `node tests/<file>`). The auto-mod suite is a standalone mock harness at `C:\Users\youse\AppData\Local\Temp\opencode\automod-test.js` (17 tests). After editing auto-mod code, verify with `node --check <file>` + that harness.
- `npm run generate:types` is stale — `util/scripts/generateLanguageKeys.js` does not exist. Skip it.
- No lint script. ESLint flat config exists at `eslint.config.mjs`; run manually via `npx eslint .`.

## Architecture / wiring

- Entry: `index.js` → `client.loadCommands("/commands")`, `client.loadEvents("/events")`, `client.database?.init()`, `client.login()`.
- Handlers: `Handler/CommandHandler.js` (prefix, `w!`), `Handler/SlashHandler.js` (slash), `Handler/EventHandler.js` (events, recursively loaded from `events/client`, `events/core`, `events/guilds`), `Handler/ComponentsListener.js` (all `interactionCreate` routing), `Handler/ComponentsActionLoader.js`.
- Slash commands live in `slashCommands/<category>/`. They are registered directly (no build step). `config.js` → `slashCommands` has `cleanupRemoved: true` (deletes commands on Discord with no local file), `loadGlobal: true`, optional `devGuild` from env. `.command-contexts-cache.json` (repo root) tracks which commands already have `integration_types`/`contexts` set — don't hand-edit unless you know it's safe.
- Component routing (ComponentsListener): buttons/selects map `customId.split("_")` → try `part1_part2`, then `part1`, then full id. Modal submits try exact match first, then prefix match on sorted key length (so `giveaway_modal` beats `giveaway`). Keep component `name` (e.g. `mod_toggle`) short enough to survive `_`-splitting of dynamic customIds.

## Auto-moderation (most active area)

- Modules in `util/functions/` (`AntiLinks.js`, `AntiSpam.js`, `AntiBot.js`, `AntiRaid.js`, `BadWordsFilter.js`, `HoneyPot.js`, `LevelTrigger.js`) are exported together from `util/functions/moderationUtils.js`. Shared helpers live in `util/moderation/core.js` and `util/moderation/embeds.js`.
- Wiring: `events/core/MessageCreate.js` runs `level → wordFilter → linkProtection → antiBot → antiSpam → honeyPot` sequentially, each `await`ed with `.catch(()=>{})`. `events/guilds/messageUpdate.js` re-scans edits through the same modules. **Keep both call sites in sync** when adding a module.
- `core.js` provides `tryMarkHandled`/`isHandled` (a WeakSet keyed on the message object) so each module can bail if another already processed the message; and `executeAction`, `sendModerationEmbed`, `sendLogEmbed`, `analyzeUrl`, `isExempt` for consistent behavior.
- Guild config is stored in `schema/GuildSchema.js` under `Mod.<Key>` (AntiLink, AntiSpam, AntiBot, AntiRaid, BadWordsFilter, HoneyPot). Read via `client.getCachedGuildData(guildId, {force})`, write via `GuildSchema.findOneAndUpdate` + `client.setCachedGuildData`. **Returns `null` when the DB is disconnected** — always null-check (`resolved?.Mod?.key?.isEnabled`).
- Dashboard: `slashCommands/Admin/moderation.js` → `components/moderation/mod_*.js` → `util/functions/moderationDashboard.js` (`PROTECTOR_CONFIG` registry keyed by schema key; add new modules there too).
- Anti-link modes: `scam` (default), `strict`, `whitelist`, `blacklist`; whitelist/blacklist always win over mode. Scam threshold is 90; repeat offenders escalate delete→warn→mute→kick→ban within a 10-minute window. Do NOT block all links in scam mode.
- HoneyPot gotcha: `setupHoneyPotChannel` (rename + warn topic + announcement embed) must run **only when the configured channel actually changes**. Never re-announce on toggle or on a modal save where the channel is unchanged (this caused duplicate announcements).
- `messageUpdate` skips bot-sent messages via `oldMessage.author.bot` and `oldMessage.embeds.length > 0` guards — keep them.

## Discord API gotchas

- **Modals only accept `TextInput` (type 4) components.** Select menus inside modals throw `DiscordAPIError 50035` (e.g. `mod_configure.js`). Selects are only used outside modals (`mod_select.js`).
- Client uses `Partials.Message, Partials.Channel, Partials.Reaction` — partial messages exist; don't assume `message.content`/`channel` are populated.

## Conventions

- CommonJS everywhere; module aliases (`@root`, `@utils`, `@components`, …) are registered by `module-alias/register` inside `struct/Client.js`, so they only work at runtime after the client loads. Prefer relative requires in util/component code.
- `.env` is gitignored; never commit secrets. Logs go to `terminal.log` (gitignored).
