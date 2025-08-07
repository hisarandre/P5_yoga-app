// merge-coverage.cjs
const fs = require('fs/promises');

// Try to use istanbul-lib-coverage if available, fallback to manual merge
let libCoverage;
try {
  libCoverage = require('istanbul-lib-coverage');
} catch (e) {
  console.log('istanbul-lib-coverage not found, using manual merge');
}

function mergeCoverageWithLib(coverageObjects) {
  const map = libCoverage.createCoverageMap();

  for (const coverage of coverageObjects) {
    map.merge(coverage);
  }

  return map.toJSON();
}

function mergeCoverageManually(coverageObjects) {
  const merged = {};

  // Merge all coverage objects
  for (const coverage of coverageObjects) {
    for (const [filePath, fileData] of Object.entries(coverage)) {
      if (!merged[filePath]) {
        // First time seeing this file, copy it
        merged[filePath] = { ...fileData };
      } else {
        // File already exists, merge the coverage data
        const existing = merged[filePath];

        // Merge statement counts
        if (fileData.s && existing.s) {
          for (const [key, count] of Object.entries(fileData.s)) {
            existing.s[key] = (existing.s[key] || 0) + count;
          }
        }

        // Merge function counts
        if (fileData.f && existing.f) {
          for (const [key, count] of Object.entries(fileData.f)) {
            existing.f[key] = (existing.f[key] || 0) + count;
          }
        }

        // Merge branch counts
        if (fileData.b && existing.b) {
          for (const [key, branches] of Object.entries(fileData.b)) {
            if (!existing.b[key]) {
              existing.b[key] = [...branches];
            } else {
              for (let i = 0; i < branches.length; i++) {
                existing.b[key][i] = (existing.b[key][i] || 0) + (branches[i] || 0);
              }
            }
          }
        }
      }
    }
  }

  return merged;
}

async function run() {
  try {
    const unit = JSON.parse(await fs.readFile('./coverage/unit/coverage-final.json', 'utf8'));
    const integration = JSON.parse(await fs.readFile('./coverage/integration/coverage-final.json', 'utf8'));

    const merged = libCoverage
      ? mergeCoverageWithLib([unit, integration])
      : mergeCoverageManually([unit, integration]);

    await fs.mkdir('./coverage/merged', { recursive: true });
    await fs.writeFile('./coverage/merged/coverage-final.json', JSON.stringify(merged, null, 2));

    console.log('✅ Couverture fusionnée dans ./coverage/merged/coverage-final.json');
    console.log(`📊 Méthode utilisée: ${libCoverage ? 'istanbul-lib-coverage' : 'fusion manuelle'}`);
  } catch (error) {
    console.error('❌ Erreur lors de la fusion :', error.message);

    // Provide more specific error messages
    if (error.code === 'ENOENT') {
      console.error('Vérifiez que les fichiers de couverture existent :');
      console.error('- ./coverage/unit/coverage-final.json');
      console.error('- ./coverage/integration/coverage-final.json');
    }

    throw error;
  }
}

run().catch(err => {
  console.error('❌ Erreur lors de la fusion :', err);
  process.exit(1);
});
