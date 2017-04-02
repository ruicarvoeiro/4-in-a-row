window.addEventListener("DOMContentLoaded", init, false);
var listaDePecasPlayer1;
var listaDePecasPlayer2;

var nomeP1;
var nomeP2;

var pecaP1;
var pecaP2;

var pc;
var jogador;

var pecaPlayer1 = {
    peca: null,
    playerName: null,
    width: 90,
    height: 90,
    pecaRow: null,
    pecaColumn: 0,
    rowColor: null,
    columnColor: null
};

var pecaPlayer2 = {
    peca: null,
    playerName: null,
    width: 90,
    height: 90,
    pecaRow: null,
    pecaColumn: 0,
    rowColor: null,
    columnColor: null
};

var jogarComPC;

var botaoStart;

var zonaJogo;
var zonaInicioJogo;
var title;


function init() {
    listaDePecasPlayer1 = addElementos(document.getElementById("coresp1").childNodes);
    listaDePecasPlayer2 = addElementos(document.getElementById("coresp2").childNodes);
    zonaJogo = document.getElementById("jogo");
    zonaInicioJogo = document.getElementById("inicio");
    title = document.getElementById("title");

    botaoStart = document.getElementById("start");
    botaoStart.addEventListener("click", comecaJogo, false);

    jogarComPC = document.getElementById("checkbox");
    jogarComPC.addEventListener("change", jogoComPC, false);

    jogador = document.getElementById("jogador");
    pc = document.getElementById("pc");

    nomeP1 = document.getElementById("name_player1");
    nomeP2 = document.getElementById("name_player2");

    for (var i = 0; i < listaDePecasPlayer1.length; i++) {
        listaDePecasPlayer1[i].style.backgroundPositionX = 0 + "px";
        listaDePecasPlayer2[i].style.backgroundPositionX = 0 + "px";
        listaDePecasPlayer1[i].style.backgroundPositionY = (i * 70) + "px";
        listaDePecasPlayer2[i].style.backgroundPositionY = (i * 70) + "px";

    }
    pecaPlayer1.peca = document.getElementById("pecaP1");
    pecaPlayer2.peca = document.getElementById("pecaP2");
}


function addElementos(arrayTotal) {
    var array = [];
    for (var i = 0; i < arrayTotal.length; i++) {
        var elemento = arrayTotal[i];
        if (elemento.className == "img") {
            var peca = elemento;
            peca.addEventListener("mousedown", selecaoCor, false);
            array.push(peca);
        }
    }
    return array;
}


function selecaoCor(e) {
    if (e.currentTarget.className == "naoPodeEscolher")
        return null;

    var pos = getPos(e.currentTarget);
    for (var i = 0; i < listaDePecasPlayer1.length; i++) {
        var pecaPlayerAtual = e.currentTarget.parentNode.id == "coresp1" ? listaDePecasPlayer1[i] : listaDePecasPlayer2[i];
        var peca2 = e.currentTarget.parentNode.id == "coresp1" ? listaDePecasPlayer2[i] : listaDePecasPlayer1[i];
        if (pecaPlayerAtual.className != "naoPodeEscolher")
            pecaPlayerAtual.className = "img";
        if (peca2.className != "imagemEscolhida")
            peca2.className = "img";
        if (getPos(peca2) == pos)
            peca2.className = "naoPodeEscolher";

    }
    e.currentTarget.className = "imagemEscolhida";

    getPecasByPlayer();
}

function getPos(e) {
    return Number(e.attributes.style.value.match(/\d+(?=px;)/)[0]);
}

function jogoComPC() {
    jogador.className = jogarComPC.checked ? "newPlayer escondido" : "newPlayer visivel";
    pc.className = jogarComPC.checked ? "newPlayer visivel" : "newPlayer escondido";

    for (var i = 0; i < listaDePecasPlayer2.length; i++) {
        if (listaDePecasPlayer2[i].className == "imagemEscolhida")
            listaDePecasPlayer2[i].className = "img";
        if (listaDePecasPlayer1[i].className == "naoPodeEscolher")
            listaDePecasPlayer1[i].className = "img";
    }
}


function getPecasByPlayer() {
    for (var i = 0; i < listaDePecasPlayer1.length; i++) {
        if (listaDePecasPlayer1[i].className == "imagemEscolhida")
            pecaPlayer1.rowColor = getPos(listaDePecasPlayer1[i]) + (i) * 20;
        if (listaDePecasPlayer2[i].className == "imagemEscolhida")
            pecaPlayer2.rowColor = getPos(listaDePecasPlayer2[i]) + (i) * 20;
    }
}

function comecaJogo() {
    zonaJogo.className = "visivel";
    zonaInicioJogo.className = "escondido";
    title.className = "escondido";

    pecaPlayer1.playerName = nomeP1.value;
    pecaPlayer2.playerName = nomeP2.value;
    getPecasByPlayer();
    checkValues();
    getPecasByPlayer();
    initGame();
}

function checkValues() {
    if (nomeP1.value == "")
        pecaPlayer1.playerName = "Player 1";
    if (nomeP2.value == "")
        pecaPlayer2.playerName = "Player 2";

    if (pecaPlayer1.rowColor == null) {
        for (var i = 0; i < listaDePecasPlayer2.length; i++) {
            if (listaDePecasPlayer2[i].className != "imagemEscolhida") {
                pecaPlayer1.rowColor = i * 90;
                listaDePecasPlayer1[i].className = "imagemEscolhida";
                listaDePecasPlayer2[i].className = "naoPodeEscolher";
            }
        }
    }

    if (pecaPlayer2.rowColor == null) {
        for (var i = 0; i < listaDePecasPlayer1.length; i++) {
            if (listaDePecasPlayer1[i].className != "imagemEscolhida") {
                pecaPlayer2.rowColor = i * 90;
                listaDePecasPlayer2[i].className = "imagemEscolhida";
                listaDePecasPlayer1[i].className = "naoPodeEscolher";
            }
        }
    }
}