const extractClasses = (input: string): Set<string> => {
    const classRegex = /class="([^"]*)"/g;
    const classes = new Set<string>();
    let match;

    while ((match = classRegex.exec(input)) !== null) {
        const classList = match[1]!.split(/\s+/).filter(c => c.length > 0);
        classList.forEach(cls => classes.add(cls));
    }

    return classes;
}

const generateRandomClassName = (length: number = 5): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const normalizeClass = (className: string): string => {
    if (className.includes(':')) return className.replace(/:/g, '\\:');
    return className;
}

export const extractClassMap = (input: string): Map<string, string> => {
    const classes = extractClasses(input);
    const map = new Map<string, string>();
    const usedClasses = new Set<string>();

    for (const className of classes) {
        let randomName;

        do {
            randomName = generateRandomClassName(5);
        } while (usedClasses.has(randomName));

        usedClasses.add(randomName);
        map.set(normalizeClass(className), randomName);
    }

    return map;
}

export const replaceClasses = (css: string, map: Map<string, string>): string => {
    let result = css;

    for (const [original, replacement] of map.entries()) {
        const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\.${escapedOriginal}(?![a-zA-Z0-9_-])`, 'g');
        result = result.replace(regex, `.${replacement}`);
    }

    return result;
}

export const removeUselessTailwindCode = (css: string): string | null => {
    const extractLayer = (layerName: string): string | null => {
        const startMatch = css.match(new RegExp(`@layer\\s+${layerName}\\s*\\{`));
        if (!startMatch) return null;

        const startIndex = startMatch.index! + startMatch[0].length;
        let braceCount = 1;
        let endIndex = startIndex;

        // Count braces to find the matching closing brace
        for (let i = startIndex; i < css.length; i++) {
            if (css[i] === '{') braceCount++;
            if (css[i] === '}') braceCount--;
            if (braceCount === 0) {
                endIndex = i;
                break;
            }
        }

        return css.substring(startIndex, endIndex).trim();
    };

    const themeContent = extractLayer('theme');
    const utilitiesContent = extractLayer('utilities');

    // Combine both, filtering out nulls
    const parts = [themeContent, utilitiesContent].filter(Boolean);

    return parts.length > 0 ? parts.join('\n\n') : null;
};

export const replaceClassesInHtml = (html: string, classMap: Map<string, string>): string => {
    return html.replace(/class="([^"]*)"/g, (match, classList) => {
        const classes = classList.split(/\s+/).filter((c: string) => c.length > 0);
        const replacedClasses = classes.map((cls: string) => classMap.get(cls) || cls);
        return `class="${replacedClasses.join(' ')}"`;
    });
}