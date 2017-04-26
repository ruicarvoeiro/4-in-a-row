var jogoComPC;
var stage; // stage do jogo
var output; // mensagens de informacao

var info4EmLinha = {
    player: null,
    pecas: []
};
var player3EmLinha;

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
    ganhou: ""
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
    jogoComPC = jogarComPC.checked;
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

    if (!jogoComPC)
        pecaPlayer2.peca.addEventListener("mousedown", escondePeca, false);

    sounds.mute.addEventListener("click", mutedSound, false);

    zonaJogadas = document.getElementsByClassName("zonaJogavel");
    for (var i = 0; i < zonaJogadas.length; i++) {
        zonaJogadas[i].addEventListener("mouseup", zonaJogavel, false);
        zonaJogadas[i].style.left = 33 + (i * 90) + "px"; //Porque 33?
    }

    estadoDoJogo.nextPlayer.peca.style.backgroundPositionY = estadoDoJogo.nextPlayer.rowColor + "px";
    estadoDoJogo.nextPlayer.peca.style.cursor = 'none';
    estadoDoJogo.nextPlayer.peca.className = "peca";
    if (jogoComPC)
        startAi();
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

    if (fizeram4EmLinha(map)) {
        intervalo = setInterval(endGame, 5);
        alert("4 em linha");
        endGame();
        //title.innerHTML = "Fim de Jogo <u>" + x.player.playerName + "</u> ganhou!";
        window.removeEventListener("mousemove", movimentoRato, false);
        for (var i = 0; i < zonaJogadas.length; i++)
            zonaJogadas[i].removeEventListener("mouseup", zonaJogavel, false);
    } else if (fizeram3EmLinha(map)) {
        if (estadoDoJogo.nextPlayer == pecaPlayer1) {
            alert("P1 do 3");
            sounds.play.jogador1_fez_3.play();
        } else {
            alert("P2 do 3");
            sounds.play.jogador2_fez_3.play();
        }
        alert("3 em linha!");
    }

}

function fizeram4EmLinha(map) {
    return horizontal4EmLinha(map) || vertical4EmLinha(map) || diagonal4EmLinha(map);
}

function fizeram3EmLinha(map) {
    return horizontal3EmLinha(map) || vertical3EmLinha(map) || diagonal3EmLinha(map);
}



function count(array, valor) {
    var contador = 0;
    for (var i = 0; i < array.length; i++)
        if (array[i] == valor)
            contador++;
    return contador;
}

function vertical4EmLinha(map) {
    for (var i = 0; i < ROWS - 3; i++)
        for (var j = 0; j < COLUMNS; j++)
            if (map[i][j] != 0 &&
                map[i][j] == map[i + 1][j] &&
                map[i][j] == map[i + 2][j] &&
                map[i][j] == map[i + 3][j]) {
                info4EmLinha = {
                    pecas: [map[i][j], map[i + 1][j], map[i + 2][j], map[i + 3][j]],
                    player: map[i][j]
                };
                return true;
            }

    return false;
}

function horizontal4EmLinha(map) {
    for (var i = 0; i < ROWS; i++)
        for (var j = 0; j < COLUMNS - 3; j++)
            if (map[i][j] != 0 &&
                map[i][j] == map[i][j + 1] &&
                map[i][j] == map[i][j + 2] &&
                map[i][j] == map[i][j + 3]) {
                info4EmLinha = {
                    pecas: [map[i][j], map[i][j + 1], map[i][j + 2], map[i][j + 3]],
                    player: map[i][j]
                };
                return true;
            }

    return false;
}

function diagonal4EmLinha(map) {
    for (var i = 3; i < ROWS; i++)
        for (var j = 0; j < COLUMNS - 3; j++)
            if (map[i][j] != 0 &&
                map[i][j] == map[i - 1][j + 1] &&
                map[i][j] == map[i - 2][j + 2] &&
                map[i][j] == map[i - 3][j + 3]) {
                info4EmLinha = {
                    pecas: [map[i][j], map[i][j + 1], map[i][j + 2], map[i][j + 3]],
                    player: map[i][j]
                };
                return true;
            }


    for (var i = 0; i < ROWS - 3; i++)
        for (var j = 0; j < COLUMNS - 3; j++)
            if (map[i][j] != 0 &&
                map[i][j] == map[i + 1][j + 1] &&
                map[i][j] == map[i + 2][j + 2] &&
                map[i][j] == map[i + 3][j + 3]) {
                info4EmLinha = {
                    pecas: [map[i][j], map[i + 1][j + 1], map[i + 2][j + 2], map[i + 3][j + 3]],
                    player: map[i][j]
                };
                return true;
            }
}



for (var i = 0; i < COLUMNS - 3; i++) {
    for (var j = 0; j < ROWS - 3; j++)
        if (map[j][i] != 0 &&
            map[j][i] == map[j + 1][i + 1] &&
            map[j][i] == map[j + 2][i + 2] &&
            map[j][i] == map[j + 3][i + 3]) {
            info4EmLinha = {
                pecas: [map[i][j], map[j + 1][i + 1], map[j + 2][i + 2], map[j + 3][i + 3]],
                player: map[i][j]
            };
            return true;
        }

    for (var k = 3; k < ROWS; k++)
        if (map[k][i] != 0 &&
            map[k][i] == map[k - 1][i + 1] &&
            map[k][i] == map[k - 2][i + 2] &&
            map[k][i] == map[k - 3][i + 3]) {
            info4EmLinha = {
                pecas: [map[i][j], map[k - 1][i + 1], map[k - 2][i + 2], map[k - 3][i + 3]],
                player: map[i][j]
            };
            return true;
        }
    return false;
}


