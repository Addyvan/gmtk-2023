import fs from "fs-extra";
import esbuild from 'esbuild';
import svgrPlugin from 'esbuild-plugin-svgr';
import * as path from "path";
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function build() {
    fs.copySync(`./public/final.html`, `./dist/final/index.html`);
    await esbuild.build({
        entryPoints: ['src/index.ts'],
        outdir: 'dist/final',
        bundle: true,
        minify: true,
        treeShaking: false,
        sourcemap: false,
        loader: { 
            '.png': 'text',
            '.gif': 'text',
            '.tmLanguage': 'text',
            '.ttf': 'text',
            '.json': 'text',
            '.fbx': 'dataurl',
            '.wav': "dataurl",
            ".mp3": "dataurl",
        },
        external: ['require', 'fs', "crypto", "assert", "url"],
        plugins: [
            svgrPlugin()
        ],
    }).then((result) => {
        let jsSrc = fs.readFileSync(path.join(__dirname, `../dist/final/index.js`)).toString();
        let css = fs.readFileSync(path.join(__dirname, `../dist/final/index.css`)).toString();
        let indexHTML = fs.readFileSync(path.join(__dirname, `../dist/final/index.html`)).toString();
        
        indexHTML = indexHTML.replace("/* CODE */", jsSrc);
        indexHTML = indexHTML.replace("/* STYLESHEET */", css); 

        fs.writeFileSync(path.join(__dirname, `../dist/bundle.html`), indexHTML);

    });

}

build().catch((err) => {
    console.error(err);
})