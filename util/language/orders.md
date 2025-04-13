**Context:**  
I’m building a multilingual bot. Instead of writing static translated messages for each command, I use a dynamic translation system with **placeholders** and **placeholder maps**.  
The goal is to keep the translations short, reusable, and contextually accurate.

# 🧠 Idea:
Each translated message can contain **placeholders** like `%action%`, `%action_done%`, `%element%`, `%group%`, etc.  
Those placeholders are mapped to their proper value depending on the language (like `BAN` => `حظر` in Arabic and `ban` in English).

# 🗃️ Structure:
- Messages like:
  ```js
  USER_DATA_DELETED: "تم حذف %data% الخاص بـ %user% بنجاح!"
  MODERATE_SUCCESS: "تم %action_done% العضو من السرفر"
  ```
- And then in `PLACEHOLDER_MAPS`:
  ```js
  action: {
    BAN: "حظر", UNBAN: "إلغاء الحظر", KICK: "طرد", ...
  },
  action_done: {
    BAN: "حظر", UNBAN: "إلغاء الحظر", ...
  }
  ```

# 🧩 Usage in Code:
Whenever you use a translation key like `MODERATE_SUCCESS`, you provide both the `guildId` (for language) and the dynamic placeholders:

```js
client.language.getString("MODERATE_SUCCESS", interaction.guild.id, {
  action_done: "UNBAN", // this will be mapped internally to "إلغاء الحظر" in Arabic
  target: interaction.guild.name
})
```

# ✅ Rules:
- Placeholders should be **language-neutral**, like `BAN`, `KICK`, etc.
- You **must not** insert raw English inside Arabic phrases or vice versa.
- The translation system must look up any placeholder using the `PLACEHOLDER_MAPS` for the current language.
- If a key doesn't exist in the placeholder map, it should fallback to the raw value.

### 🧪 Example Use Case:
**In code:**
```js
if (!user.match(/\d{17,19}/)) {
    return interaction.reply({
        content: client.language.getString("NO_ID", interaction.guild.id, { action: "UNBAN" }),
        ephemeral: true
    });
}
```
**Translation Output (Arabic):**
> ❌ يرجى كتابة المعرف أو ذكر المستخدم لـ **إلغاء الحظر**.