import fs from "node:fs";

const PACKAGE_JSON_PATH = "package.json";
const CARGO_TOML_PATH = "src-tauri/Cargo.toml";
const TAURI_CONFIG_PATH = "src-tauri/tauri.conf.json";

const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function readCargoPackageVersion() {
  const cargo = fs.readFileSync(CARGO_TOML_PATH, "utf8");
  const packageSection = cargo.match(/\[package\]([\s\S]*?)(?=\n\[|$)/)?.[1];
  const version = packageSection?.match(/^version\s*=\s*"([^"]+)"/m)?.[1];

  if (!version) {
    throw new Error(`Version not found in ${CARGO_TOML_PATH}`);
  }

  return { cargo, version };
}

function getVersions() {
  const packageJson = readJson(PACKAGE_JSON_PATH);
  const tauriConfig = readJson(TAURI_CONFIG_PATH);
  const { cargo, version: cargoVersion } = readCargoPackageVersion();

  return {
    packageJson,
    tauriConfig,
    cargo,
    versions: {
      packageJson: packageJson.version,
      cargo: cargoVersion,
      tauri: tauriConfig.version,
    },
  };
}

function checkVersions() {
  const { versions } = getVersions();
  const uniqueVersions = new Set(Object.values(versions));

  if (uniqueVersions.size !== 1) {
    console.error("Versions are not synchronized:");
    for (const [file, version] of Object.entries(versions)) {
      console.error(`  ${file}: ${version}`);
    }
    process.exit(1);
  }

  console.log(`Versions synchronized: ${versions.packageJson}`);
}

function setVersion(version) {
  if (!version || !VERSION_PATTERN.test(version)) {
    console.error("Usage: bun run version:set -- 1.2.3");
    console.error("The version must follow SemVer.");
    process.exit(1);
  }

  const { packageJson, tauriConfig, cargo } = getVersions();

  packageJson.version = version;
  fs.writeFileSync(
    PACKAGE_JSON_PATH,
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );

  tauriConfig.version = version;
  fs.writeFileSync(
    TAURI_CONFIG_PATH,
    `${JSON.stringify(tauriConfig, null, 2)}\n`,
  );

  const packageSection = cargo.match(/\[package\]([\s\S]*?)(?=\n\[|$)/)?.[1];
  const updatedPackageSection = packageSection?.replace(
    /^(version\s*=\s*)"[^"]+"/m,
    `$1"${version}"`,
  );

  if (!packageSection || updatedPackageSection === packageSection) {
    throw new Error(`Version not found in ${CARGO_TOML_PATH}`);
  }

  const updatedCargo = cargo.replace(packageSection, updatedPackageSection);
  fs.writeFileSync(CARGO_TOML_PATH, updatedCargo);

  console.log(`Version synchronized: ${version}`);
  console.log(`  - ${PACKAGE_JSON_PATH}`);
  console.log(`  - ${CARGO_TOML_PATH}`);
  console.log(`  - ${TAURI_CONFIG_PATH}`);
}

const argument = process.argv[2];

if (argument === "--check") {
  checkVersions();
} else {
  setVersion(argument);
}
