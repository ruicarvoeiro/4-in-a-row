var jogoComPC;
var stage; // stage do jogo
var output; // mensagens de informacao
var info4EmLinha = {
    player: null,
    pecas: []
};

var player3EmLinha = {
    p1: false,
    p2: false
};

var estadoDoJogo = {
    emCurso: true,
    nextPlayer: pecaPlayer1,
    outroPlayer: pecaPlayer2,
    offsetX: 0,
    offsetY: 0,
    vencedor: null
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
    [0, 2, 2, 2, 1, 1, 1],
    [2, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0]
];
// informacao da peca de cada jogador

var ROWS = map.length;
var COLUMNS = map[0].length;

var zonaJogadas;

var intervalo; //timer para as animações

var posicao = 0; //posicao da peca durante as animacoes

function initGame() {
    jogoComPC = jogarComPC.checked;
    estadoDoJogo.nextPlayer.peca.className = "peca";
    estadoDoJogo.outroPlayer.peca.className = "escondido";

    stage = document.getElementById("stage");
    output = document.getElementById("textoDeJogo");

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
                case "animar":
                    if (estadoDoJogo.vencedor == pecaPlayer1)
                        cell.style.backgroundPositionY = pecaPlayer1.rowColor + "px";
                    else
                        cell.style.backgroundPositionY = pecaPlayer2.rowColor + "px";
                    cell.className = "pecaTabuleiro pecaAnimada";
                    break;
            }
        }
    }

    if (estadoDoJogo.emCurso) {
        empate();
        player3EmLinha = {
            p1: false,
            p2: false
        };
        if (fizeram4EmLinha(map)) {
            output.innerHTML = "4 em linha";
            estadoDoJogo.vencedor = info4EmLinha.player;
            endGame();
            title.innerHTML = "Fim de Jogo <u>" + info4EmLinha.player.playerName + "</u> ganhou!";
            stopEverything();
        } else if (fizeram3EmLinha(map)) {
            if (player3EmLinha.p1 && player3EmLinha.p2) {
                output.innerHTML = pecaPlayer1.playerName + " e " + pecaPlayer2.playerName + " fez 3 em linha!";
                sounds.jogador1_fez_3.play();
                sounds.jogador2_fez_3.play();
            } else {
                if (player3EmLinha.p1) {
                    output.innerHTML = pecaPlayer1.playerName + " fez 3 em linha!";
                    sounds.jogador1_fez_3.play();
                }
                if (player3EmLinha.p2) {
                    output.innerHTML = pecaPlayer2.playerName + " fez 3 em linha!";
                    sounds.jogador2_fez_3.play();
                }
            }
        } else
            output.innerHTML = "";
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
                    pecas: [],
                    player: map[i][j] == 1 ? pecaPlayer1 : pecaPlayer2
                };
                try {
                    var valor = 0;
                    while (true) {
                        if (map[i][j] == map[i + valor][j])
                            info4EmLinha.pecas.push([i + valor, j])
                        else break;
                        valor++;
                    }
                } catch (e) {}
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
                    pecas: [],
                    player: map[i][j] == 1 ? pecaPlayer1 : pecaPlayer2
                };
                try {
                    var valor = 0;
                    while (true) {
                        if (map[i][j] == map[i][j + valor])
                            info4EmLinha.pecas.push([i, j + valor])
                        else break;
                        valor++;
                    }
                } catch (e) {}
                return true;
            }

    return false;
}

function diagonal4EmLinha(map) {
    //Canto inferior esquerdo até canto superior direito
    for (var i = ROWS - 1; i >= 3; i--)
        for (var j = 0; j < COLUMNS - 3; j++) {
            if (map[i][j] != 0 &&
                map[i][j] == map[i - 1][j + 1] &&
                map[i][j] == map[i - 2][j + 2] &&
                map[i][j] == map[i - 3][j + 3]) {
                info4EmLinha = {
                    pecas: [],
                    player: map[i][j] == 1 ? pecaPlayer1 : pecaPlayer2
                };
                try {
                    var valor = 0;
                    while (true) {
                        if (map[i][j] == map[i - valor][j + valor])
                            info4EmLinha.pecas.push([i - valor, j + valor])
                        else break;
                        valor++;
                    }
                } catch (e) {}
                return true;
            }
        }




    //Canto inferior direito até canto superior esquerdo
    for (var i = ROWS - 1; i >= 3; i--)
        for (var j = 3; j < COLUMNS; j++) {
            if (map[i][j] != 0 &&
                map[i][j] == map[i - 1][j - 1] &&
                map[i][j] == map[i - 2][j - 2] &&
                map[i][j] == map[i - 3][j - 3]) {
                info4EmLinha = {
                    pecas: [],
                    player: map[i][j] == 1 ? pecaPlayer1 : pecaPlayer2
                };
                try {
                    var valor = 0;
                    while (true) {
                        if (map[i][j] == map[i - valor][j - valor])
                            info4EmLinha.pecas.push([i - valor, j - valor])
                        else break;
                        valor++;
                    }
                } catch (e) {}
                return true;
            }
        }
    return false;
}


