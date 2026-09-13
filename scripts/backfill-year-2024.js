/**
 * Full Year 2024 (Feb 1 - Dec 31) Realistic GitHub Green Streak Backfiller
 * 
 * Author: im_shadowpool <shadowpoolvs@gmail.com>
 * Completes the remaining 335 days of leap-year 2024 with:
 * - Natural rest days/gaps
 * - Realistic fluctuation (light, medium, and peak dark green sprint days)
 * - 40-50% active Sundays, remainder rest Sundays
 * - Daytime/evening timestamps with natural jitter
 * - Updates isolated to ACTIVITY.md
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AUTHOR_NAME = 'im_shadowpool';
const AUTHOR_EMAIL = 'shadowpoolvs@gmail.com';
const TIMEZONE_OFFSET = '+05:30';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || (!args.includes('--run') && !args.includes('--dry-run'));

// Varied, realistic commit message templates categorized by theme
const commitPool = [
  // Features & Game logic
  'feat: add smooth card flip audio feedback',
  'feat: implement custom board dimensions in settings',
  'feat: add score multiplier for rapid consecutive matches',
  'feat: support animated card border glow on match streak',
  'feat: add timer pause when browser tab loses visibility',
  'feat: introduce zen mode without time pressure',
  'feat: save personal best accuracy scores to localStorage',
  'feat: add victory fanfare sound on board clear',
  'feat: introduce Cyberpunk card deck theme',
  'feat: add Retro Arcade 8-bit sound effects pack',
  'feat: introduce Space Odyssey theme color scheme',
  'feat: add restart game keyboard shortcut (Ctrl+R)',
  'feat: add undo move penalty mechanism',
  'feat: add hints system highlighting one matching pair',
  'feat: show celebratory particle burst on record high score',
  'feat: add share score summary snippet to clipboard',
  'feat: support custom theme import via JSON config',

  // Refactoring & Architecture
  'refactor: extract game loop state into custom useMemoryGame hook',
  'refactor: simplify card comparison reducer logic',
  'refactor: decouple sound synthesizer from UI components',
  'refactor: modularize CSS color token variables',
  'refactor: streamline board matrix generation utility',
  'refactor: replace inline style calculations with CSS classes',
  'refactor: isolate local storage helper functions',
  'refactor: organize audio assets into dedicated sound manager',

  // Performance & Optimization
  'perf: memoize Card components with React.memo',
  'perf: optimize SVG asset delivery and compress card icons',
  'perf: debounce window resize listener in board layout',
  'perf: use requestAnimationFrame for particle confetti animation',
  'perf: eliminate unnecessary re-renders during turn calculation',
  'perf: apply CSS will-change property on active card transforms',
  'perf: lazy load secondary theme assets on demand',

  // UI/UX & Styling
  'style: polish dark mode contrast and typography hierarchy',
  'style: improve card shadow elevation on hover',
  'style: adjust card aspect ratio for ultra-wide displays',
  'style: add smooth cubic-bezier easing to card flip transitions',
  'style: enhance modal backdrop blur for modern aesthetic',
  'style: refine responsive grid gap for mobile viewport sizes',
  'style: polish theme picker dropdown icons and layout',
  'style: improve focus outlines for keyboard navigation accessibility',

  // Fixes & Edge cases
  'fix: prevent rapid multi-clicks from flipping more than two cards',
  'fix: handle audio context autoplay restrictions gracefully',
  'fix: resolve card flip glitch on iOS Safari mobile',
  'fix: correct time elapsed formatting when minutes exceed 60',
  'fix: reset mismatch timeout properly on rapid restarts',
  'fix: ensure total cards count is strictly even on custom board',
  'fix: prevent background scrolling while victory modal is active',
  'fix: handle localStorage quota exceeded error gracefully',

  // Docs, Tests & Tooling
  'docs: update gameplay rules and keyboard navigation in README',
  'docs: add theme customization guide and screenshot previews',
  'docs: document performance profiling results and improvements',
  'docs: update deployment troubleshooting tips',
  'test: add unit tests for board shuffle randomization fairness',
  'test: add tests for match comparison logic',
  'test: verify score calculation and accuracy algorithms',
  'chore: update project dependencies and security audit',
  'chore: optimize Vercel deployment cache settings',
  'chore: clean up deprecated CSS properties and warnings'
];

// Helper to get day name
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Realistic time slots
const timeSlots = [
  { hour: 10, min: 14 },
  { hour: 11, min: 42 },
  { hour: 14, min: 25 },
  { hour: 15, min: 50 },
  { hour: 17, min: 15 },
  { hour: 18, min: 38 },
  { hour: 20, min: 12 },
  { hour: 21, min: 46 }
];

// Pseudo-random deterministic generator with seed for reproducible realism
function createRNG(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate schedule from 2024-02-01 to 2024-12-31
function generateYearSchedule() {
  const rng = createRNG(20240201);
  const schedule = [];
  const pad = (n) => String(n).padStart(2, '0');

  // Month day counts for leap-year 2024
  const months = [
    { month: 2, days: 29, name: 'February' },
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

  // Specific realistic vacation/break windows (0 commits)
  const breakRanges = [
    { start: '2024-05-02', end: '2024-05-05', name: 'Early May Mini-Break' },
    { start: '2024-08-22', end: '2024-08-25', name: 'Late Summer Break' },
    { start: '2024-10-30', end: '2024-11-02', name: 'Festive / Holiday Break' },
    { start: '2024-12-24', end: '2024-12-26', name: 'Christmas Break' }
  ];

  let poolIdx = 0;

  for (const m of months) {
    for (let d = 1; d <= m.days; d++) {
      const dateStr = `2024-${pad(m.month)}-${pad(d)}`;
      const dateObj = new Date(Date.UTC(2024, m.month - 1, d));
      const dayOfWeek = dateObj.getUTCDay(); // 0 = Sunday, 6 = Saturday
      const dayName = dayNames[dayOfWeek];

      // Check if within a designated break
      const inBreak = breakRanges.find(b => dateStr >= b.start && dateStr <= b.end);
      if (inBreak) {
        schedule.push({ date: dateStr, day: dayName, month: m.name, commits: 0, reason: inBreak.name });
        continue;
      }

      let commitCount = 0;
      const roll = rng();

      if (dayOfWeek === 0) {
        // SUNDAYS: ~45% active (1-3 commits), 55% rest days
        if (roll < 0.45) {
          commitCount = 1 + Math.floor(rng() * 3); // 1 to 3
        } else {
          commitCount = 0;
        }
      } else if (dayOfWeek === 6) {
        // SATURDAYS: ~50% active (1-3 commits), 50% rest days
        if (roll < 0.50) {
          commitCount = 1 + Math.floor(rng() * 3); // 1 to 3
        } else {
          commitCount = 0;
        }
      } else {
        // WEEKDAYS (Mon-Fri): ~82% active, 18% random rest/gap
        if (roll < 0.18) {
          commitCount = 0; // Natural weekday gap
        } else {
          const intensityRoll = rng();
          if (intensityRoll < 0.35) {
            commitCount = 1 + Math.floor(rng() * 2); // 1-2 (Light)
          } else if (intensityRoll < 0.85) {
            commitCount = 3 + Math.floor(rng() * 3); // 3-5 (Medium)
          } else {
            commitCount = 6 + Math.floor(rng() * 3); // 6-8 (Peak Sprint)
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
  const minute = Math.min(59, (slot.min + (index * 7)) % 60);
  const second = (11 + (index * 17)) % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${dateStr}T${pad(slot.hour)}:${pad(minute)}:${pad(second)}${TIMEZONE_OFFSET}`;
}

const activityFilePath = path.join(__dirname, '..', 'ACTIVITY.md');

function run() {
  console.log('===========================================================');
  console.log('  Full Year 2024 GitHub Streak Backfiller (Feb 1 - Dec 31)');
  console.log('===========================================================');
  console.log(`Author:     ${AUTHOR_NAME} <${AUTHOR_EMAIL}>`);
  console.log(`Timezone:   ${TIMEZONE_OFFSET}`);
  console.log(`Mode:       ${isDryRun ? '🔍 DRY RUN (Preview only)' : '🚀 EXECUTION (Creating Commits)'}`);
  console.log('-----------------------------------------------------------');

  const schedule = generateYearSchedule();

  let totalCommits = 0;
  let activeDays = 0;
  let gapDays = 0;
  let sundayActive = 0;
  let sundayGap = 0;

  // Monthly stats
  const monthlyStats = {};

  for (const item of schedule) {
    if (!monthlyStats[item.month]) {
      monthlyStats[item.month] = { active: 0, gaps: 0, commits: 0 };
    }

    if (item.commits === 0) {
      gapDays++;
      monthlyStats[item.month].gaps++;
      if (item.day === 'Sunday') sundayGap++;
    } else {
      activeDays++;
      totalCommits += item.commits;
      monthlyStats[item.month].active++;
      monthlyStats[item.month].commits += item.commits;
      if (item.day === 'Sunday') sundayActive++;
    }
  }

  const monthlyTable = Object.entries(monthlyStats).map(([month, data]) => ({
    Month: month,
    'Active Days': data.active,
    'Gap Days': data.gaps,
    'Total Commits': data.commits,
    'Avg/Active Day': (data.commits / data.active).toFixed(1)
  }));

  console.table(monthlyTable);
  console.log('-----------------------------------------------------------');
  console.log(`Year 2024 Remaining (Feb 1 - Dec 31) Totals:`);
  console.log(`  Total Days:             ${schedule.length}`);
  console.log(`  Active Days:            ${activeDays} (${((activeDays / schedule.length) * 100).toFixed(1)}%)`);
  console.log(`  Natural Rest/Gap Days:  ${gapDays} (${((gapDays / schedule.length) * 100).toFixed(1)}%)`);
  console.log(`  Active Sundays:         ${sundayActive} / ${sundayActive + sundayGap} (${((sundayActive / (sundayActive + sundayGap)) * 100).toFixed(1)}%)`);
  console.log(`  Rest Sundays:           ${sundayGap} / ${sundayActive + sundayGap}`);
  console.log(`  Total Commits:          ${totalCommits}`);
  console.log('-----------------------------------------------------------');

  if (isDryRun) {
    console.log('\n[DRY RUN COMPLETE] No git commits were created.');
    console.log('To execute and generate commits for the full year 2024, run:');
    console.log('  node scripts/backfill-year-2024.js --run\n');
    return;
  }

  // EXECUTION MODE
  console.log('\nStarting commit generation across 2024 (Feb 1 - Dec 31)...\n');

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

      if (commitCounter % 25 === 0 || commitCounter === totalCommits) {
        process.stdout.write(`\rCreated commit ${commitCounter}/${totalCommits} (${item.date})...`);
      }
    }
  }

  console.log(`\n\n🎉 Successfully generated all ${commitCounter} commits across 2024!`);
  console.log(`Author: ${AUTHOR_NAME} <${AUTHOR_EMAIL}>`);
  console.log('\nPushing to GitHub:');
  console.log('  git push origin main\n');
}

run();
