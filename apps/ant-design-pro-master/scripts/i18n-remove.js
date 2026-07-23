/**
 * i18n removal script - replaces internationalized text with Chinese hardcoded text, removes i18n-related code
 * Run `npm run i18n-remove` to execute this script
 *
 * This operation is irreversible and performs the following changes:
 * - Reads the translation map from src/locales/zh-CN
 * - Replaces intl.formatMessage / useIntl().formatMessage calls with hardcoded Chinese text
 * - Replaces <FormattedMessage> components with Chinese text
 * - Removes imports and usages of useIntl, FormattedMessage, SelectLang, getLocale
 * - Removes the locale configuration from config/config.ts
 * - Replaces the name values in routes.ts with Chinese menu names
 * - Deletes the src/locales/ directory
 */

const fs = require('node:fs');
const path = require('node:path');

const I18N_SYMBOLS = [
  'useIntl',
  'getIntl',
  'FormattedMessage',
  'SelectLang',
  'getLocale',
  'getAllLocales',
  'setLocale',
];
const FORMAT_MESSAGE_PATTERNS = [
  'intl.formatMessage(',
  'useIntl().formatMessage(',
  'getIntl().formatMessage(',
];
const QSTR = `'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)"`;

// ─── Utility functions ───────────────────────────────────────────

function readDirRecursive(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...readDirRecursive(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function toStrLiteral(text) {
  return `'${text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')}'`;
}

function resolveText(id, defaultMsg, localeMap) {
  return localeMap[id] || defaultMsg || id;
}

/**
 * Finds the position of the matching closing parenthesis
 * @param {string} str - The source string
 * @param {number} openIdx - The position of the opening parenthesis (
 * @returns {number} The position of the closing parenthesis ), or -1 if not found
 */
function findClosingParen(str, openIdx) {
  let depth = 0;
  let i = openIdx;
  while (i < str.length) {
    const ch = str[i];
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return i;
    } else if (ch === "'" || ch === '"' || ch === '`') {
      // skip string literal
      const quote = ch;
      i++;
      while (i < str.length && str[i] !== quote) {
        if (str[i] === '\\') i++; // skip escaped char
        i++;
      }
    } else if (ch === '/' && str[i + 1] === '/') {
      // skip single-line comment
      while (i < str.length && str[i] !== '\n') i++;
    } else if (ch === '/' && str[i + 1] === '*') {
      // skip block comment
      i += 2;
      while (i < str.length - 1 && !(str[i] === '*' && str[i + 1] === '/')) i++;
      i++; // skip past */
    }
    i++;
  }
  return -1;
}

// ─── Step 1: Build the zh-CN translation map ────────────────────────

function buildLocaleMap() {
  const localeDir = path.join('src', 'locales');
  const zhCNDir = path.join(localeDir, 'zh-CN');
  const files = readDirRecursive(zhCNDir).filter((f) => f.endsWith('.ts'));
  const mainFile = path.join(localeDir, 'zh-CN.ts');
  const localeMap = {};

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    extractLocaleKeys(content, localeMap);
  }
  if (fs.existsSync(mainFile)) {
    const content = fs.readFileSync(mainFile, 'utf-8');
    extractLocaleKeys(content, localeMap);
  }

  return localeMap;
}

