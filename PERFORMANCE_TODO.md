# Performance & Code Quality TODO List

## 🔴 IMMEDIATE FIXES (High Impact)

### 1. Fix Leaderboard Database Queries
**File:** `commands/Economy/LeaderBoard.js`
**Issue:** Loading all economy records into memory, then filtering/sorting in JavaScript
**Current Code (Lines 32-44):**
```javascript
data = await schema.find({});  // Loads ALL documents
for (let obj of data) {
  if (await client.users.cache.map((user) => user.id).includes(obj.userID))
    members.push(obj);
}
```

**Fix:**
```javascript
// Use aggregation with proper filtering and sorting
const pipeline = [
  { $match: { credits: { $gt: 0 } } },
  { $sort: { credits: -1 } },
  { $limit: 10 }
];
data = await schema.aggregate(pipeline);

// Or at minimum, use database sorting:
data = await schema.find({ credits: { $gt: 0 } }).sort({ credits: -1 }).limit(10);
```

### 2. Fix Async Array Operations
**File:** `commands/Economy/LeaderBoard.js`
**Issue:** `async` callbacks in `sort()` and `filter()` don't work as expected
**Current Code (Lines 46-52):**
```javascript
members = members.sort(async function (b, a) {
  return await a.credits - b.credits;  // await has no effect
});
members = members.filter(async function BigEnough(value) {
  return await value.credits > 0;  // await returns Promise, always truthy
});
```

**Fix:**
```javascript
members = members.sort((b, a) => a.credits - b.credits);
members = members.filter(value => value.credits > 0);
```

### 3. Implement Guild Settings Cache
**File:** `events/core/MessageCreate.js`
**Issue:** 3 database queries per message (prefix, blacklist, etc.)
**Current Code (Lines 24-39):**
```javascript
// Multiple DB queries for every message
data = await schema.findOne({ GuildID: message.guild.id });
UserData = await userSchema.findOne({ userId: message.author.id });
```

**Fix:** Add caching system:
```javascript
// In Client.js constructor:
this.guildCache = new Map();
this.userCache = new Map();

// Cache helper function:
async function getCachedGuildData(guildId) {
  const cached = client.guildCache.get(guildId);
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 min TTL
    return cached.data;
  }
  const data = await schema.findOne({ GuildID: guildId });
  client.guildCache.set(guildId, { data, timestamp: Date.now() });
  return data;
}
```

### 4. Fix Cooldown Memory Leak
**File:** `Handler/CommandOptions.js`
**Issue:** `delete` operations run immediately instead of in timeout
**Current Code (Lines 242-247):**
```javascript
setTimeout(
  () => timestamps.delete(message.author.id),
  cooldownAmount,
  delete client.CoolDownCurrent[message.author.id]  // Runs immediately!
);
```

**Fix:**
```javascript
setTimeout(() => {
  timestamps.delete(message.author.id);
  delete client.CoolDownCurrent[message.author.id];
}, cooldownAmount);
```

---

## 🟡 SHORT-TERM FIXES (Medium Impact)

### 5. Optimize Moderation Filters
**Files:** `util/functions/AntiLinks.js`, `util/functions/BadWordsFilter.js`
**Issue:** DB queries even when features are disabled

**Fix:** Add early caching check:
```javascript
// At top of both functions:
const guildCache = client.guildCache.get(message.guild.id);
if (guildCache && !guildCache.data.Mod.AntiLink?.isEnabled) return;
if (guildCache && !guildCache.data.Mod.BadWordsFilter?.isEnabled) return;
```

### 6. Fix Undefined Variable
**File:** `util/functions/BadWordsFilter.js:92`
**Issue:** `user` is undefined, should be `message.author`

**Fix:**
```javascript
// Change line 92 from:
await user.send({ embeds: [dmembed] })
// To:
await message.author.send({ embeds: [dmembed] })
```

### 7. Optimize Level Leaderboard
**File:** `commands/LeveledRoles/LeaderBoard.js`
**Issue:** Same pattern as economy leaderboard

