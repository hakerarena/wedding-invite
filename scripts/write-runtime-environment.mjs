import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultsPath = join(projectRoot, 'assets', 'environment.json');
const vercelConfigPath = join(projectRoot, 'vercel.json');
const runtimeEnvironment = JSON.parse(readFileSync(defaultsPath, 'utf8'));
const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf8'));

const environmentVariables = {
  showPrologue: 'FEATURE_SHOW_PROLOGUE',
  showFamilyInvitation: 'FEATURE_SHOW_FAMILY_INVITATION',
  showCountdownTimer: 'FEATURE_SHOW_COUNTDOWN_TIMER',
  showNandimukh: 'FEATURE_SHOW_NANDIMUKH',
  showEngagementSangeet: 'FEATURE_SHOW_ENGAGEMENT_SANGEET',
  showFlowerHaldi: 'FEATURE_SHOW_FLOWER_HALDI',
  showWeddingDay: 'FEATURE_SHOW_WEDDING_DAY',
  showOutro: 'FEATURE_SHOW_OUTRO',
  enableAudio: 'FEATURE_ENABLE_AUDIO',
};

function parseBoolean(value, variableName) {
  const normalized = value.trim().toLowerCase();

  if (['1', 'true', 'on', 'yes'].includes(normalized)) return true;
  if (['0', 'false', 'off', 'no'].includes(normalized)) return false;

  throw new Error(`${variableName} must be true/false, 1/0, on/off, or yes/no.`);
}

for (const [feature, variableName] of Object.entries(environmentVariables)) {
  const value = process.env[variableName];
  if (value !== undefined) {
    runtimeEnvironment.features[feature] = parseBoolean(value, variableName);
  }
}

if (!vercelConfig.outputDirectory) {
  throw new Error('vercel.json must define outputDirectory for runtime feature configuration.');
}

const outputPath = join(
  projectRoot,
  vercelConfig.outputDirectory,
  'assets',
  'environment.json',
);
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(runtimeEnvironment, null, 2)}\n`);
console.info(`Wrote runtime feature flags to ${outputPath}`);