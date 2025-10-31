const fs = require('fs');
const path = require('path');

const baseConfig = require('./app.json');

function readDotEnv() {
  const envPath = path.resolve(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const envMap = {};
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key) {
      envMap[key] = value;
    }
  }

  return envMap;
}

function buildConfig() {
  const envFromFile = readDotEnv();
  const mergedEnv = {
    ...envFromFile,
    ...process.env,
  };

  const baseExpoConfig = baseConfig.expo ?? {};
  const baseExtra = baseExpoConfig.extra ?? {};

  return {
    ...baseConfig,
    expo: {
      ...baseExpoConfig,
      extra: {
        ...baseExtra,
        EXPO_PUBLIC_OPENAI_API_KEY:
          mergedEnv.EXPO_PUBLIC_OPENAI_API_KEY ?? baseExtra.EXPO_PUBLIC_OPENAI_API_KEY ?? '',
      },
    },
  };
}

module.exports = () => buildConfig();
