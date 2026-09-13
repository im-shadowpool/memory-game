/**
 * Year 2025 Casual / High-Gap GitHub Contribution Streak Backfiller
 * 
 * Author: im_shadowpool <shadowpoolvs@gmail.com>
 * Covers all 365 days of 2025 with:
 * - High gap frequency: ~58-62% natural rest/gap days
 * - ~80% of Saturdays and Sundays empty
 * - Natural multi-day break windows (4-10 consecutive gap days)
 * - Moderate commit volume (~350-390 total commits)
 * - Safe updates isolated to ACTIVITY.md
 * 
 * Usage:
 *   node scripts/backfill-year-2025.js --dry-run
 *   node scripts/backfill-year-2025.js --run
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AUTHOR_NAME = 'im_shadowpool';
const AUTHOR_EMAIL = 'shadowpoolvs@gmail.com';
const TIMEZONE_OFFSET = '+05:30';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || (!args.includes('--run') && !args.includes('--dry-run'));

// Varied, realistic commit message pool for 2025 maintenance and feature polish
const commitPool = [
  'feat: add sound volume slider in settings drawer',
  'refactor: extract audio synthesizer into standalone utility',
  'style: add smooth hover scale on card back art',
  'perf: optimize canvas particle rendering performance',
  'fix: prevent touch drag event cancellation on Android browsers',
  'docs: clarify local development setup in README',
  'feat: support custom board background image upload',
  'style: refine victory modal typography and button gradients',
  'fix: handle edge case in rapid consecutive card flips',
  'refactor: clean up legacy state variables in game controller',
  'feat: add keyboard shortcut guide tooltip',
  'perf: reduce initial bundle size via dynamic import',
  'test: add regression test suite for matching logic',
  'style: enhance dark mode theme contrast ratios',
  'fix: preserve audio mute state across browser sessions',
  'chore: bump dependencies and audit vulnerabilities',
  'feat: add score history table in high score modal',
  'perf: use CSS transform instead of top/left positioning',
  'refactor: simplify difficulty selection state handling',
  'docs: update deployment troubleshooting guide',
  'feat: add retro pixel art theme assets',
  'style: polish segmented control border radius',
  'fix: prevent accidental board reset while timer is running',
  'feat: add subtle sound effect for turn counter increment',
  'perf: memoize theme loader to prevent duplicate asset fetches',
  'style: adjust card spacing for foldable phone viewports',
  'refactor: organize icon components into shared directory',
  'chore: optimize Vercel preview build pipeline'
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Realistic daytime slots
const timeSlots = [
  { hour: 10, min: 22 },
  { hour: 11, min: 45 },
  { hour: 14, min: 35 },
  { hour: 16, min: 18 },
  { hour: 17, min: 52 },
  { hour: 19, min: 40 },
  { hour: 21, min: 30 }
];

// Existing dates in April 2025 that already have commits
const existingAprilCommitDates = new Set([
  '2025-04-06',
  '2025-04-10',
  '2025-04-11',
  '2025-04-12',
  '2025-04-13',
  '2025-04-15',
  '2025-04-17',
  '2025-04-18',
  '2025-04-27'
]);

function createRNG(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generate2025Schedule() {
  const rng = createRNG(20250101);
  const schedule = [];
  const pad = (n) => String(n).padStart(2, '0');

  // Month days for 2025 (non-leap year)
  const months = [
    { month: 1, days: 31, name: 'January' },
    { month: 2, days: 28, name: 'February' },
    { month: 3, days: 31, name: 'March' },
    { month: 4, days: 30, name: 'April' },
    { month: 5, days: 31, name: 'May' },
    { month: 6, days: 30, name: 'June' },
    { month: 7, days: 31, name: 'July' },
    { month: 8, days: 31, name: 'August' },
    { month: 9, days: 30, name: 'September' },
    { month: 10, days: 31, name: 'October' },
    { month: 11, days: 30, name: 'November' },
    { month: 12, days: 31, name: 'December' }
  ];

  // Extended natural break windows for 2025 to create visible grey gaps
  const breakRanges = [
    { start: '2025-01-01', end: '2025-01-05', name: "New Year's Extended Break" },
    { start: '2025-03-12', end: '2025-03-19', name: 'Mid-March Break' },
    { start: '2025-06-18', end: '2025-06-25', name: 'Early Summer Hiatus' },
    { start: '2025-08-14', end: '2025-08-24', name: 'Late Summer Vacation' },
    { start: '2025-10-22', end: '2025-10-27', name: 'Autumn Holiday Break' },
    { start: '2025-11-13', end: '2025-11-19', name: 'Mid-November Pause' },
    { start: '2025-12-22', end: '2025-12-31', name: 'Year-End Holidays' }
  ];

  let poolIdx = 0;

  for (const m of months) {
    for (let d = 1; d <= m.days; d++) {
      const dateStr = `2025-${pad(m.month)}-${pad(d)}`;
      const dateObj = new Date(Date.UTC(2025, m.month - 1, d));
      const dayOfWeek = dateObj.getUTCDay(); // 0 = Sunday, 6 = Saturday
      const dayName = dayNames[dayOfWeek];

      // If this day already has real commits from history, count it as active with 0 extra commits needed
      if (existingAprilCommitDates.has(dateStr)) {
        schedule.push({
          date: dateStr,
          day: dayName,
          month: m.name,
          commits: 0,
          isExisting: true,
          reason: 'Existing April 2025 Commits (Preserved)'
        });
        continue;
      }

      // Check if within a scheduled break window
      const inBreak = breakRanges.find(b => dateStr >= b.start && dateStr <= b.end);
      if (inBreak) {
        schedule.push({
          date: dateStr,
          day: dayName,
          month: m.name,
          commits: 0,
          reason: inBreak.name
        });
        continue;
      }

      let commitCount = 0;
      const roll = rng();

      if (dayOfWeek === 0) {
        // SUNDAYS: ~20% active (1-2 commits), 80% rest days (More missing gaps!)
        if (roll < 0.20) {
          commitCount = 1 + Math.floor(rng() * 2); // 1 or 2
        } else {
          commitCount = 0;
        }
      } else if (dayOfWeek === 6) {
        // SATURDAYS: ~20% active (1-2 commits), 80% rest days
        if (roll < 0.20) {
          commitCount = 1 + Math.floor(rng() * 2); // 1 or 2
        } else {
          commitCount = 0;
        }
      } else {
        // WEEKDAYS (Mon-Fri): ~50% active, 50% rest/gaps
        if (roll < 0.50) {
          commitCount = 0; // Natural weekday gap
        } else {
          const intensityRoll = rng();
          if (intensityRoll < 0.45) {
            commitCount = 1 + Math.floor(rng() * 2); // 1-2 (Light)
          } else if (intensityRoll < 0.90) {
            commitCount = 3 + Math.floor(rng() * 2); // 3-4 (Medium)
          } else {
            commitCount = 5; // Rare mini-peak
          }
        }
      }

      const messages = [];
      for (let i = 0; i < commitCount; i++) {
        messages.push(commitPool[poolIdx % commitPool.length]);
        poolIdx++;
      }

      schedule.push({
        date: dateStr,
        day: dayName,
        month: m.name,
        commits: commitCount,
        messages
      });
    }
  }

  return schedule;
}

function generateISODate(dateStr, index, totalOnDay) {
  const slot = timeSlots[index % timeSlots.length];
  const minute = Math.min(59, (slot.min + (index * 8)) % 60);
  const second = (15 + (index * 19)) % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${dateStr}T${pad(slot.hour)}:${pad(minute)}:${pad(second)}${TIMEZONE_OFFSET}`;
}

const activityFilePath = path.join(__dirname, '..', 'ACTIVITY.md');

function run() {
  console.log('===========================================================');
  console.log('  Year 2025 Casual / High-Gap GitHub Streak Backfiller');
  console.log('===========================================================');
  console.log(`Author:     ${AUTHOR_NAME} <${AUTHOR_EMAIL}>`);
  console.log(`Timezone:   ${TIMEZONE_OFFSET}`);
  console.log(`Mode:       ${isDryRun ? '🔍 DRY RUN (Preview only)' : '🚀 EXECUTION (Creating Commits)'}`);
  console.log('-----------------------------------------------------------');

  const schedule = generate2025Schedule();

  let totalCommits = 0;
  let activeDays = 0;
  let gapDays = 0;
  let sundayActive = 0;
  let sundayGap = 0;

  const monthlyStats = {};

  for (const item of schedule) {
    if (!monthlyStats[item.month]) {
      monthlyStats[item.month] = { active: 0, gaps: 0, commits: 0 };
    }

    if (item.commits === 0 && !item.isExisting) {
      gapDays++;
      monthlyStats[item.month].gaps++;
      if (item.day === 'Sunday') sundayGap++;
    } else {
      activeDays++;
      totalCommits += item.commits;
      monthlyStats[item.month].active++;
      monthlyStats[item.month].commits += item.commits;
      if (item.day === 'Sunday') {
        if (item.commits > 0) sundayActive++;
        else sundayGap++;
      }
    }
  }

  const monthlyTable = Object.entries(monthlyStats).map(([month, data]) => ({
    Month: month,
    'Active Days': data.active,
    'Gap Days': data.gaps,
    'Gap %': `${((data.gaps / (data.active + data.gaps)) * 100).toFixed(0)}%`,
    'New Commits': data.commits,
    'Avg/Active': data.active > 0 ? (data.commits / data.active).toFixed(1) : '0'
  }));

  console.table(monthlyTable);
  console.log('-----------------------------------------------------------');
  console.log(`Year 2025 Totals (Casual Pattern with High Gaps):`);
  console.log(`  Total Days:             ${schedule.length}`);
  console.log(`  Active Days:            ${activeDays} (${((activeDays / schedule.length) * 100).toFixed(1)}%)`);
  console.log(`  Natural Rest/Gap Days:  ${gapDays} (${((gapDays / schedule.length) * 100).toFixed(1)}%)`);
  console.log(`  Active Sundays:         ${sundayActive} / ${sundayActive + sundayGap} (${((sundayActive / (sundayActive + sundayGap)) * 100).toFixed(1)}%)`);
  console.log(`  Rest Sundays:           ${sundayGap} / ${sundayActive + sundayGap}`);
  console.log(`  Total Commits Planned:  ${totalCommits}`);
  console.log('-----------------------------------------------------------');

  if (isDryRun) {
    console.log('\n[DRY RUN COMPLETE] No git commits were created.');
    console.log('To execute and generate commits for 2025, run:');
    console.log('  node scripts/backfill-year-2025.js --run\n');
    return;
  }

  // EXECUTION MODE
  console.log('\nStarting commit generation for 2025 with natural gaps...\n');

  let commitCounter = 0;

  for (const item of schedule) {
    if (item.commits === 0) continue;

    for (let i = 0; i < item.commits; i++) {
      commitCounter++;
      const message = item.messages[i] || `chore: maintain project activity log [${item.date}]`;
      const isoTimestamp = generateISODate(item.date, i, item.commits);

      const logRow = `| ${item.date} | ${isoTimestamp.slice(11, 19)} | ${AUTHOR_NAME} | ${message} |\n`;
      fs.appendFileSync(activityFilePath, logRow, 'utf8');

      execSync('git add ACTIVITY.md', { stdio: 'pipe' });

      const env = {
        ...process.env,
        GIT_AUTHOR_NAME: AUTHOR_NAME,
        GIT_AUTHOR_EMAIL: AUTHOR_EMAIL,
        GIT_COMMITTER_NAME: AUTHOR_NAME,
        GIT_COMMITTER_EMAIL: AUTHOR_EMAIL,
        GIT_AUTHOR_DATE: isoTimestamp,
        GIT_COMMITTER_DATE: isoTimestamp
      };

      const gitCmd = `git commit -m "${message}"`;
      execSync(gitCmd, { env, stdio: 'pipe' });

      if (commitCounter % 20 === 0 || commitCounter === totalCommits) {
        process.stdout.write(`\rCreated commit ${commitCounter}/${totalCommits} (${item.date})...`);
      }
    }
  }

  console.log(`\n\n🎉 Successfully generated all ${commitCounter} commits for 2025!`);
  console.log(`Author: ${AUTHOR_NAME} <${AUTHOR_EMAIL}>`);
  console.log('\nPushing to GitHub:');
  console.log('  git push origin main\n');
}

run();
