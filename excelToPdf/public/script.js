const subBtn = document.querySelector("button");
const fileInput = document.querySelector("input");

subBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const file = fileInput.files[0]; // get the file object from the file input
    const formData = new FormData();
    formData.append('file', file); // append the file object, not the file input element
    await sendToServer(formData);
});

async function sendToServer(file) {
    await fetch('http://127.0.0.1:5000/convert', {
        method: "POST",
        body: file
    });
}