function extractLocaleKeys(content, localeMap) {
  // Match key: 'value' or key: "value", supporting escaped quotes inside values
  const regex =
    /['"]([a-zA-Z0-9_.-]+)['"]\s*:\s*'((?:[^'\\]|\\.)*)'|['"]([a-zA-Z0-9_.-]+)['"]\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  let match = regex.exec(content);
  while (match !== null) {
    const key = match[1] || match[3];
    const value = match[2] || match[4];
    localeMap[key] = value;
    match = regex.exec(content);
  }
}

// ─── Step 2: Get the menu map ─────────────────────────────

function buildMenuMap(localeMap) {
  const menuMap = {};
  for (const [key, value] of Object.entries(localeMap)) {
    if (key.startsWith('menu.')) {
      menuMap[key.slice(5)] = value;
    }
  }
  return menuMap;
}

// ─── Step 3: Replace name in route files ──────────────────────

function replaceRoutes(menuMap) {
  const configDir = path.join('config');
  if (!fs.existsSync(configDir)) {
    console.log('- config/ directory does not exist, skipping');
    return;
  }

  const routeFiles = fs
    .readdirSync(configDir)
    .filter((f) => f.startsWith('routes') && f.endsWith('.ts'))
    .map((f) => path.join(configDir, f));

  for (const routesPath of routeFiles) {
    let content = fs.readFileSync(routesPath, 'utf-8');
    let modified = false;

    content = content.replace(/name:\s*['"]([^'"]+)['"]/g, (match, name) => {
      const zhValue = menuMap[name];
      if (zhValue) {
        modified = true;
        return `name: ${toStrLiteral(zhValue)}`;
      }
      return match;
    });

    if (modified) {
      fs.writeFileSync(routesPath, content);
      console.log(
        `✓ Replaced route names with Chinese in ${path.relative('.', routesPath)}`,
      );
    } else {
      console.log(`- No replacement needed in ${path.relative('.', routesPath)}`);
    }
  }
}

// ─── Step 4: Remove locale config from config/config.ts ────────

function removeLocaleConfig() {
  const configPath = path.join('config', 'config.ts');
  if (!fs.existsSync(configPath)) {
    console.log('- config/config.ts does not exist, skipping');
    return;
  }

  let content = fs.readFileSync(configPath, 'utf-8');
  const original = content;

  // Remove the locale block and its adjacent JSDoc comment (matches only i18n-related comments)
  content = content.replace(
    /\n\s*\/\*\*[^*]*\*+(?:[^/*][^*]*\*+)*\/\n\s*locale:\s*\{[^}]*\},?\n/g,
    '\n',
  );

  // Remove uncommented locale: {...} config blocks
  content = content.replace(/\n\s*locale:\s*\{[^}]*\},?\n/g, '\n');

  // Remove locale: true from layout
  content = content.replace(/\n\s*locale:\s*true,?\n/g, '\n');

  if (content !== original) {
    fs.writeFileSync(configPath, content);
    console.log('✓ Removed locale config from config/config.ts');
  } else {
    console.log('- No changes needed in config/config.ts');
  }
}

// ─── Step 5: Replace i18n calls in source files ──────────────────

function processSourceFiles(localeMap) {
  const srcDir = path.join('src');
  const files = readDirRecursive(srcDir).filter((f) => {
    const ext = path.extname(f);
    return (
      ['.tsx', '.ts', '.jsx', '.js'].includes(ext) &&
      !f.includes('locales') &&
      !f.includes('.umi') &&
      !f.includes('.umi-production') &&
      !f.includes('.umi-test') &&
      !f.endsWith('.d.ts')
    );
  });

  for (const file of files) {
    processFile(file, localeMap);
  }
}

function processFile(filePath, localeMap) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  if (
    !content.includes('formatMessage') &&
    !content.includes('FormattedMessage') &&
    !content.includes('useIntl') &&
    !content.includes('getIntl') &&
    !content.includes('SelectLang') &&
    !content.includes('getLocale') &&
    !content.includes('getAllLocales') &&
    !content.includes('setLocale')
  ) {
    return;
  }

  // ── 1. Replace formatMessage calls (using bracket matching for precision)
  // Only replaces simple calls where id is a string literal with no second argument
  content = replaceFormatMessageCalls(content, localeMap);

  // ── 2. Replace <FormattedMessage ... /> (using exact matching)
  // Only replaces calls where id is a string literal
  content = replaceFormattedMessageComponents(content, localeMap);

  // ── 3. Remove const intl = useIntl() / const intl = getIntl() declarations
  // Only removes them when there are no other intl. references left in the file
  if (!content.match(/\bintl\./)) {
    content = content.replace(
      /\n\s*(?:\/\*\*[\s\S]*?\*\/\n\s*)?const\s+intl\s*=\s*(?:useIntl|getIntl)\(\)\s*;?\n/g,
      '\n',
    );
  }

  // ── 4. Remove SelectLang usage
  content = content.replace(
    /\n?\s*\{SelectLang\s*&&\s*<SelectLang\s*\/>\s*\}/g,
    '',
  );

  // ── 5. Handle getLocale() calls
  content = content.replace(
    /const\s+(\w+)\s*=\s*getLocale\(\)\s*;?/g,
    (_match, varName) => {
      return `const ${varName} = 'zh-CN';`;
    },
  );

  // ── 5b. Handle getAllLocales() calls
  content = content.replace(
    /useMemo\(\(\)\s*=>\s*getAllLocales\(\),\s*\[\]\)/g,
    "['zh-CN']",
  );
  content = content.replace(
    /const\s+(\w+)\s*=\s*getAllLocales\(\)\s*;?/g,
    (_match, varName) => {
      return `const ${varName} = ['zh-CN'];`;
    },
  );

  // ── 5c. Remove setLocale() calls (using bracket matching to handle nested parens)
  content = removeSetLocaleCalls(content);

  // ── 6. Remove the data-lang attribute
  content = content.replace(
    /\s*data-lang(?:\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\}))?/g,
    '',
  );

  // ── 7. Remove Lang component usage and definition
  content = content.replace(/\n?\s*<Lang\s*\/>/g, '');
  content = content.replace(
    /const Lang = \(\) => \{\s*\n\s*const \{ styles \} = useStyles\(\);\s*\n\s*return \(\s*\n\s*<div className=\{styles\.lang\}>\s*\n\s*<\/div>\s*\n\s*\);\s*\n\s*\};\n?/g,
    '',
  );

  // ── 8. Clean up import statements
  // Only removes i18n-related symbols that are no longer used in the file
  content = content.replace(
    /import\s*\{([^}]*)\}\s*from\s*['"]@umijs\/max['"];?\n?/g,
    (match, imports) => {
      const codeWithoutImport = content.replace(match, '');
      const items = imports
        .split(',')
        .map((s) => s.trim())
        .filter((s) => {
          if (!s || !I18N_SYMBOLS.includes(s)) return true;
          const regex = new RegExp(`\\b${s}\\b`);
          return regex.test(codeWithoutImport);
        });

      if (items.length === 0) {
        return '';
      }

      return `import { ${items.join(', ')} } from '@umijs/max';\n`;
    },
  );

  // ── 9. Simplify {'Chinese text'} → Chinese text in JSX text children
  content = content.replace(/\{'([^']*)'\}/g, (match, text, offset, str) => {
    const before = str.slice(Math.max(0, offset - 30), offset);
    const charBeforeBrace = before.trimEnd().slice(-1);
    // Do not simplify: JSX attributes (=), template strings ($), function args/arrays/expressions ((, [, ,)
    if (
      charBeforeBrace === '=' ||
      charBeforeBrace === '$' ||
      charBeforeBrace === '(' ||
      charBeforeBrace === ',' ||
      charBeforeBrace === '['
    ) {
      return match;
    }
    return text;
  });

  // ── 10. Simplify the quoted translated text produced by FormattedMessage in JSX text children
  content = content.replace(
    />(\s*)'([^'<]*?)'(\s*)<\//g,
    (_match, ws1, text, ws2) => {
      return `>${ws1}${text}${ws2}</`;
    },
  );

  // ── 11. Clean up leftovers
  content = content.replace(/^\s*;\s*$/gm, '');
  content = content.replace(/\n{3,}/g, '\n\n');
  content = `${content.trimEnd()}\n`;

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    const relPath = path.relative('.', filePath);
    console.log(`✓ Processed: ${relPath}`);
  }
}

/**
 * Replaces intl.formatMessage(...) and useIntl().formatMessage(...)
 * Uses bracket matching to precisely find the complete function call
 */
function replaceFormatMessageCalls(content, localeMap) {
  const patterns = FORMAT_MESSAGE_PATTERNS;

  for (const pattern of patterns) {
    let searchFrom = 0;
    while (true) {
      const idx = content.indexOf(pattern, searchFrom);
      if (idx === -1) break;

      const openParenIdx = idx + pattern.length - 1; // position of (
      const closeParenIdx = findClosingParen(content, openParenIdx);

      if (closeParenIdx === -1) {
        searchFrom = idx + 1;
        continue;
      }

      const fullCall = content.slice(idx, closeParenIdx + 1);

      // Check whether id is a string literal (supports values with escaped quotes)
      const idMatch = fullCall.match(new RegExp(`id:\\s*${QSTR}`));
      if (!idMatch) {
        searchFrom = closeParenIdx + 1;
        continue;
      }

      const id = idMatch[1] || idMatch[2];
      const dmMatch = fullCall.match(new RegExp(`defaultMessage:\\s*${QSTR}`));
      const defaultMsg = dmMatch ? dmMatch[1] || dmMatch[2] : '';

      // Check for a second argument (ICU formatting params); skip if present
      // End of first argument: find the first },{ or },\s*{
      const firstArgEnd = fullCall.indexOf('},');
      if (firstArgEnd !== -1 && firstArgEnd < fullCall.length - 2) {
        // Has a second argument — cannot statically replace, skip
        console.log(`  ⚠ Skipping call with ICU params: ${id}`);
        searchFrom = closeParenIdx + 1;
        continue;
      }

      const zhText = toStrLiteral(resolveText(id, defaultMsg, localeMap));
      content =
        content.slice(0, idx) + zhText + content.slice(closeParenIdx + 1);

      searchFrom = idx + zhText.length;
    }
  }

  return content;
}

/**
 * Replaces <FormattedMessage id="xxx" defaultMessage="yyy" />
 * Only replaces components where id is a string literal
 */
function replaceFormattedMessageComponents(content, localeMap) {
  let searchFrom = 0;
  const pattern = '<FormattedMessage';

  while (true) {
    const idx = content.indexOf(pattern, searchFrom);
    if (idx === -1) break;

    const endPattern = '/>';
    let endIdx = content.indexOf(endPattern, idx);
    if (endIdx === -1) break;
    endIdx += endPattern.length; // include />

    const fullTag = content.slice(idx, endIdx);

    const idMatch = fullTag.match(new RegExp(`id=${QSTR}`));
    if (!idMatch) {
      searchFrom = endIdx;
      continue;
    }

    const id = idMatch[1] || idMatch[2];
    const dmMatch = fullTag.match(new RegExp(`defaultMessage=${QSTR}`));
    const defaultMsg = dmMatch ? dmMatch[1] || dmMatch[2] : '';

    const zhText = resolveText(id, defaultMsg, localeMap);
    const replacement = toStrLiteral(zhText);
    content = content.slice(0, idx) + replacement + content.slice(endIdx);
    searchFrom = idx + replacement.length;
  }

  return content;
}

/**
 * Removes setLocale() calls, using bracket matching to handle nested parens
 */
function removeSetLocaleCalls(content) {
  const pattern = 'setLocale(';
  let searchFrom = 0;
  while (true) {
    const idx = content.indexOf(pattern, searchFrom);
    if (idx === -1) break;

    const openParenIdx = idx + pattern.length - 1;
    const closeParenIdx = findClosingParen(content, openParenIdx);
    if (closeParenIdx === -1) {
      searchFrom = idx + 1;
      continue;
    }

    // Remove the entire call including trailing semicolon
    let endIdx = closeParenIdx + 1;
    if (content[endIdx] === ';') endIdx++;

    content = content.slice(0, idx) + content.slice(endIdx);
    searchFrom = idx;
  }
  return content;
}

// ─── Step 6: Delete the locales directory ─────────────────────────

function deleteLocalesDir() {
  const localeDir = path.join('src', 'locales');
  fs.rmSync(localeDir, { recursive: true, force: true });
  console.log('✓ Deleted the src/locales/ directory');
}

// ─── Residual check ────────────────────────────────────────────

function checkResiduals() {
  const residualSymbols = [
    'useIntl',
    'getIntl',
    'FormattedMessage',
    'getLocale',
    'getAllLocales',
    'setLocale',
  ];
  const srcDir = path.join('src');
  const files = readDirRecursive(srcDir).filter((f) => {
    const ext = path.extname(f);
    return (
      ['.tsx', '.ts', '.jsx', '.js'].includes(ext) &&
      !f.includes('.umi') &&
      !f.includes('.umi-production') &&
      !f.includes('.umi-test') &&
      !f.endsWith('.d.ts')
    );
  });

  let found = false;
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    for (const sym of residualSymbols) {
      const regex = new RegExp(`\\b${sym}\\b`);
      const match = regex.exec(content);
      if (match) {
        const relPath = path.relative('.', file);
        const line = content.slice(0, match.index).split('\n').length;
        console.log(`  ⚠ ${relPath}:${line} has a residual ${sym} call, please check manually`);
        found = true;
      }
    }
  }

  if (!found) {
    console.log('✓ No residual i18n calls');
  }
}

// ─── Step 7: Remove the i18n-remove script from package.json ──────

function updatePackageJson() {
  const pkgPath = 'package.json';
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  if (pkg.scripts?.['i18n-remove']) {
    delete pkg.scripts['i18n-remove'];
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    console.log('✓ Removed the i18n-remove script from package.json');
  }
}

// ─── Main function ─────────────────────────────────────────────

function main() {
  console.log('========================================');
  console.log('  Starting the i18n removal script');
  console.log('========================================\n');

  console.log('>>> Building the Chinese translation map...');
  const localeMap = buildLocaleMap();
  const menuMap = buildMenuMap(localeMap);
  console.log(`✓ Loaded ${Object.keys(localeMap).length} translation map entries`);

  console.log('\n>>> Replacing route names with Chinese...');
  replaceRoutes(menuMap);

  console.log('\n>>> Removing locale config from config/config.ts...');
  removeLocaleConfig();

  console.log('\n>>> Replacing i18n calls in source files...');
  processSourceFiles(localeMap);

  console.log('\n>>> Deleting the locales directory...');
  deleteLocalesDir();

  console.log('\n>>> Updating package.json...');
  updatePackageJson();

  console.log('\n>>> Checking for residual i18n calls...');
  checkResiduals();

  console.log('\n========================================');
  console.log('  i18n removal complete!');
  console.log('  Please run npm install and review the code');
  console.log('========================================');
}

main();