function vertical3EmLinha(map) {
    for (var i = 0; i < ROWS - 3; i++)
        for (var j = 0; j < COLUMNS; j++) {
            var array = [map[i][j], map[i + 1][j], map[i + 2][j], map[i + 3][j]];
            var below = helper3EmLInha(map[i][j], i, j) && helper3EmLInha(map[i + 1][j], i + 1, j) && helper3EmLInha(map[i + 2][j], i + 2, j) && helper3EmLInha(map[i + 3][j], i + 3, j);
            if (below && count(array, 0) == 1 &&
                (count(array, 1) == 3 || count(array, 2) == 3)) {
                player3EmLinha = {
                    p1: count(array, 1) == 3 || player3EmLinha.p1,
                    p2: count(array, 2) == 3 || player3EmLinha.p2
                };
            }
        }
    return player3EmLinha.p1 || player3EmLinha.p2;
}

function horizontal3EmLinha(map) {
    for (var i = 0; i < ROWS; i++)
        for (var j = 0; j < COLUMNS - 3; j++) {
            var array = [map[i][j], map[i][j + 1], map[i][j + 2], map[i][j + 3]];
            var below = helper3EmLInha(map[i][j], i, j) && helper3EmLInha(map[i][j + 1], i, j + 1) && helper3EmLInha(map[i][j + 2], i, j + 2) && helper3EmLInha(map[i][j + 3], i, j + 3);
            if (below && count(array, 0) == 1 &&
                (count(array, 1) == 3 || count(array, 2) == 3)) {
                player3EmLinha = {
                    p1: count(array, 1) == 3 || player3EmLinha.p1,
                    p2: count(array, 2) == 3 || player3EmLinha.p2
                };
            }
        }
    return player3EmLinha.p1 || player3EmLinha.p2;
}

function diagonal3EmLinha(map) {
    //Canto inferior esquerdo até canto superior direito
    for (var i = 3; i < ROWS; i++)
        for (var j = 0; j < COLUMNS - 3; j++) {
            var array = [map[i][j], map[i - 1][j + 1], map[i - 2][j + 2], map[i - 3][j + 3]];
            var below = helper3EmLInha(map[i][j], i, j) && helper3EmLInha(map[i - 1][j + 1], i - 1, j + 1) && helper3EmLInha(map[i - 2][j + 2], i - 2, j + 2) && helper3EmLInha(map[i - 3][j + 3], i - 3, j + 3);
            if (below && count(array, 0) == 1 &&
                (count(array, 1) == 3 || count(array, 2) == 3))
                player3EmLinha = {
                    p1: count(array, 1) == 3 || player3EmLinha.p1,
                    p2: count(array, 2) == 3 || player3EmLinha.p2
                };
        }

    //Canto inferior direito até canto superior esquerdo
    for (var i = 3; i < ROWS; i++)
        for (var j = 3; j < COLUMNS; j++) {
            var array = [map[i][j], map[i - 1][j - 1], map[i - 2][j - 2], map[i - 3][j - 3]];
            var below = helper3EmLInha(map[i][j], i, j) && helper3EmLInha(map[i - 1][j - 1], i - 1, j - 1) && helper3EmLInha(map[i - 2][j - 2], i - 2, j - 2) && helper3EmLInha(map[i - 3][j - 3], i - 3, j - 3);
            if (below && count(array, 0) == 1 &&
                (count(array, 1) == 3 || count(array, 2) == 3))
                player3EmLinha = {
                    p1: count(array, 1) == 3 || player3EmLinha.p1,
                    p2: count(array, 2) == 3 || player3EmLinha.p2
                };
        }
    return player3EmLinha.p1 || player3EmLinha.p2;
}

function zonaJogavel(e) {
    var linha, coluna;
    for (coluna = 0; coluna < zonaJogadas.length; coluna++)
        if (e.currentTarget == zonaJogadas[coluna]) {
            linha = pecaJogada(coluna, map);
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
        intervalo = setInterval(frames, (linha + 1) / 2, linha);
    } else {
        empate();
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

function pecaJogada(coluna, map) {
    for (var i = map.length - 1; i >= 0; i--)
        if (map[i][coluna] == 0) {
            var linha = i;
            map[linha][coluna] = estadoDoJogo.nextPlayer.valor;
            return linha
        }
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
    var array = info4EmLinha.pecas;
    for (var i = 0; i < array.length; i++)
        map[array[i][0]][array[i][1]] = "animar";
    estadoDoJogo.emCurso = false;
    render();
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

function stopEverything() {
    estadoDoJogo.emCurso = false;
    window.removeEventListener("mousemove", movimentoRato, false);
    for (var i = 0; i < zonaJogadas.length; i++)
        zonaJogadas[i].removeEventListener("mouseup", zonaJogavel, false);
    estadoDoJogo.nextPlayer.peca.className = "escondido";
}

function helper3EmLInha(cel, linha, coluna) {
    if (linha == 5)
        return true;
    return (cel != 0 || (map[linha + 1][coluna] != 0))
}

function empate() {
    var tudoCheio = true;
    for (var j = 0; j < COLUMNS; j++)
        if (map[0][j] == 0)
            tudoCheio = false;
        else
            output.innerHTML = ("Coluna cheia!");
    if (tudoCheio) {
        title.innerHTML = ("Fim de Jogo. Empate !");
        stopEverything();
        render();
        sounds.somDeFundo.muted = true;
    }
    return tudoCheio;
}