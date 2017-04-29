var mapaPossibilidades;
var pontuacoes;
var COMPUTERLEVEL = 4;

function startAi() {
    pecaPlayer2.playerName = "Mr. Robot";
}

function jogaPC() {
    //var novoMapa = resetMapaDePossibilidades();
    //alert(comecaJogada(2, novoMapa, 0, 2));
    var pontuacoes = [];
    for (var i = 0; i < 7; i++) {
        novoMapa = resetMapaDePossibilidades();
        var mapa = novoMapa.slice();
        pontuacoes[i] = calculaPontuacao(mapa) + makeAMove(mapa, COMPUTERLEVEL, i);
    }

    //    alert(pontuacoes);
    var opcaoEscolhida = getMelhorOpcao(pontuacoes);
    var linha = pecaJogada(opcaoEscolhida, map);
    map[linha][opcaoEscolhida] = 2;
    //  alert(opcaoEscolhida);

    /*pontuacoes = [];
    mapaPossibilidades = resetMapaDePossibilidades();
    for (var i = 0; i < 7; i++) {
        var novoMapa = mapa;
        var linha = pecaJogada(coluna, novoMapa);
        pontuacoes[i] = calculaPontuacao(mapaPossibilidades, i);
        mapaPossibilidades = resetMapaDePossibilidades();
    }
    alert(pontuacoes);
    */ //render();
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

/*function comecaJogada(mapa) {
    var mapa1 = mapa.slice(0);
    var mapa2 = mapa.slice(0);
    var mapa3 = mapa.slice(0);
    var mapa4 = mapa.slice(0);
    pontuacoes = [];
    //while (nivel <= 0) {
    for (var i = 0; i < 7; i++) {
        var pontuacao = 0;
        var linha = pecaJogada(i, mapa);
        if (linha == null) {
            pontuacao -= 100;
            break;
        }
        mapa1[linha][i] = 2;
        pontuacao += calculaPontuacao(mapa);

        for (var j = 0; j < 7; j++) {
            var linha1 = pecaJogada(j, mapa);
            if (linha1 == null) {
                pontuacao += 100;
                break;
            }
            mapa[linha1][j] = 1;
            pontuacao += -calculaPontuacao(mapa);

            for (var k = 0; k < 7; k++) {
                var linha2 = pecaJogada(i, mapa);
                if (linha2 == null) {
                    pontuacao -= 100;
                    break;
                }
                mapa[linha2][k] = 2;
                pontuacao += calculaPontuacao(mapa);

                for (var l = 0; l < 7; l++) {
                    var linha3 = pecaJogada(j, mapa);
                    if (linha3 == null) {
                        pontuacao += 100;
                        break;
                    }
                    mapa[linha3][j] = 1;
                    pontuacao += -calculaPontuacao(mapa);
                }
            }
        }
        //}
        pontuacoes[i] = pontuacao;
        mapa = resetMapaDePossibilidades();
    }
    return pontuacoes;
}

/*function comecaJogada(nivel, mapa, coluna, player) {
    player = player == 1 ? 2 : 1;
    var array = [];
    if (nivel == 0) {
        var novoMapa = mapa;
        var linha = pecaJogada(coluna, mapa);
        return [calculaPontuacao(mapaPossibilidades, linha, coluna, player)];
    }
    for (var i = 0; i < 7; i++)
        array[i] = comecaJogada(--nivel, mapa, i);
    return array;
}
*/

function resetMapaDePossibilidades() {
    var mapazinho = [];
    for (var i = 0; i < map.length; i++) {
        mapazinho[i] = [];
        for (var j = 0; j < map[i].length; j++)
            mapazinho[i][j] = map[i][j];
    }
    return mapazinho;
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
        return Math.floor(100); // * (densidade / 2));
    if (densidade == COMPUTERLEVEL) {
        calculaPontuacao
    }


    mapa[linha][coluna] = player;
    if (densidade == 1)
        return Math.floor(calculaPontuacao(mapa.slice())); // * (densidade / 2));
    var pontuacao = calculaPontuacao(mapa.slice()); // * densidade;
    for (var i = 0; i < 7; i++)
        pontuacao += makeAMove(mapa.slice(), --densidade, i);
    return pontuacao;
}






/*

function makeAMove(mapa, densidade, coluna) {
    var player = densidade % 2 == 0 ? 1 : 2;
    var linha = pecaJogada(coluna, mapa);
    if (linha == null)
        return Math.floor(100 * (densidade / 2));
    //return (player === 2 ? -100 : 100) * densidade;
    //var novoMapa = mapa.slice(0);
    mapa[linha][coluna] = player;
    if (densidade == 1)
    //return (player === 2 ? 1 : -1) * calculaPontuacao(mapa) * densidade;
        return Math.floor(calculaPontuacao(mapa.slice()) * (densidade / 2));
    var pontuacao = calculaPontuacao(mapa.slice()) * densidade;
    for (var i = 0; i < 7; i++)
        pontuacao += makeAMove(mapa.slice(), --densidade, i);
    return pontuacao;
}

*/