function vertical3EmLinha(map) {
    for (var i = 0; i < ROWS - 3; i++)
        for (var j = 0; j < COLUMNS; j++) {
            var array = [map[i][j], map[i + 1][j], map[i + 2][j], map[i + 3][j]];
            if (count(array, 0) == 1 &&
                (count(array, 1) == 3 || count(array, 2) == 3)) {
                player3EmLinha = count(array, 1) ? pecaPlayer1 : pecaPlayer2;
                return true;
            }
        }
    return false;
}

function horizontal3EmLinha(map) {
    for (var i = 0; i < ROWS; i++)
        for (var j = 0; j < COLUMNS - 3; j++) {
            var array = [map[i][j], map[i][j + 1], map[i][j + 2], map[i][j + 3]];
            if (count(array, 0) == 1 &&
                (count(array, 1) == 3 || count(array, 2) == 3)) {
                player3EmLinha = count(array, 1) ? pecaPlayer1 : pecaPlayer2;
                return true;
            }
        }
    return false;
}

function diagonal3EmLinha(map) {
    for (var i = 3; i < ROWS; i++)
        for (var j = 0; j < COLUMNS - 3; j++) {
            var array = [map[i][j], map[i - 1][j + 1], map[i - 2][j + 2], map[i - 3][j + 3]];
            if (count(array, 0) == 1 &&
                (count(array, 1) == 3 || count(array, 2) == 3))
                return true;
        }

    for (var i = 0; i < ROWS - 3; i++) {
        for (var j = 0; j < COLUMNS - 3; j++) {
            var array = [map[i][j], map[i + 1][j + 1], map[i + 2][j + 2], map[i + 3][j + 3]];
            if (count(array, 0) == 0 &&
                (count(array, 1) == 4 || count(array, 2) == 4))
                return true;
        }
        for (var k = 3; k < ROWS; k++) {
            var array = [map[i][j], map[i + 1][j + 1], map[i + 2][j + 2], map[i + 3][j + 3]];
            if (count(array, 0) == 0 &&
                (count(array, 1) == 4 || count(array, 2) == 4))
                return true;
            array = [map[k][i], map[k - 1][i + 1], map[k - 2][i + 2], map[k - 3][i + 3]];
            if (count(array, 0) == 0 &&
                (count(array, 1) == 4 || count(array, 2) == 4))
                return true;
        }
    }
    return false;
}

function zonaJogavel(e) {
    var linha, coluna;
    for (coluna = 0; coluna < zonaJogadas.length; coluna++)
        if (e.currentTarget == zonaJogadas[coluna]) {
            linha = pecaJogada(coluna);
            break;
        }
    if (!(linha == null)) {
        window.removeEventListener("mousemove", movimentoRato, false);
        for (var i = 0; i < zonaJogadas.length; i++)
            zonaJogadas[i].removeEventListener("mouseup", zonaJogavel, false);

        estadoDoJogo.nextPlayer.peca.className = "peca";

        var stagePos = stage.getBoundingClientRect();
        estadoDoJogo.nextPlayer.peca.style.left = 45 + coluna * 90 + stagePos.left + "px";
        posicao = 0;
        intervalo = setInterval(frames, linha + 1, linha);
    }
}

function frames(y) {
    if (posicao == 90 * (y + 1)) {
        clearInterval(intervalo);
        window.addEventListener("mousemove", movimentoRato, false);
        trocaPlayer();
        estadoDoJogo.nextPlayer.peca.className = "escondido";
        for (var i = 0; i < zonaJogadas.length; i++)
            zonaJogadas[i].addEventListener("mouseup", zonaJogavel, false);
        sounds.peca.play();
        render();
    } else {
        posicao++;
        estadoDoJogo.nextPlayer.peca.style.top = posicao + "px";
    }
}

function pecaJogada(coluna) {
    for (var i = map.length - 1; i >= 0; i--)
        if (map[i][coluna] == 0) {
            var linha = i;
            map[linha][coluna] = estadoDoJogo.nextPlayer.valor;
            return linha
        }

    alert("Coluna cheia!");
    return null;
}

function trocaPlayer() {
    if (jogoComPC)
        jogaPC();
    else {

        var player = estadoDoJogo.nextPlayer;
        estadoDoJogo.nextPlayer = estadoDoJogo.outroPlayer;
        estadoDoJogo.outroPlayer = player;
        estadoDoJogo.nextPlayer.peca.className = "peca";
        estadoDoJogo.outroPlayer.peca.className = "escondido";
        titulo();
    }
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
}

function endGame() {
    sounds.somDeFundo.muted = true;
    sounds.ganhou.play();

}

/*//----------------------------------------------------------------------------
// descodifica os valores em PX do estilo e devolve um float  
function getValue(cssValue) {
    var number = cssValue.split("px")[0].trim();
    return parseFloat(number);
}
*/
function mutedSound() {
    if (sounds.somDeFundo.muted == false) {
        sounds.somDeFundo.muted = true;
        sounds.mute.src = "images/mute.png"
    } else {
        sounds.somDeFundo.muted = false;
        sounds.mute.src = "images/sound.png";
    }
}

function escondePeca() {
    estadoDoJogo.nextPlayer.peca.className = "escondido";
}

function titulo() {
    title.innerHTML = estadoDoJogo.nextPlayer == pecaPlayer1 ?
        "<u>" + pecaPlayer1.playerName + "</u> VS " + pecaPlayer2.playerName :
        pecaPlayer1.playerName + " VS <u>" + pecaPlayer2.playerName + "</u> ";
}