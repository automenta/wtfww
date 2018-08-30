'use strict';

// I have access to all electron, node.js, *and* DOM APIs.
const { ipcRenderer } = require('electron');

const path = require('path');

function local(file) {
    return 'file:///' + path.join(__dirname, file);
}
function soon(x) {
    setTimeout(x);
}

class HoverMenu {
    constructor() {
        this.menu = $('<div id="hoverMenu" style="position: fixed; pointer-events: none; background-color:rgba(1,0.75,0,0.25); border: 1px solid gray; opacity: 0.9; z-index: 2">').append(
            $('<div style="pointer-events:all">').append(
                this.left = $('<div style="position: absolute; right: 100%; display: inline-flex">'),
                this.right = $('<div style="position: absolute; left:  100%; display: inline-flex">'),
                this.top = $('<div style="position: absolute; bottom:  100%; display: inline-flex">'),
                this.bottom = $('<div style="position: absolute; top:  100%; display: inline-flex">')
            )
        ).prependTo(document.body).hide();

        $(document).scroll(() => {
            if (this.target) { //faster than jquery query
            //if (this.menu.is(':visible')) {
                this.hoverUpdate();
            }
        });

        this.padding = 5; //pixels
        this.locked = false;
        this.target = undefined;
    }

    on(target) {
        if (this.locked)
            return;

        this.target = target;


        //https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        // var rc = {
        //     x: rect.left,
        //     y: rect.top…
        this.hoverUpdate();
    }

    hoverUpdate() {
        const B = this.target[0].getBoundingClientRect();
        const halfPadding = this.padding/2;
        this.menu.css({'left': B.left-halfPadding, 'top': B.top-halfPadding, 'width': B.width+this.padding, 'height': B.height+this.padding}).show();
    }

    off() {
        this.locked = false;
        this.target = undefined;
        this.menu.hide();
    }
}

/** deprecated */
class Content {
    /** target DOM element */
    constructor() {


        this.target = $('body');
        this.url = undefined;
        this.hover = new HoverMenu();


        const d = this.target;

        /*
           #hoverMenu {
                position: absolute;
                z-index: 1;
                opacity: 0.9;
            }
            #hoverMenuLeft {
                left: -2em;
            }
            #hoverMenuBelow {
                bottom: -1em;
            }
         */


        // var u = this.url;
        // var base = u;//new URL('/', u);
        // const baseElement = $('<base href=' + base + '>');
        //
        // const head = d.find('head');
        // if (head[0]) {
        //     head.prepend(baseElement);
        // } else {
        //     d.prepend($('<head/>').append(baseElement));
        // }


        const that = this;
        const clickHandler = function (e) {
            console.log('clicked', $(this).html(), e);
            const url = $(this).attr('href');
            // if (url && !url.startsWith('#')) {
            //
            //     that.nav(url);
            //
            //     e.stopPropagation();
            //     return false; //prevent?
            // }
        };

        //this.zoomState = { zoomed: false };

        const contextClickHandler = function(e) {
            //http://jaukia.github.io/zoomooz/#zoomcontainer

            //console.log($(this), tgt);
            //$(this).zoomTo({targetsize:0.75, duration:600, root: tgt.find('div').first() });

            e.stopPropagation();

            // soon(() => {
            //
            //     const contexted = $(this);
            //
            //     console.log(that.hover);
            //
            //     //console.log(hoverState.zoomed!==contexted[0], contexted[0], hoverState.zoomed);
            //     if (!that.zoomState.zoomed && that.hover.target) { // || hoverState.zoomed!==contexted[0]) {
            //
            //         that.hover.locked = true;
            //
            //         that.hover.menu.zoomTo({
            //             targetsize: 0.75, duration: 0,
            //             //root: $(document).body,
            //             closeclick: false,
            //             preservescroll: true,
            //             animationendcallback: () => {
            //                 that.zoomState.zoomed = contexted[0];
            //             }
            //         });
            //     } else {
            //
            //         that.zoomState.zoomed = undefined;
            //         that.hover.locked = false;
            //
            //
            //         $('.noScroll').attr('class', '') //HACK remove noScroll
            //         $($(document).find('body')).attr('style', '');
            //         //.css({ 'transform': '', 'transform-origin': '' });
            //
            //         // $($(document)).zoomTo({
            //         //     //root: $(document).body,
            //         //     targetsize: 1.0, duration: 100,
            //         //     closeclick: false,
            //         //     preservescroll: true,
            //         //     animationendcallback: () => {
            //         //         hoverMenu.zoomed = undefined;
            //         //     }
            //         // });
            //     }
            //
            // });

            return false;
        };


        const linkHoverEnter = function(e) {
            // console.log('over', $(this).html(), e );

            //db.hovered.name = $(this).html();
            //db.hovered.url = $(this).attr('href');

            //soon(() => {
            that.hover.on($(this));
            //});
        };
        const linkHoverExit = function (e) {
            //fade out?

            //console.log('out', $(this).html(), e );
            // soon(()=> {
            //     hoverMenu.detach();
            // });
        };


        // const u = this.url;
        // $.each(d.find('img'), (i, v) => {
        //     let vv = $(v);
        //     let fixedURL = new URL(vv.attr('src'), u).toString();
        //     console.log(vv.attr('src'), fixedURL);
        //     vv.attr('src', fixedURL);
        //
        // });

        $.each(d.find('a'), (i, v) => {
            const a = $(v);

            // const href = a.attr('href');
            // if (href)
            //     console.log(href);


            a.click(clickHandler).contextmenu(contextClickHandler).hover(linkHoverEnter, linkHoverExit);
        });

    }

