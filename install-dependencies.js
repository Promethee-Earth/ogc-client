import { execSync } from 'child_process';

const useOL = process.env.USE_OL === 'true';

// Fonction pour installer les dépendances
const installDependency = (dep) => {
  console.log(`Installing ${dep}...`);
  execSync(`npm install ${dep}`, { stdio: 'inherit' });
};

// Ajout conditionnel des dépendances
if (useOL) {
  installDependency('ol');
}

