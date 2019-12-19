# XML-parser

The project is about parsing of XML file and reproducing data that XML document contains on HTML file. Maybe, more correctly to name this parser ***DOCX-parser***, but in this application we only transform `*.docx` -> `*.xml`, using [adm-zip](https://www.npmjs.com/package/adm-zip) package and parse `*.xml` file, using [xpath](https://www.npmjs.com/package/xpath) and [xmldom](https://www.npmjs.com/package/xmldom) packages.

### To start working with project, you should follow the next instructions:
1. You should download this repository, using next command:
  - `git clone https://github.com/IvanchikovValentin/XML-parser.git`
2. In repository directory run next command to download required packages: ` npm install `
3. To start application, run next command: ` npm start `
4. In browser, follow the link: ` http://localhost:3000/xpath?file=Bears `

**NOTE**: you can change parsing file to another (with changing a file name in code and in query parameter in link).
We **not recommend** to change structure of .docx file template, because we do not guarantee that parser will work correctly after that😁

Good luck🍀
