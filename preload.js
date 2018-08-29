// I have access to all electron, node.js, *and* DOM APIs.
const { ipcRenderer: ipc } = require('electron');
const path = require('path');

function local(file) {
    return 'file:///' + path.join(__dirname, file);
}

document.addEventListener('DOMContentLoaded', function (event) {
//   for(let el of document.querySelectorAll('*')) {
//     console.log(el.tagName);
//     // send the info to the parent renderer
//     // the id of it is conveniently always 1 in this example, but really you'd want
//     // a more robust method of getting it
//     ipc.sendTo(1, 'elFound', { tagName: el.tagName });
//   }

    const $ = require('jquery');
    //document.children[0].innerHTML = 'rewritten jQuery=' + $;

    //document.children[0].innerHTML = 'rewritten';

    //$('a').text('abcd');


    $('head').append(
        "<link rel='stylesheet' href='" + local('index.css') + "' type='text/css' media='all'/>"
    );
    $.get(local('meta.html')).done((x) => $(x).appendTo($('body')));

});
