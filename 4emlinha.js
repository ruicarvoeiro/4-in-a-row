var stage; // stage do jogo
var output; // mensagens de informacao
//var path = "images";
var muted = false;

var estadoDoJogo = {
    emCurso: true,
    tempoDeJogo: 0,
    nextPlayer: pecaPlayer1,
    outroPlayer: pecaPlayer2,
    offsetX: 0,
    offsetY: 0
};

// sons de jogo
var sounds = {
        somDeFundo: "",
        peca: "",
        jogador1_fez_3: "",
        jogador2_fez_3: "",
        ganhou: "",
    }
    //mapa:
var map = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];
// informacao da peca de cada jogador

var ROWS = map.length;
var COLUMNS = map[0].length;

//var offsetX;
//var offsetY;
/*
var pecaPlayer1 = {
    peca: null,
    playerName: null,
    width: 90,
    height: 90,
    pecaRow: null,
    pecaColumn: 0,
    rowColor: null,
    columnColor: null
}

var pecaPlayer2 = {
    peca: null,
    playerName: null,
    width: 90,
    height: 90,
    pecaRow: null,
    pecaColumn: 0,
    rowColor: null,
    columnColor: null
}

*/

var x = 160;
var y = 160;

function initGame() {
    stage = document.getElementById("stage");
    output = document.querySelector("#output");
    // definir sons
    sounds.somDeFundo = document.querySelector("#somDeFundo");
    sounds.peca = document.querySelector("#peca")
    sounds.jogador1_fez_3 = document.querySelector("#jogador1");
    sounds.jogador2_fez_3 = document.querySelector("#jogador2");
    sounds.ganhou = document.querySelector("#ganhou")

    window.addEventListener("mousemove", gameCicle, false);
    window.addEventListener("mousedown", changePeca, false);
    /*
    offsetX = e.clientX;
    offsetY = e.clientY;
    */
    gameCicle();
}

function changePeca() {
    var player = estadoDoJogo.nextPlayer;
    estadoDoJogo.nextPlayer = estadoDoJogo.outroPlayer;
    estadoDoJogo.outroPlayer = player;

}

function gameCicle(e) {
    pecaPlayer1.peca.style.backgroundPositionY = pecaPlayer1.rowColor + "px";
    pecaPlayer2.peca.style.backgroundPositionY = pecaPlayer2.rowColor + "px";
    estadoDoJogo.nextPlayer.peca.className = "peca";
    estadoDoJogo.outroPlayer.peca.className = "escondido";

    if (e) {
        /*pecaPlayer1.peca.style.top = e.clientY + "px";
        pecaPlayer1.peca.style.left = e.clientX + "px";*/
        var stagePos = stage.getBoundingClientRect();
        estadoDoJogo.nextPlayer.peca.style.top = (e.pageY - stagePos.top - 45) + "px";
        estadoDoJogo.nextPlayer.peca.style.left = (e.pageX - stagePos.left - 45) + "px";
    } else {
        pecaPlayer1.peca.style.top = 0 + "px";
        pecaPlayer1.peca.style.left = 360 + "px";
    }

}

function localizarPecas() {
    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLUMNS; col++) {
            if (map[row][col] === pecaPlayer1.color) {
                peca.pecaRow = row;
                peca.pecaColumn = col;
            }
            if (map[row][col] === pecaPlayer2.color) {
                peca.pecaRow = row;
                peca.pecaColumn = col;
            }
        }
    }
}

function render() {
    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLUMNS; col++) {
            var aPeca = document.createElement("img");
            aPeca.setAttribute("class", "aPeca");
            stage.appendChild(aPeca);
            switch (map[row][col]) {
                case pecaPlayer1:
                    aPeca.src = pecaPlayer1.color;
                    break;
                case pecaPlayer2:
                    aPeca.src = pecaPlayer2.color;
                    break;
            }
        }
    }
}

function moverPeca(player) {
    localizarPecas();
    render();
}

function endGame() {
    sounds.ganhou.play();
}

//----------------------------------------------------------------------------
// descodifica os valores em PX do estilo e devolve um float  
function getValue(cssValue) {
    var number = cssValue.split("px")[0].trim();
    return parseFloat(number);
}