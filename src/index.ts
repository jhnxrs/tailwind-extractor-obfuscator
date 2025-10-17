import { extractClassMap, removeUselessTailwindCode, replaceClasses, replaceClassesInHtml } from "./classes";
import { generateTailwindCSS } from "./tailwind";
import { buildOutput } from "./utilities";
import prettier from 'prettier';

const execute = async (input: string) => {
    // get map of classes
    const map = extractClassMap(input);
    // generate tailwindcss code
    const tailwind = await generateTailwindCSS(input);
    // replace classes on tailwindcss code
    const replaced = replaceClasses(tailwind, map);
    // get only the necessary classes from tailwindcss code
    const css = removeUselessTailwindCode(replaced);
    // replace classes on the input html
    const html = replaceClassesInHtml(input, map);
    // build output
    const output = buildOutput(css || '', html);
    // format with prettier and return
    return await prettier.format(output, { parser: 'html' });
};

console.log(await execute(`<div class="bg-red-500 w-10 h-10 hover:bg-red-600 rounded-lg"></div>`));