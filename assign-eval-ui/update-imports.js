const fs = require('fs');
const path = require('path');

// Define path aliases
const aliases = {
    "@app/": "src/app/",
    "@api/": "src/app/api/",
    "@auth/": "src/app/auth/",
    "@core/": "src/app/core/",
    "@shared/": "src/app/shared/",
    "@developer/": "src/app/developer/",
    "@project-manager/": "src/app/project-manager/",
    "@assets/": "src/assets/"
};

// Directory to scan
const projectDir = path.resolve(__dirname, "src");

// Function to scan and update imports
function updateImports(directory) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
        const fullPath = path.join(directory, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
            updateImports(fullPath);
        } else if (file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let updatedContent = content;

            Object.entries(aliases).forEach(([alias, relativePath]) => {
                const regex = new RegExp(`from ['"](${relativePath.replace(/\//g, '\\/')}[^'"]*)['"]`, 'g');
                updatedContent = updatedContent.replace(regex, (_, match) => `from '${alias}${match.slice(relativePath.length)}'`);
            });

            if (content !== updatedContent) {
                fs.writeFileSync(fullPath, updatedContent, 'utf-8');
                console.log(`Updated imports in: ${fullPath}`);
            }
        }
    });
}

// Start updating imports
updateImports(projectDir);
console.log("Import updates completed!");
