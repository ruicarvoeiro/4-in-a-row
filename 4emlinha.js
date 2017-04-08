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
    [0, 0, 0, 0, 0, 0, 0], //linhas
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];
// informacao da peca de cada jogador

var ROWS = map.length;
var COLUMNS = map[0].length;
//var x = 160;
//var y = 160;

var zonaJogadas;

var intervalo; //timer para as animações

var posicao = 0; //posicao da peca durante as animacoes

function initGame() {
    estadoDoJogo.nextPlayer.peca.className = "peca";
    estadoDoJogo.outroPlayer.peca.className = "escondido";

    stage = document.getElementById("stage");
    output = document.querySelector("#output");

    // definir sons
    sounds.somDeFundo = document.getElementById("somDeFundo");
    sounds.peca = document.querySelector("#peca")
    sounds.jogador1_fez_3 = document.querySelector("#jogador1");
    sounds.jogador2_fez_3 = document.querySelector("#jogador2");
    sounds.ganhou = document.querySelector("#ganhou");
    sounds.mute = document.querySelector("#muteOpt");

    window.addEventListener("mousemove", movimentoRato, false);
    pecaPlayer1.peca.addEventListener("mousedown", escondePeca, false);
    pecaPlayer2.peca.addEventListener("mousedown", escondePeca, false);

    sounds.mute.addEventListener("click", mutedSound, false);

    zonaJogadas = document.getElementsByClassName("zonaJogavel");
    for (var i = 0; i < zonaJogadas.length; i++) {
        zonaJogadas[i].addEventListener("mouseup", zonaJogavel, false);
        //zonaJogadas[i].addEventListener("hover", zonaJogavel, false);
        zonaJogadas[i].style.left = 33 + (i * 90) + "px"; //Porque 33?
    }
    render();
    /*
        offsetX = e.clientX;
        offsetY = e.clientY;
        */
}


function render() {
    while (frame.hasChildNodes()) {
        frame.removeChild(frame.firstChild);
    }
    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLUMNS; col++) {
            var cell = document.createElement("div");
            cell.setAttribute("class", "pecaTabuleiro oculto");
            frame.appendChild(cell);
            switch (map[row][col]) {
                case pecaPlayer1.valor:
                    cell.style.backgroundPositionY = pecaPlayer1.rowColor + "px";
                    cell.className = "pecaTabuleiro";
                    break;
                case pecaPlayer2.valor:
                    cell.style.backgroundPositionY = pecaPlayer2.rowColor + "px";
                    cell.className = "pecaTabuleiro";
                    break;
            }
        }
    }
}

function zonaJogavel(e) {
    var linha, coluna;
    for (i = 0; i < zonaJogadas.length; i++)
        if (e.currentTarget == zonaJogadas[i]) {
            linha = pecaJogada(i);
            break;
        }

    window.removeEventListener("mousemove", movimentoRato, false);
    //estadoDoJogo.nextPlayer.peca.style.left = i * 90 + frame.style.left + "px";
    estadoDoJogo.nextPlayer.peca.className = "peca";
    posicao = 0;
    intervalo = setInterval(frames, 5, linha);

    //frames(y);
    /*trocaPlayer();
    estadoDoJogo.nextPlayer.peca.className = "peca";*/
}

function frames(y) {
    /*//var posicao = 0;
    while (posicao < 90 * (y - 1)) {
        var intervalo = setInterval(function() {
            posicao++;
            estadoDoJogo.peca.style.top = posicao + "px";
        }, 5);
        clearInterval(intervalo);
        //);
        //clearInterval(intervalo);
    }
    //window.removeEventListener("mousemove", movimentoRato, false);
    */
    if (posicao == 90 * (y - 1)) {
        window.addEventListener("mousemove", movimentoRato, false);
        render();
        trocaPlayer();
        clearInterval(intervalo);
    } else {
        posicao++;
        pecaPlayer1.peca.style.top = posicao + "px";
        pecaPlayer2.peca.style.top = posicao + "px";
    }

}

function pecaJogada(coluna) {
    var linha = map.length - 1;
    for (var i = 0; i < map.length; i++)
        if (map[i][coluna] != 0)
            linha = i - 1;
    map[linha][coluna] = estadoDoJogo.nextPlayer.valor;
    return linha;
}

function trocaPlayer() {
    var player = estadoDoJogo.nextPlayer;
    estadoDoJogo.nextPlayer = estadoDoJogo.outroPlayer;
    estadoDoJogo.outroPlayer = player;
    estadoDoJogo.nextPlayer.peca.className = "peca";
    estadoDoJogo.outroPlayer.peca.className = "escondido";
    titulo();
}

function movimentoRato(e) {
    titulo();
    var stagePos = stage.getBoundingClientRect();
    var mouseX = parseInt(e.clientX) +
        parseInt(jogo.scrollLeft) +
        parseInt(window.pageXOffset) -
        parseInt(jogo.offsetLeft) - 45 +
        stagePos.left;

    var mouseY = parseInt(e.clientY) +
        parseInt(jogo.scrollTop) -
        parseInt(jogo.offsetTop) +
        stagePos.top - 45 +
        parseInt(window.pageYOffset);


    pecaPlayer1.peca.style.backgroundPositionY = pecaPlayer1.rowColor + "px";
    pecaPlayer2.peca.style.backgroundPositionY = pecaPlayer2.rowColor + "px";
    pecaPlayer1.peca.style.cursor = 'none';
    pecaPlayer2.peca.style.cursor = 'none';
    if (e) {
        var stagePos = stage.getBoundingClientRect();
        /*estadoDoJogo.nextPlayer.peca.style.top = (e.pageY - stagePos.top - 45 + window.pageYOffset) + "px";
        estadoDoJogo.nextPlayer.peca.style.left = (e.pageX - stagePos.left - 45 + window.pageXOffset) + "px";
        estadoDoJogo.outroPlayer.peca.style.top = (e.pageY - stagePos.top - 45 + window.pageYOffset) + "px";
        estadoDoJogo.outroPlayer.peca.style.left = (e.pageX - stagePos.left - 45 + window.pageXOffset) + "px";*/
        estadoDoJogo.nextPlayer.peca.style.left = mouseX + "px";
        estadoDoJogo.nextPlayer.peca.style.top = mouseY + "px";
    } else {
        estadoDoJogo.nextPlayer.peca.style.top = "0px";
        estadoDoJogo.nextPlayer.peca.style.left = "200px";
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

function mutedSound() {
    sounds.mute.volume = 0;
}

function escondePeca() {
    estadoDoJogo.nextPlayer.peca.className = "escondido";
}

function titulo() {
    title.innerHTML = estadoDoJogo.nextPlayer == pecaPlayer1 ?
        "<u>" + pecaPlayer1.playerName + " </u> VS " + pecaPlayer2.playerName :
        pecaPlayer1.playerName + " VS <u>" + pecaPlayer2.playerName + " </u> ";
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