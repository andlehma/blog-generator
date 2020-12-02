const marked = require("marked");
const fs = require("fs");
const path = require("path");

const pagesDir = "pages";

const filePathWithoutExtension = (fileName) =>
  fileName.split(".").slice(0, -1).join(".");

const [markdownFiles, htmlFiles] = fs.readdirSync(pagesDir).reduce(
  (accumulator, currentDir) => {
    const currentDirMdFiles = fs
      .readdirSync(`${pagesDir}/${currentDir}`)
      .filter((file) => path.extname(file) === ".md")
      .map((file) => `${pagesDir}/${currentDir}/${file}`);
    const currentDirHtmlFiles = currentDirMdFiles.map(
      (file) => filePathWithoutExtension(file) + ".html"
    );
    return [
      accumulator[0].concat(currentDirMdFiles),
      accumulator[1].concat(currentDirHtmlFiles),
    ];
  },
  [[], []]
);

const generatePageHtml = (fileName) => {
  const file = fs.readFileSync(fileName, "utf-8");
  const md = marked(file);
  const outFileName = filePathWithoutExtension(fileName);
  fs.writeFileSync(`${outFileName}.html`, md);
};

markdownFiles.forEach((page) => {
  generatePageHtml(page);
});

const indexHtml =
  "<!DOCTYPE html><html><head></head><body><ul>" +
  htmlFiles.map((file) => `<li><a href=${file}>${file}</a></li>`).join("") +
  "</ul></body></html>";

const indexFileName = "index.html";
fs.writeFileSync(indexFileName, indexHtml);
