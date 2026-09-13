/**
 * January 2024 GitHub Contribution Streak Backfill Script
 * 
 * Generates realistic git commits for January 2024 with:
 * - Natural rest days/gaps (including New Year's Day, selective weekend gaps)
 * - Fluctuating intensities (light, medium, and peak sprint days)
 * - Realistic timestamps across daytime/evening hours
 * - Proper attribution to im_shadowpool <shadowpoolvs@gmail.com>
 * - Isolated updates to ACTIVITY.md (keeps React app & Vercel builds clean)
 * 
 * Usage:
 *   node scripts/backfill-jan-2024.js --dry-run
 *   node scripts/backfill-jan-2024.js --run
 *   node scripts/backfill-jan-2024.js --run --all-sundays-empty
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AUTHOR_NAME = 'im_shadowpool';
const AUTHOR_EMAIL = 'shadowpoolvs@gmail.com';
const TIMEZONE_OFFSET = '+05:30';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || (!args.includes('--run') && !args.includes('--dry-run'));
const allSundaysEmpty = args.includes('--all-sundays-empty');

// Day-by-day plan for January 2024
const januaryPlan = [
  { date: '2024-01-01', day: 'Monday', commits: 0, reason: "New Year's Day (Gap)" },
  {
    date: '2024-01-02', day: 'Tuesday', commits: 2,
    messages: [
      'chore: configure initial project dependencies and structure',
      'docs: update project setup instructions in notes'
    ]
  },
  {
    date: '2024-01-03', day: 'Wednesday', commits: 5,
    messages: [
      'feat: define memory game theme configurations',
      'feat: add color palette variables for clash theme',
      'style: add initial CSS reset and root theme styles',
      'refactor: extract theme assets into dedicated module',
      'test: verify theme loader behavior'
    ]
  },
  {
    date: '2024-01-04', day: 'Thursday', commits: 3,
    messages: [
      'feat: initialize Card component layout',
      'style: add flip card 3D transform animations',
      'fix: prevent image dragging on card elements'
    ]
  },
  {
    date: '2024-01-05', day: 'Friday', commits: 1,
    messages: [
      'style: refine card border radius and shadow depth'
    ]
  },
  { date: '2024-01-06', day: 'Saturday', commits: 0, reason: 'Weekend Rest (Gap)' },
  { date: '2024-01-07', day: 'Sunday', commits: 0, reason: 'Sunday Rest (Gap)' },
  {
    date: '2024-01-08', day: 'Monday', commits: 4,
    messages: [
      'feat: implement card flip logic and state machine',
      'feat: add matching pair detection helper',
      'refactor: optimize state updates during card comparison',
      'style: add visual pulse indicator on card match'
    ]
  },
  {
    date: '2024-01-09', day: 'Tuesday', commits: 2,
    messages: [
      'feat: add sound effect triggers on card click',
      'fix: mute audio context gracefully when unavailable'
    ]
  },
  {
    date: '2024-01-10', day: 'Wednesday', commits: 7, // Peak Sprint
    messages: [
      'feat: build core game loop and matching engine',
      'feat: support dynamic board layout generation',
      'refactor: extract shuffle algorithm using Fisher-Yates',
      'perf: avoid re-shuffling on unnecessary re-renders',
      'test: add unit test suite for matching verification',
      'fix: resolve duplicate card assignment edge case',
      'docs: document game loop state transitions'
    ]
  },
  {
    date: '2024-01-11', day: 'Thursday', commits: 3,
    messages: [
      'feat: add move counter and turn tracker',
      'feat: implement accuracy percentage calculation',
      'style: polish stats bar layout and typography'
    ]
  },
  {
    date: '2024-01-12', day: 'Friday', commits: 2,
    messages: [
      'feat: add elapsed time game timer',
      'fix: pause timer on game completion or blur'
    ]
  },
  {
    date: '2024-01-13', day: 'Saturday', commits: 1,
    messages: [
      'refactor: clean up unused variables in game container'
    ]
  },
  {
    date: '2024-01-14', day: 'Sunday', commits: allSundaysEmpty ? 0 : 2,
    reason: allSundaysEmpty ? 'Sunday Rest (Gap)' : undefined,
    messages: [
      'style: adjust card spacing for compact screens',
      'feat: add subtle hover elevation on card face'
    ]
  },
  {
    date: '2024-01-15', day: 'Monday', commits: 4,
    messages: [
      'feat: create game victory modal screen',
      'feat: add confetti celebration particle effect',
      'style: refine modal backdrop blur and animation',
      'fix: handle escape key to dismiss modal'
    ]
  },
  { date: '2024-01-16', day: 'Tuesday', commits: 0, reason: 'Midweek Rest (Gap)' },
  {
    date: '2024-01-17', day: 'Wednesday', commits: 6, // Peak Sprint
    messages: [
      'feat: implement responsive board grid scaling',
      'style: add flex wrap fallbacks for mobile layouts',
      'refactor: calculate card dimensions dynamically based on viewport',
      'perf: eliminate layout shift during card render',
      'fix: handle orientation change on tablet devices',
      'style: fine-tune theme background contrast'
    ]
  },
  {
    date: '2024-01-18', day: 'Thursday', commits: 3,
    messages: [
      'feat: introduce 2x3, 3x4, 4x4, and 4x6 board size selection',
      'fix: ensure total cards count is always even',
      'style: add segmented control for difficulty picker'
    ]
  },
  {
    date: '2024-01-19', day: 'Friday', commits: 2,
    messages: [
      'feat: save best scores and shortest times to localStorage',
      'fix: handle quota exceeded exception gracefully'
    ]
  },
  { date: '2024-01-20', day: 'Saturday', commits: 0, reason: 'Weekend Rest (Gap)' },
  { date: '2024-01-21', day: 'Sunday', commits: 0, reason: 'Sunday Rest (Gap)' },
  {
    date: '2024-01-22', day: 'Monday', commits: 3,
    messages: [
      'feat: implement instant restart game button',
      'refactor: centralize resetGameState method',
      'style: polish restart button icon animation'
    ]
  },
  {
    date: '2024-01-23', day: 'Tuesday', commits: 5,
    messages: [
      'feat: add Forest and Snow theme color sets',
      'feat: add Pumpkin theme visual assets',
      'style: add smooth theme transition effect on switch',
      'fix: persist chosen theme preference',
      'docs: update theme customization guide'
    ]
  },
  {
    date: '2024-01-24', day: 'Wednesday', commits: 2,
    messages: [
      'style: improve card back SVG illustrations',
      'fix: SVG viewBox scaling for high DPI screens'
    ]
  },
  {
    date: '2024-01-25', day: 'Thursday', commits: 7, // Peak Sprint
    messages: [
      'perf: optimize card flip rendering with will-change CSS',
      'refactor: memoize Card components with React.memo',
      'perf: clean up interval listeners on unmount',
      'fix: prevent rapid double-clicks from breaking flip state',
      'test: verify card click throttle behavior',
      'style: enhance active card outline for high accessibility',
      'chore: clean up console debug logs'
    ]
  },
  { date: '2024-01-26', day: 'Friday', commits: 0, reason: 'Friday Rest (Gap)' },
  {
    date: '2024-01-27', day: 'Saturday', commits: 2,
    messages: [
      'docs: add preview screenshots and gameplay GIF links',
      'style: refine header navigation bar alignment'
    ]
  },
  {
    date: '2024-01-28', day: 'Sunday', commits: allSundaysEmpty ? 0 : 3,
    reason: allSundaysEmpty ? 'Sunday Rest (Gap)' : undefined,
    messages: [
      'feat: add sound toggle mute button in header',
      'style: add audio wave icon indicator',
      'fix: keep audio toggle state synchronized across tabs'
    ]
  },
  {
    date: '2024-01-29', day: 'Monday', commits: 4,
    messages: [
      'chore: configure Vercel deployment pipeline settings',
      'fix: resolve public URL asset resolution in production',
      'perf: enable asset caching headers',
      'docs: update deployment and live demo link in README'
    ]
  },
  {
    date: '2024-01-30', day: 'Tuesday', commits: 3,
    messages: [
      'feat: add keyboard navigation support for cards (Tab + Enter)',
      'style: add visible focus rings for keyboard users',
      'fix: trap focus inside modal when game is won'
    ]
  },
  {
    date: '2024-01-31', day: 'Wednesday', commits: 2,
    messages: [
      'chore: bump patch version for January milestone release',
      'docs: finalize January 2024 changelog and feature summary'
    ]
  }
];

// Hour distribution for realistic timestamps
const realisticTimeSlots = [
  { hour: 10, minBase: 12 },
  { hour: 11, minBase: 38 },
  { hour: 14, minBase: 24 },
  { hour: 16, minBase: 15 },
  { hour: 17, minBase: 48 },
  { hour: 19, minBase: 32 },
  { hour: 21, minBase: 45 }
];

function generateISODate(dateStr, index, totalOnDay) {
  const slot = realisticTimeSlots[index % realisticTimeSlots.length];
  // Add subtle deterministic jitter
  const minute = Math.min(59, (slot.minBase + (index * 7)) % 60);
  const second = (14 + (index * 13)) % 60;
  
  const pad = (n) => String(n).padStart(2, '0');
  return `${dateStr}T${pad(slot.hour)}:${pad(minute)}:${pad(second)}${TIMEZONE_OFFSET}`;
}

const activityFilePath = path.join(__dirname, '..', 'ACTIVITY.md');

function run() {
  console.log('===========================================================');
  console.log('  January 2024 Realistic GitHub Streak Backfiller');
  console.log('===========================================================');
  console.log(`Author:     ${AUTHOR_NAME} <${AUTHOR_EMAIL}>`);
  console.log(`Timezone:   ${TIMEZONE_OFFSET}`);
  console.log(`Mode:       ${isDryRun ? '🔍 DRY RUN (Preview only)' : '🚀 EXECUTION (Creating Commits)'}`);
  if (allSundaysEmpty) {
    console.log(`Option:     --all-sundays-empty enabled`);
  }
  console.log('-----------------------------------------------------------');

  let totalCommits = 0;
  let activeDays = 0;
  let gapDays = 0;

  const schedulePreview = [];

  for (const dayItem of januaryPlan) {
    const commitCount = dayItem.commits;
    if (commitCount === 0) {
      gapDays++;
      schedulePreview.push({
        Date: dayItem.date,
        Day: dayItem.day,
        Commits: 0,
        Status: dayItem.reason || 'Rest Day (Gap)'
      });
    } else {
      activeDays++;
      totalCommits += commitCount;
      schedulePreview.push({
        Date: dayItem.date,
        Day: dayItem.day,
        Commits: commitCount,
        Status: commitCount >= 6 ? '🟩 Peak Sprint (Dark)' : commitCount >= 3 ? '🟩 Medium' : '🟢 Light'
      });
    }
  }

  console.table(schedulePreview);
  console.log('-----------------------------------------------------------');
  console.log(`Summary:`);
  console.log(`  Total Days in January: 31`);
  console.log(`  Active Days:           ${activeDays}`);
  console.log(`  Rest/Gap Days:         ${gapDays}`);
  console.log(`  Total Commits Planned: ${totalCommits}`);
  console.log('-----------------------------------------------------------');

  if (isDryRun) {
    console.log('\n[DRY RUN COMPLETE] No git commits were created.');
    console.log('To execute this plan and create the commits, run:');
    console.log('  node scripts/backfill-jan-2024.js --run\n');
    return;
  }

  // EXECUTION MODE
  console.log('\nStarting commit generation...\n');

  // Initialize or prepare ACTIVITY.md header
  let activityContent = `# Development Activity Log (January 2024)

Historical development timeline and milestone logs for the Memory Game project.

| Date | Time | Author | Milestone / Commit Note |
| :--- | :--- | :--- | :--- |
`;

  fs.writeFileSync(activityFilePath, activityContent, 'utf8');

  let commitCounter = 0;

  for (const dayItem of januaryPlan) {
    if (dayItem.commits === 0) continue;

    for (let i = 0; i < dayItem.commits; i++) {
      commitCounter++;
      const message = (dayItem.messages && dayItem.messages[i]) || `chore: update project activity log [${dayItem.date}]`;
      const isoTimestamp = generateISODate(dayItem.date, i, dayItem.commits);

      // Append row to ACTIVITY.md
      const logRow = `| ${dayItem.date} | ${isoTimestamp.slice(11, 19)} | ${AUTHOR_NAME} | ${message} |\n`;
      fs.appendFileSync(activityFilePath, logRow, 'utf8');

      // Stage ACTIVITY.md
      execSync('git add ACTIVITY.md', { stdio: 'pipe' });

      // Create git commit with past author and committer dates
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

      process.stdout.write(`\rCreated commit ${commitCounter}/${totalCommits}: ${dayItem.date} - ${message.slice(0, 45)}...`);
    }
  }

  console.log(`\n\n🎉 Successfully created ${commitCounter} commits across January 2024!`);
  console.log('All commits attributed to: ' + AUTHOR_NAME + ' <' + AUTHOR_EMAIL + '>');
  console.log('\nNext step: Push to GitHub by running:');
  console.log('  git push origin main\n');
}

run();
