export const vfPart1 = `<!DOCTYPE html>
<html>

<head>
    <title>Unlock GeoCrypt</title>
    <script src="https://cdn.jsdelivr.net/gh/gildas-lormeau/zip.js@2.7.6/dist/zip-full.min.js"
        integrity="sha384-kP13zeVm0yhzyaXbBlr4UV6cM9+M8TUBI7j2A6z2mVgyxTqchjok1k1mQGI8Le5C"
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script>
        const version = "2.0.0";
        const blobString = "data:application/zip;base64,`;

export const vfPart2 = `";
const loadFiles = async () => {
    const gcPassword = document.getElementById("passwordBox").value;
    fetch(blobString)
        .then(res => res.blob())
        .then(fileBlob => {
            if (fileBlob) {
                const zipFileReader = new window.zip.BlobReader(fileBlob);
                const zipReader = new window.zip.ZipReader(zipFileReader);

                zipReader.getEntries().then((zipFiles) => {
                    document.getElementById("fileList").innerHTML = "";
                    zipFiles.forEach(async function (file) {
                        const link = document.createElement("a");
                        link.href = "#";
                        link.onclick = function () {
                            if (!file.getData) return;
                            const writer = new window.zip.BlobWriter();
                            file.getData(writer, { password: gcPassword }).then(function (fileData) {
                                const anchor = document.createElement("a");
                                const clickEvent = new MouseEvent("click");
                                anchor.href = URL.createObjectURL(fileData);
                                anchor.download = file.filename;
                                anchor.dispatchEvent(clickEvent);
                            }).catch(err => alert(err));
                        };
                        link.innerHTML = file.filename;
                        const listEl = document.createElement("li")
                        listEl.appendChild(link);
                        document.getElementById("fileList").appendChild(listEl);
                    });
                });
                // await zipReader.close();//TODO: you may not be able to close this because files would need loading
            }
        })
}
</script>
</head>
<style>
body {
font-family: tahoma;
border: 1px solid black;
width: 30%;
margin: auto;
}
</style>

<body>
<h1>Open GeoCrypt</h1>
<p>Enter GeoCrypt Password.</p><input type="text" id="passwordBox" name="passwordBox"
placeholder="Type Password Here"> <button onclick="loadFiles()">Open</button>
<ol id="fileList"></ol>
<hr>
<a href="https://geocrypt.me">Made with GeoCrypt</a>
<p>warning: may not work with large files on firefox</p>
</body>
<script>
document.getElementById("passwordBox").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      loadFiles()
    }
});
</script>
</html>`;

export const vaultOpenerSize = new TextEncoder().encode(vfPart1).byteLength +
            new TextEncoder().encode(vfPart2).byteLength