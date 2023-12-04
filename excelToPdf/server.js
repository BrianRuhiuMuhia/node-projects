const express=require("express")
const app=express()
const path=require("path")
const fs = require('fs');
const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');
const multer=require("multer");
const cors=require('cors')
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(cors())
app.use(express.static("public"))
app.use(express.urlencoded({extended:false}))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended:false,limit: '50mb'}))
const storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
        cb(null, "./uploads"); 
    }, 
    filename: function (req, file, cb) { 
        cb(null, file.originalname); 
    }, 
}); 
const upload = multer({ storage: storage,limits: { fileSize: 1000000000000 } , dest: 'uploads/',fileFilter: function(req, file, cb) {
  try{
    if (!file.originalname.match(/\.(xlsx)$/)) {
     cb(new Error('Please upload a JPG or PNG image.'));
      
    }
    cb(null, true);
  }
  catch(err){
console.log(err)

  }
    
  }});
app.get("/",(req,res)=>{
    res.render("home")
})
app.post("/convert",upload.single('file'),async (req,res)=>{
const filePath=req.file.path
const dest=path.join(__dirname, 'pdfs')
if(filePath!=null || filePath!=undefined)
{
 await convertWorkbookToHTML(filePath)
    .then(async (html)=>{
      await convertHTMLToPDF(html).then((pdf)=>{
        fs.writeFileSync("file.pdf",pdf)
      })
    })
    .catch(err => console.error(err));
}

    return res.json({"mssg":"hello world"})

})

app.listen(5000,()=>{
    console.log("server running on port 5000")
})
async function convertWorkbookToHTML(filename) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filename);

  let html = '';
  workbook.eachSheet((worksheet, sheetId) => {
      html += '<table border="1">';
      worksheet.eachRow((row, rowNumber) => {
          html += '<tr>';
          row.eachCell((cell, colNumber) => {
              html += `<td>${cell.text}</td>`;
          });
          html += '</tr>';
      });
      html += '</table>';
  });

  return html;
}
async function convertHTMLToPDF(html) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, {
        waitUntil: 'networkidle0'
    });

    const pdf = await page.pdf({
        format: 'A4',
        printBackground: true
    });

    await browser.close();
    return pdf;
}