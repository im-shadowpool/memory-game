/**
 * Jan - Jun 2026 GitHub Streak Backfiller (80% Gap Ratio & Light Commits)
 * 
 * Author: im_shadowpool <shadowpoolvs@gmail.com>
 * Covers Jan 1, 2026 to Jun 30, 2026 with:
 * - 80% gap ratio (~145 rest days out of 181 total days)
 * - Light commits (1-2 commits per active day)
 * - Gentle maintenance and polish commit messages
 * - Daytime timestamps with natural jitter
 * - Safe updates to ACTIVITY.md
 * 
 * Usage:
 *   node scripts/backfill-2026-h1.js --dry-run
 *   node scripts/backfill-2026-h1.js --run
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AUTHOR_NAME = 'im_shadowpool';
const AUTHOR_EMAIL = 'shadowpoolvs@gmail.com';
const TIMEZONE_OFFSET = '+05:30';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || (!args.includes('--run') && !args.includes('--dry-run'));

// Light maintenance and polish commit messages
const lightCommitPool = [
  'chore(deps): update core dependencies and security patches',
  'style: subtle contrast polish on theme border colors',
  'docs: clarify game rules and shortcuts in README',
  'perf: optimize asset caching headers for production build',
  'fix: minor layout shift on small mobile screens',
  'style: improve keyboard focus indicator accessibility',
  'refactor: clean up unused CSS helper utility classes',
  'docs: update live demo preview link in project documentation',
  'perf: optimize sound synthesizer initialization latency',
  'fix: ensure correct card hover elevation on touch devices',
  'style: fine-tune modal animation timing curve',
  'chore: audit package dependencies for deprecations',
  'docs: add developer contributing notes',
  'perf: reduce redundant re-renders during state reset',
  'style: polish segmented control active tab shadow'
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const timeSlots = [
  { hour: 10, min: 25 },
  { hour: 11, min: 48 },
  { hour: 14, min: 30 },
  { hour: 16, min: 15 },
  { hour: 17, min: 40 },
  { hour: 19, min: 20 },
  { hour: 21, min: 10 }
];

function createRNG(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateSchedule() {
  const rng = createRNG(20260101);
  const schedule = [];
  const pad = (n) => String(n).padStart(2, '0');

  // Months Jan to Jun 2026 (2026 is non-leap year)
  const months = [
    { month: 1, days: 31, name: 'January' },
    { month: 2, days: 28, name: 'February' },
    { month: 3, days: 31, name: 'March' },
    { month: 4, days: 30, name: 'April' },
    { month: 5, days: 31, name: 'May' },
    { month: 6, days: 30, name: 'June' }
  ];

  // Extended natural break windows
  const breakRanges = [
    { start: '2026-01-01', end: '2026-01-07', name: 'New Year Break' },
    { start: '2026-03-12', end: '2026-03-20', name: 'Spring Break' },
    { start: '2026-05-14', end: '2026-05-22', name: 'May Vacation' }
  ];

  let poolIdx = 0;

  for (const m of months) {
    for (let d = 1; d <= m.days; d++) {
      const dateStr = `2026-${pad(m.month)}-${pad(d)}`;
      const dateObj = new Date(Date.UTC(2026, m.month - 1, d));
      const dayOfWeek = dateObj.getUTCDay();
      const dayName = dayNames[dayOfWeek];

      // Check break windows
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

      // For ~80% gap ratio across the week:
      // Weekends: ~90% rest (only ~10% active with 1 commit)
      // Weekdays: ~75% rest (only ~25% active with 1-2 commits)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (roll < 0.10) {
          commitCount = 1; // Weekend light check-in
        } else {
          commitCount = 0;
        }
      } else {
        if (roll < 0.25) {
          // Active weekday: light commits (75% 1 commit, 25% 2 commits)
          commitCount = (rng() < 0.75) ? 1 : 2;
        } else {
          commitCount = 0;
        }
      }

      const messages = [];
      for (let i = 0; i < commitCount; i++) {
        messages.push(lightCommitPool[poolIdx % lightCommitPool.length]);
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
  const minute = Math.min(59, (slot.min + (index * 11)) % 60);
  const second = (14 + (index * 19)) % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${dateStr}T${pad(slot.hour)}:${pad(minute)}:${pad(second)}${TIMEZONE_OFFSET}`;
}

const activityFilePath = path.join(__dirname, '..', 'ACTIVITY.md');

function run() {
  console.log('===========================================================');
  console.log('  Jan - Jun 2026 GitHub Streak Backfiller (80% Gap Ratio)');
  console.log('  Repository: memory-game');
  console.log('===========================================================');
  console.log(`Author:     ${AUTHOR_NAME} <${AUTHOR_EMAIL}>`);
  console.log(`Timezone:   ${TIMEZONE_OFFSET}`);
  console.log(`Mode:       ${isDryRun ? '🔍 DRY RUN (Preview only)' : '🚀 EXECUTION (Creating Commits)'}`);
  console.log('-----------------------------------------------------------');

  const schedule = generateSchedule();

  let totalCommits = 0;
  let activeDays = 0;
  let gapDays = 0;

  const monthlyStats = {};

  for (const item of schedule) {
    if (!monthlyStats[item.month]) {
      monthlyStats[item.month] = { active: 0, gaps: 0, commits: 0 };
    }

    if (item.commits === 0) {
      gapDays++;
      monthlyStats[item.month].gaps++;
    } else {
      activeDays++;
      totalCommits += item.commits;
      monthlyStats[item.month].active++;
      monthlyStats[item.month].commits += item.commits;
    }
  }

  const monthlyTable = Object.entries(monthlyStats).map(([month, data]) => ({
    Month: month,
    'Active Days': data.active,
    'Gap Days': data.gaps,
    'Gap %': `${((data.gaps / (data.active + data.gaps)) * 100).toFixed(0)}%`,
    'Commits': data.commits,
    'Avg/Active': data.active > 0 ? (data.commits / data.active).toFixed(1) : '0'
  }));

  console.table(monthlyTable);
  console.log('-----------------------------------------------------------');
  console.log(`Jan - Jun 2026 Totals (80% Gap Ratio):`);
  console.log(`  Total Calendar Days:    ${schedule.length}`);
  console.log(`  Active Days:            ${activeDays} (${((activeDays / schedule.length) * 100).toFixed(1)}%)`);
  console.log(`  Natural Rest/Gap Days:  ${gapDays} (${((gapDays / schedule.length) * 100).toFixed(1)}% GAP RATIO)`);
  console.log(`  Total Light Commits:    ${totalCommits}`);
  console.log('-----------------------------------------------------------');

  if (isDryRun) {
    console.log('\n[DRY RUN COMPLETE] No git commits were created.');
    console.log('To execute and generate commits for Jan-Jun 2026, run:');
    console.log('  node scripts/backfill-2026-h1.js --run\n');
    return;
  }

  // EXECUTION MODE
  console.log('\nStarting commit generation for Jan-Jun 2026...\n');

  let commitCounter = 0;

  for (const item of schedule) {
    if (item.commits === 0) continue;

    for (let i = 0; i < item.commits; i++) {
      commitCounter++;
      const message = item.messages[i] || `chore: update activity log [${item.date}]`;
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

      process.stdout.write(`\rCreated commit ${commitCounter}/${totalCommits} (${item.date})...`);
    }
  }

  console.log(`\n\n🎉 Successfully generated all ${commitCounter} light commits for Jan-Jun 2026!`);
  console.log(`Author: ${AUTHOR_NAME} <${AUTHOR_EMAIL}>`);
  console.log('\nPushing to GitHub:');
  console.log('  git push origin main\n');
}

run();
