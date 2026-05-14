const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

async function convert() {
  try {
    const inputPath = path.join(process.cwd(), "CONTRATTO APPALTO.docx");
    const result = await mammoth.convertToHtml({ path: inputPath });
    const html = result.value; // The generated HTML
    const messages = result.messages; // Any messages, such as warnings during conversion
    
    console.log("Conversion complete. Preview of HTML (first 500 chars):");
    console.log(html.substring(0, 500));
    
    // Write full HTML to a file to be inspected
    fs.writeFileSync("contract_template.html", html);
    console.log("Full HTML saved to contract_template.html");
  } catch (error) {
    console.error("Error converting file:", error);
  }
}

convert();
