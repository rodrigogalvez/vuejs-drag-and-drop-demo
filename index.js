"use strict";

let qbcolor = function () {
    let colors = [
        "black",
        "blue",
        "green",
        "cyan",
        "red",
        "magenta",
        "yellow",
        "white",
        "gray",
        "lightblue",
        "lightgreen",
        "lightcyan",
        "lightcoral",
        "lightpink",
        "lightyellow",
        "whitesmoke"
    ]
    let methods = {
        qbcolor(index) {
            return colors[index];
        },
        randomcolor() {
            return colors[Math.trunc(Math.random() * 8)];
        },
        randomlight() {
            return colors[Math.trunc(Math.random() * 7 + 9)];
        }
    }
    return methods;
}();

var newId = function () {
    var crypto = window.crypto || window.msCrypto || undefined;

    function _s4( number ) {
        var hexadecimalResult = number.toString( 16 );
        return "0".repeat( 4 - hexadecimalResult.length ) + hexadecimalResult;
    };

    if ( crypto !== undefined && 'getRandomValues' in crypto )
        return function () {
            var buffer = new window.Uint16Array( 8 );
            crypto.getRandomValues( buffer );
            return _s4( buffer[ 0 ] ) + _s4( buffer[ 1 ] ) + '-' +
                _s4( buffer[ 2 ] ) + '-' +
                _s4( buffer[ 3 ] & 0x0777 | 0x4000 ) + '-' +
                _s4( buffer[ 4 ] & 0x3fff | 0x8000 ) + '-' +
                _s4( buffer[ 5 ] ) + _s4( buffer[ 6 ] ) + _s4( buffer[ 7 ] );
        };
    else
        return function () {
            var currentDateMilliseconds = new Date().getTime();
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( currentChar ) {
                var randomChar = ( currentDateMilliseconds + Math.random() * 16 ) % 16 | 0;
                currentDateMilliseconds = Math.floor( currentDateMilliseconds / 16 );
                return ( currentChar === 'x' ? randomChar : ( randomChar & 0x3 | 0x8 ) ).toString( 16 );
            } );
        };
}();

class PostIt {
    constructor(text) {
        this.text = text;
        this.id = newId();
        this.color = qbcolor.randomlight();
        this.rotation = Math.random()*4-2; 
    }
    get style() {
        return {backgroundColor: this.color, transform: `rotate(${this.rotation}deg)`};
    }
}

class CorkBoardSection {
    constructor(title, list) {
        this.id = newId();
        this.title = title;
        this.content = list || [];
    }
}

let app = new Vue({
    el: "#app",
    data: {
        boards: [
            new CorkBoardSection("Pending",
            [
                new PostIt("Lunita"),
                new PostIt("Benyi"),
                new PostIt("Rocco"),
                new PostIt("Maxi"),
                new PostIt("Blanquita"),
                new PostIt("CATtrina"),
                new PostIt("Erika"),
                new PostIt("Candy"),
                new PostIt("Stephanie"),
                new PostIt("Harry")
            ]),
            new CorkBoardSection("Doing"),
            new CorkBoardSection("Done")
        ]
    },
    methods: {
        startDrag(event, sourceListId, sourceItemId) {
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('sourceItemId', sourceItemId);
            event.dataTransfer.setData('sourceListId', sourceListId);
        },
        dropOnList(event, destinationListId) {
            let sourceItemId = event.dataTransfer.getData('sourceItemId');
            let sourceListId = event.dataTransfer.getData('sourceListId');
            let sourceList = this.boards.find((board) => board.id == sourceListId);
            let destinationList = this.boards.find((board) => board.id == destinationListId);
            if (sourceList && destinationList) {
                let index = sourceList.content.findIndex((item) => item.id == sourceItemId);
                if (index >= 0) {
                    destinationList.content.push(sourceList.content.splice(index, 1)[0]);
                }
            }
        },
        dropOnElement(event, destinationListId, destinationItemId) {
            event.stopPropagation();
            let sourceItemId = event.dataTransfer.getData('sourceItemId');
            let sourceListId = event.dataTransfer.getData('sourceListId');
            let sourceList = this.boards.find((board) => board.id == sourceListId);
            let destinationList = this.boards.find((board) => board.id == destinationListId);
            if (sourceList && destinationList) {
                let sourceIndex = sourceList.content.findIndex((item) => item.id == sourceItemId);
                let destinationIndex = destinationList.content.findIndex((item) => item.id == destinationItemId);
                if (destinationIndex >= 0 && sourceIndex >= 0) {
                    destinationList.content.splice(destinationIndex, 0, sourceList.content.splice(sourceIndex, 1)[0]);
                }
            }
        }
    }
})