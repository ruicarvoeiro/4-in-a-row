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
        zonaJogadas[i].addEventListener("mouseover", glow, false);
        zonaJogadas[i].addEventListener("mouseleave", noGlow, false);
        zonaJogadas[i].style.left = 33 + (i * 90) + "px"; //Porque 33?
    }

    estadoDoJogo.nextPlayer.peca.style.backgroundPositionY = estadoDoJogo.nextPlayer.rowColor + "px";
    estadoDoJogo.nextPlayer.peca.style.cursor = 'none';
    estadoDoJogo.nextPlayer.peca.className = "peca";

    titulo();
    render();
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
    for (coluna = 0; coluna < zonaJogadas.length; coluna++)
        if (e.currentTarget == zonaJogadas[coluna]) {
            linha = pecaJogada(coluna);
            break;
        }

    window.removeEventListener("mousemove", movimentoRato, false);

    var stagePos = stage.getBoundingClientRect();
    //estadoDoJogo.nextPlayer.peca.style.left = coluna * 90 + stagePos.left + "px";

    estadoDoJogo.nextPlayer.peca.className = "peca";
    posicao = 0;
    intervalo = setInterval(frames, 5, linha);
}

function frames(y) {
    if (posicao == 90 * (y + 1)) {
        clearInterval(intervalo);
        window.addEventListener("mousemove", movimentoRato, false);
        render();
        trocaPlayer();
        estadoDoJogo.nextPlayer.peca.className = "escondido";
    } else {
        posicao++;
        estadoDoJogo.nextPlayer.peca.style.top = posicao + "px";
    }
}

function pecaJogada(coluna) {
    var linha = map.length - 1;
    for (var i = map.length - 1; i >= 0; i--)
        if (map[i][coluna] == 0) {
            linha = i;
            break;
        }
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
    e = e ? e : { clientX: 100, clientY: 100 };
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

    estadoDoJogo.nextPlayer.peca.className = "peca";
    estadoDoJogo.nextPlayer.peca.style.backgroundPositionY = estadoDoJogo.nextPlayer.rowColor + "px";
    estadoDoJogo.nextPlayer.peca.style.cursor = 'none';

    estadoDoJogo.nextPlayer.peca.style.left = mouseX + "px";
    estadoDoJogo.nextPlayer.peca.style.top = mouseY + "px";


    //if (e) {
    /*} else {
        estadoDoJogo.nextPlayer.peca.style.top = "0px";
        estadoDoJogo.nextPlayer.peca.style.left = "200px";
    }*/

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

function glow(e) {
    estadoDoJogo.nextPlayer.peca.className = "peca podeJogar";
}

function noGlow(e) {
    estadoDoJogo.nextPlayer.peca.className = "peca";
}