const express=require("express")
const app=express()
const path=require("path")
const { load } = require('@pspdfkit/nodejs');
const fs = require('node:fs');
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
app.post("/convert",upload.single('file'),(req,res)=>{
const filePath=req.file.path
const dest=path.join(__dirname, 'pdfs')
    convertToPDF(filePath,dest)
    return res.json({"mssg":"hello world"})

})

app.listen(5000,()=>{
    console.log("server running on port 5000")
})
async function convertToPDF(path,dest) {
	const docx = fs.readFileSync(path);
	const instance = await load({
		document: docx,
	});
	const buffer = await instance.exportPDF();
	fs.writeFileSync(dest, Buffer.from(buffer));
	await instance.close();
}