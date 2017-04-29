var mapaPossibilidades;
var pontuacoes;
var COMPUTERLEVEL = 4;

function startAi() {
    pecaPlayer2.playerName = "Mr. Robot";
}

function jogaPC() {
    var mapa1 = map.slice(0);
    var pontuacoes = [];
    for (var i = 0; i < 7; i++) {
        var mapa = map1.slice(0);
        pontuacoes[i] = calculaPontuacao(mapa) + makeAMove(mapa, COMPUTERLEVEL, i);
    }

    var opcaoEscolhida = getMelhorOpcao(pontuacoes);
    var linha = pecaJogada(opcaoEscolhida, map);
    render();
    if (estadoDoJogo.emCurso)
        map[linha][opcaoEscolhida] = 2;
}

function getMelhorOpcao(array) {
    var max = Math.max(...array);
    var arrayMax = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i] == max)
            arrayMax.push(i);
    }
    return arrayMax[Math.floor(Math.random() * (arrayMax.length - 1))];
}

function calculaPontuacao(mapa) {
    if (fizeram4EmLinha(mapa))
        return 100;
    else if (fizeram3EmLinha(mapa))
        return 40;
    else return 0;
}

function makeAMove(mapa, densidade, coluna) {
    var player = densidade % 2 == 0 ? 1 : 2;
    var linha = pecaJogada(coluna, mapa);
    if (linha == null)
        return (player === 2 ? 1 : -1) * Math.floor(100); // * (densidade / 2));
    mapa[linha][coluna] = player;
    if (densidade == COMPUTERLEVEL) {
        if (calculaPontuacao(mapa) == 100)
            return 999999;
        mapa[linha][coluna] = 1;
        if (calculaPontuacao(mapa) == 100)
            return 99999;
    }
    if (densidade == 1)
        return (player === 2 ? 1 : -1) * Math.floor(calculaPontuacao(mapa.slice(0))); // * (densidade / 2));
    var pontuacao = (player === 2 ? 1 : -1) * calculaPontuacao(mapa.slice(0)); // * densidade;
    for (var i = 0; i < 7; i++)
        pontuacao += makeAMove(mapa.slice(0), --densidade, i);
    return pontuacao;
}