const subBtn=document.querySelector("button")
const file=document.querySelector("input")
subBtn.addEventListener("click",async (event)=>{
event.preventDefault()
const filename=file.value
console.log(filename)
await sendToServer(filename)
})
async function sendToServer(filename)
{
    await fetch('127.0.0.1:5000/convert',{
        method:"post",
        body:JSON.stringify(filename)

    })
}