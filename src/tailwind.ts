import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateTailwindCSS = async (input: string): Promise<string> => {
    // keep temp dir at the same level, otherwise it will not find tailwindcss
    const tempDir = fs.mkdtempSync(path.join(__dirname, "tmpfolder-"));
    const htmlFile = path.join(tempDir, 'temp.html');
    const cssFile = path.join(tempDir, 'input.css');

    try {
        fs.writeFileSync(htmlFile, input);
        fs.writeFileSync(cssFile, `@import "tailwindcss" @source "${htmlFile}";`);

        const cssContent = fs.readFileSync(cssFile, 'utf-8');

        const result = await postcss([
            tailwindcss({
                base: tempDir,
            })
        ]).process(cssContent, {
            from: cssFile,
        });

        return result.css;
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}