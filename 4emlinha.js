var stage; // stage do jogo
var output; // mensagens de informacao

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
    mute: null
};

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
var x = 160;
var y = 160;

var novaDiv;
var divJogadas;

var intervalo;
var posicao = 0;

function initGame() {
    estadoDoJogo.nextPlayer.peca.className = "peca";
    estadoDoJogo.outroPlayer.peca.className = "escondido";

    stage = document.getElementById("stage");
    output = document.querySelector("#output");
    // definir sons
    sounds.somDeFundo = document.querySelector("#somDeFundo");
    sounds.peca = document.querySelector("#peca")
    sounds.jogador1_fez_3 = document.querySelector("#jogador1");
    sounds.jogador2_fez_3 = document.querySelector("#jogador2");
    sounds.ganhou = document.querySelector("#ganhou");
    sounds.mute = document.querySelector("#muteOpt");

    window.addEventListener("mousemove", gameCicle, false);
    pecaPlayer1.peca.addEventListener("mousedown", escondePeca, false);
    pecaPlayer2.peca.addEventListener("mousedown", escondePeca, false);

    window.addEventListener("onclick", mutedSound, false);

    divJogadas = document.getElementsByClassName("zonaJogavel");
    for (var i = 0; i < divJogadas.length; i++) {
        divJogadas[i].addEventListener("mouseup", zonaJogavel, false);
        divJogadas[i].style.left = 33 + (i * 90) + "px";
    }
    novaDiv = document.querySelector("#contentor");
    render();
    /*
        offsetX = e.clientX;
        offsetY = e.clientY;
        */
    //title.innerHtml = pecaPlayer1.playerName + " VS " + pecaPlayer2.playerName;
    //Nao funciona
    gameCicle();
}

/*function render() {
    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLUMNS; col++) {
            var armazenarPeca = new Image();
            divJogadas.appendChild(armazenarPeca);
            switch (map[row][col]) {
                case pecaPlayer1.valor:
                    armazenarPeca = pecaPlayer1.peca;
                    break;
                case pecaPlayer2.valor:
                    armazenarPeca = pecaPlayer2.peca;
                    break;
            }
            armazenarPeca.style.top = row * pecaPlayer1.width + "px";
            armazenarPeca.style.left = col * pecaPlayer1.height + "px";
            armazenarPeca.style.top = row * pecaPlayer2.width + "px";
            armazenarPeca.style.left = col * pecaPlayer2.height + "px";
        }
    }
}*/

function render() {
    while (frame.hasChildNodes()) {
        frame.removeChild(frame.firstChild);
    }
    //ROWS = 6;
    //COLUMNS = 7;

    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLUMNS; col++) {
            var cell = document.createElement("div");
            cell.setAttribute("class", "pecaTabuleiro");
            frame.appendChild(cell);
            switch (map[row][col]) {
                case 1:
                    cell = pecaPlayer1.peca;
                    break;
                case 2:
                    cell = pecaPlayer2.peca;
                    break;
            }
        }
    }
}



function mutedSound() {
    sounds.mute.volume = 0;
}

function escondePeca() {
    estadoDoJogo.nextPlayer.peca.className = "escondido";
}

function zonaJogavel(e) {
    pecasJogadas();
    window.removeEventListener("mousemove", gameCicle, false);
    if (e.currentTarget.className == "zonaJogavel") {
        intervalo = setInterval(frames, 5);

    }
    estadoDoJogo.nextPlayer.peca.className = "peca";
}

function frames() {
    if (posicao == 455 /*limitePecas()*/ ) {
        clearInterval(intervalo);
        window.addEventListener("mousemove", gameCicle, false);
        pecasJogadas();
        changePeca();
    } else {
        posicao++;
        pecaPlayer1.peca.style.top = posicao + "px";
        pecaPlayer2.peca.style.top = posicao + "px";
    }
}

function pecasJogadas() {
    switch (divJogadas) {
        case pecaPlayer1.color:
            map[pecaPlayer1.rowColor][pecaPlayer1.rowColor] = pecaPlayer1.state;
            break;
        case pecaPlayer2.color:
            map[pecaPlayer2.rowColor][pecaPlayer2.rowColor] = pecaPlayer2.state;
            break;
    }
    render();
}

function changePeca() {
    var player = estadoDoJogo.nextPlayer;
    estadoDoJogo.nextPlayer = estadoDoJogo.outroPlayer;
    estadoDoJogo.outroPlayer = player;
    estadoDoJogo.nextPlayer.peca.className = "peca";
    estadoDoJogo.outroPlayer.peca.className = "escondido";

}

function gameCicle(e) {
    pecaPlayer1.peca.style.backgroundPositionY = pecaPlayer1.rowColor + "px";
    pecaPlayer2.peca.style.backgroundPositionY = pecaPlayer2.rowColor + "px";
    pecaPlayer1.peca.style.cursor = 'none';
    pecaPlayer2.peca.style.cursor = 'none';
    if (e) {
        var stagePos = stage.getBoundingClientRect();
        estadoDoJogo.nextPlayer.peca.style.top = (e.pageY - stagePos.top - 45) + "px";
        estadoDoJogo.nextPlayer.peca.style.left = (e.pageX - stagePos.left - 45) + "px";
        estadoDoJogo.outroPlayer.peca.style.top = (e.pageY - stagePos.top - 45) + "px";
        estadoDoJogo.outroPlayer.peca.style.left = (e.pageX - stagePos.left - 45) + "px";
    } else {
        pecaPlayer1.peca.style.top = 0 + "px";
        pecaPlayer1.peca.style.left = 360 + "px";
        pecaPlayer2.peca.style.top = 0 + "px";
        pecaPlayer2.peca.style.left = 360 + "px";
    }

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


/*
// cálculo exacto das coordenadas do rato na página
function mover(e){
   var bordoContentor=10;
   var mouseX= parseInt(e.clientX)+                // coordenada X do rato
              parseInt(contentor.scrollLeft)+     // scrollX do contentor
              parseInt(window.pageXOffset)-       // scrollX da janela
              parseInt(contentor.offsetLeft)-     // deslocamento do contentor
              bordoContentor;                     // bordo do Contentor

  var mouseY= parseInt(e.clientY)+               // coordenada Y do rato
              parseInt(contentot.scrollTop)-     // scrollY do contentor
              parseInt(contentor.offsetTop)+     // deslocamento Y do contentor
              parseInt(window.pageYOffset)-      // scrollY da janela
              bordoContentor;                    // bordo do contentor

}

// contentor pode ser uma DIV
// se o bordo tem 10px, tem que se somar os 10px da esquerda ou topo
// se houver margens e paddings definidos têm que ser contabilizados também
*/