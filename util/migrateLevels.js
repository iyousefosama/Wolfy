const mongoose = require('mongoose');
const LevelSchema = require('../schema/LevelingSystem-Schema');
require('dotenv').config();

/**
 * Database Migration Script
 * Fixes all level documents with old schema or NaN values
 * Run with: node util/migrateLevels.js
 */

async function calculateRequiredXp(level) {
  return Math.floor(100 * Math.pow(level, 2) + 50 * level);
}

async function migrate() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Get all documents
    const allDocs = await LevelSchema.find({}).lean();
    console.log(`📊 Found ${allDocs.length} total documents`);

    let migrated = 0;
    let fixed = 0;
    let skipped = 0;

    for (const doc of allDocs) {
      const isOldSchema = doc.System !== undefined && typeof doc.System === 'object';
      
      // Check for NaN or invalid values
      const hasNaN = isNaN(doc.xp) || isNaN(doc.level) || isNaN(doc.totalXp) || 
                     doc.xp === 'NaN' || doc.level === 'NaN' || doc.totalXp === 'NaN';
      
      const isMissingFields = doc.xp === undefined || doc.level === undefined;

      if (isOldSchema || hasNaN || isMissingFields) {
        console.log(`\n🔧 Fixing user ${doc.userId} in guild ${doc.guildId}`);
        console.log(`   Old: System=${JSON.stringify(doc.System)}, xp=${doc.xp}, level=${doc.level}`);

        let level = 1;
        let xp = 0;

        if (isOldSchema && doc.System) {
          level = doc.System.level || 1;
          xp = doc.System.xp || 0;
        } else if (!isMissingFields && !hasNaN) {
          level = doc.level || 1;
          xp = doc.xp || 0;
        }

        // Calculate total XP
        let totalXp = 0;
        for (let i = 1; i < level; i++) {
          totalXp += await calculateRequiredXp(i);
        }
        totalXp += xp;

        // Delete old document and create new one
        await LevelSchema.deleteOne({ _id: doc._id });
        await LevelSchema.create({
          guildId: doc.guildId,
          userId: doc.userId,
          level: level,
          xp: xp,
          requiredXp: await calculateRequiredXp(level),
          totalXp: totalXp,
          messageCount: doc.messageCount || 0,
          notifications: doc.notifications !== undefined ? doc.notifications : true,
          lastMessageAt: doc.lastMessageAt || null,
          createdAt: doc.createdAt || new Date(),
          updatedAt: new Date()
        });

        console.log(`   New: level=${level}, xp=${xp}, totalXp=${totalXp}`);
        
        if (isOldSchema) migrated++;
        else fixed++;
      } else {
        skipped++;
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Migrated (old schema): ${migrated}`);
    console.log(`   Fixed (NaN/invalid): ${fixed}`);
    console.log(`   Skipped (valid): ${skipped}`);

  } catch (err) {
    console.error('❌ Migration error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

migrate();
