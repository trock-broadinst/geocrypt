export const generateVaultFile = (b64FileString:string) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <title>Unlock GeoCrypt</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
            integrity="sha512-XMVd28F1oH/O71fzwBnV7HucLxVwtxf26XV8P4wPk26EDxuGZ91N8bsOttmnomcCD3CS5ZMRL50H0GgOHvegtg=="
            crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js"
            integrity="sha512-csNcFYJniKjJxRWRV1R7fvnXrycHP6qDR21mgz1ZP55xY5d+aHLfo9/FcGDQLfn2IfngbAHd8LdfsagcCqgTcQ=="
            crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
            integrity="sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA=="
            crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script>const version = "1.0.0";
            const b64FileString = "${b64FileString}";
            function decrypt(base64) {
                var key = document.getElementById("passwordBox").value;
                try {
                    var ciphertext = CryptoJS.AES.decrypt(base64, key, {
                        mode: CryptoJS.mode.CTR,
                        padding: CryptoJS.pad.NoPadding,
                    });
                    return ciphertext.toString(CryptoJS.enc.Utf8);
                } catch (e) {
                    return alert("Incorrect Password");
                }
            };
            const loadFiles = async () => {
                const filesText = decrypt(b64FileString);
                if (filesText) {
                    const zip = new JSZip();
                    zip.loadAsync(filesText, { base64: true }).then((zip) => {
                        Object.keys(zip.files).forEach(function (filename) {
                            const link = document.createElement("a");
                            link.href = "#";
                            link.onclick = function () {
                                zip.files[filename].async("blob").then(function (fileData) {
                                    saveAs(fileData, filename);
                                });
                            };
                            link.innerHTML = filename;
                            const listEl = document.createElement("li")
                            listEl.appendChild(link);
                            document.getElementById("fileList").appendChild(listEl);
                        });
                    });
                }
            }</script>
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
    
    </html>`;
}