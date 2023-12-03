const express=require("express")
const app=express()
const path=require("path")
const { load } = require('@pspdfkit/nodejs');
const fs = require('node:fs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static("public"))
app.use(express.urlencoded({extended:false}))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended:false,limit: '50mb'}))
app.get("/",(req,res)=>{
    res.render("home")
})
app.post("/convert",(req,res)=>{
    const {filename}=req.body
    console.log(filename)
    return res.json({"mssg":"hello world"})
    // convertToPDF(filename)

})

app.listen(5000,()=>{
    console.log("server running on port 5000")
})
async function convertToPDF(filename) {
	const docx = fs.readFileSync(filename);
	const instance = await load({
		document: docx,
	});
	const buffer = await instance.exportPDF();
	fs.writeFileSync('converted.pdf', Buffer.from(buffer));
	await instance.close();
}