**Fix:** Apply same database-level sorting as economy leaderboard

### 8. Fix Rate Limiter Memory Growth
**File:** `util/functions/aiRateLimiter.js`
**Issue:** Unbounded Map/Array growth

**Fix:** Add size limits:
```javascript
constructor() {
  this.userTimestamps = new Map();
  this.globalTimestamps = [];
  this.MAX_CACHE_SIZE = 10000;
}

record(userId) {
  // Add size check
  if (this.userTimestamps.size >= this.MAX_CACHE_SIZE) {
    this.cleanupCooldowns();
  }
  // ... rest of function
}
```

---

## 🟢 LONG-TERM IMPROVEMENTS (Code Quality)

### 9. Replace Sync File Operations
**File:** `struct/Client.js:31`
**Issue:** `fs.writeFileSync()` blocks event loop

**Fix:**
```javascript
// Change from:
fs.writeFileSync('./terminal.log', '', 'utf-8');
// To:
fs.promises.writeFile('./terminal.log', '', 'utf-8').catch(console.error);
```

### 10. Remove Redundant Else Blocks
**Files:** Multiple files with pattern:
```javascript
if (condition) {
  return something;
} else {
  // do nothing
};
```

**Fix:** Remove the `else` blocks entirely.

### 11. Add Error Handling Improvements
**File:** `events/core/MessageCreate.js`
**Issue:** Multiple error replies possible

**Fix:** Add flag to prevent duplicate replies:
```javascript
let errorReplied = false;

// In catch blocks:
if (!errorReplied) {
  await message.reply({ embeds: [ErrorEmbed(...)] });
  errorReplied = true;
}
```

### 12. Implement Proper Caching Layer
**Create new file:** `util/cache/GuildCache.js`

```javascript
class GuildCache {
  constructor(ttl = 300000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(guildId) {
    const entry = this.cache.get(guildId);
    if (!entry || Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(guildId);
      return null;
    }
    return entry.data;
  }

  set(guildId, data) {
    this.cache.set(guildId, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

module.exports = GuildCache;
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Critical Fixes (Week 1)
- [ ] Fix LeaderBoard async operations
- [ ] Fix cooldown memory leak
- [ ] Fix undefined variable in BadWordsFilter
- [ ] Test leaderboards with large datasets

### Phase 2: Performance Optimizations (Week 2)
- [ ] Implement guild settings cache
- [ ] Add early-exit checks for moderation filters
- [ ] Optimize database queries in leaderboards
- [ ] Add cache cleanup intervals

### Phase 3: Code Quality (Week 3)
- [ ] Remove redundant else blocks
- [ ] Replace sync file operations
- [ ] Improve error handling
- [ ] Add comprehensive logging

### Phase 4: Advanced Optimizations (Week 4)
- [ ] Implement proper caching layer
- [ ] Add Redis for multi-process caching (if sharding)
- [ ] Add database query monitoring
- [ ] Performance benchmarking

---

## 🧪 TESTING STRATEGY

### Before Deployment:
1. **Load Testing:** Simulate 1000 messages/minute
2. **Memory Profiling:** Monitor memory usage during leaderboards
3. **Database Load:** Check query counts with `mongostat`
4. **Error Scenarios:** Test error handling doesn't duplicate replies

### After Deployment:
1. **Monitor:** Database query patterns
2. **Track:** Memory usage trends
3. **Measure:** Response times improvements
4. **Watch:** Error rates and user reports

---

## 📊 EXPECTED METRICS

### Before Fixes:
- DB queries per 1000 messages: ~3000
- Leaderboard load time: 200-500ms
- Memory usage during leaderboard: 50-100MB spike
- Average command response: 150-200ms

### After Fixes:
- DB queries per 1000 messages: ~900 (-70%)
- Leaderboard load time: 50-100ms (-75%)
- Memory usage during leaderboard: 10-20MB spike (-80%)
- Average command response: 100-150ms (-25%)

---

*TODO created on March 20, 2026*
