export const buildOutput = (css: string, html: string) => {
    return `<!DOCTYPE html>
    <html>
        <body>
            <style>
                ${css}
            </style>
            ${html}
        </body>
    </html>`;
}