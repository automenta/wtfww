// I have access to all electron, node.js, *and* DOM APIs.
const { ipcRenderer: ipc } = require('electron');
ipc.on('elFound', (event, props) => {
    console.log(`Message received from webview ${JSON.stringify(props)}`);
});

const webview = document.getElementById('webview');
const btn = document.getElementById('devtools');

btn.addEventListener('click', () => webview.openDevTools());