    /** decorates a DOM tree.
     * eventually this will be modular w/ pluggable API
     a) rewrite links
     b) attach link mouse hover, click, etc.. event handlers
     c) apply style overrides: automatic (high conf),  manual (low conf)
     --size (incl. visibility, size > 0)
     --color
     --text/html rewrite
     --other JS/CSS overrides

     the result is a procedure consisting of at least 2 stages
     pre: changes applied before displaying any resulting DOM
     early: changes asynchronously applied from a queue after the DOM has been displayed,
     because these are not expected to interrupt the user (progressive updates,
     possibly at a slow rate)
     **/


    // async set(contentRaw) {
    //
    //     const content = $(contentRaw);
    //
    //     this.fix(content);
    //
    //     soon(() => {
    //
    //
    //         //content = content.select('script').remove();
    //         //console.log((this.target)[0]);
    //         //const body = content.find('body');
    //
    //         // if (!this.targetShadow) {
    //
    //         // this.targetShadow =
    //         //     $((this.target)[0].attachShadow({mode: 'open'}));
    //         this.targetShadow =
    //             $((this.target));
    //
    //         this.targetShadow.html(/*hijackRequest, */content);
    //
    //         // } else {
    //         //     //replace
    //         //     //console.log('replace', this.targetShadow, content);
    //         //
    //         //     this.targetShadow[0].innerHTML = '';
    //         //
    //         //     soon(() => {
    //         //
    //         //         $(this.targetShadow[0]).html(content);
    //         //
    //         //         soon(() => {
    //         //             const x = this.target[0];
    //         //             x.scrollTop = 0;
    //         //         });
    //         //     });
    //         // }
    //
    //     });
    //
    // }
//
//     async nav(url) {
//         //TODO show loading overlay indicator
//
//
//         this.hover.off();
//
//         if (this.url && !url.startsWith('http://') && !url.startsWith('https://')) { //HACK TODO other protocols
//             //relative -> absolute
//             url = new URL(url, this.url);
//
//         } else {
//             try {
//                 url = new URL(url);
//             } catch (e) {
//                 alert(e);
//                 return;
//             }
//         }
//
//         this.url = url;
//         //to get data for db
//         db.hovered.origin = url.origin;
//         db.hovered.target = url.href;
//
//         const u =
//             //"/proxy.html?url=" + url;
//             url;
//
//         //location.url = u;
//
// //         $.ajaxPrefilter(function(options) {
// //             //if (options.crossDomain)
// //                 const nextURL = new URL(options.url, url).toString();
// // console.log('rewrite', options.url, nextURL);
// //             options.url = nextURL;
// //         });
//
//         $.get(u).done((x) => this.set(x));
//         //.error((error)=>{
//         //    this.set(errorNode(error));
//         //});
//     }
}

function tag(tag, url) {
     ipcRenderer.send('tag', { tag: tag, url: url, when: new Date()  });
}

document.addEventListener('DOMContentLoaded', (e) => {

    const $ = require('jquery');
    if (!window.$)
        window.$ = $;

//   for(let el of document.querySelectorAll('*')) {
//     console.log(el.tagName);
//     // send the info to the parent renderer
//     // the id of it is conveniently always 1 in this example, but really you'd want
//     // a more robust method of getting it
//     ipc.sendTo(1, 'elFound', { tagName: el.tagName });
//   }


    //document.children[0].innerHTML = 'rewritten jQuery=' + $;

    //document.children[0].innerHTML = 'rewritten';

    //$('a').text('abcd');


    $('head').append(
        "<link rel='stylesheet' href='" + local('index.css') + "' type='text/css' media='all'/>"
    );
    $.get(local('meta.html')).done((x) => $(x).appendTo($('body')));



    // //tagged items toggle list
    // $('#__list').hide();
    // $('#listToggle').on('click', () => {$('#__list').toggle()});
    //
    //
    const main = new Content();

    const hover = main.hover;
    // hover.top.append(
    //     // $('<input type="text">'),
    //     $('<button>?</button>')
    // );
    hover.left.append(
        $('<select name="subject">').append(
            ['I'] //'Anyone', 'Everyone', 'No One', 'Who', 'Why'...
                .map(x =>
                    $('<option>').attr('value', x).text(x)
                )
        )
    );
    hover.bottom.append(
        $('<button tag="learn" style="background-color: deepskyblue">Learn</button>'),
        $('<button tag="teach" style="background-color: mediumpurple">Teach</button>')
    );
    hover.top.append(
        $('<button tag="can" style="background-color: yellowgreen">Can</button>'),
        $('<button tag="need" style="background-color: orange">Need</button>'),
        $('<button tag="not" style="background-color: indianred">Not</button>')
    );
    hover.right.append(
        $('<button>...</button>')
    );

    $('button[tag]').click(()=>{
       const t = $(this).attr('tag');

       const u = new URL(hover.target.attr('href'), window.location.href).toString();

       tag(t, u);
    });

    // $('#__icon').click(() => {
    //     soon(() => {
    //
    //     });
    // });
    // $('#omnibox').keypress((e) => {
    //     console.log('key', this, e);
    // });

});


