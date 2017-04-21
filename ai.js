var mapaPossibilidades;
var pontuacoes;

function startAi() {
    alert("Beep-boop eu sou um robot");
}

function jogaPC() {
    pontuacoes = [];
    resetMapaDePossibilidades();
    for (var i = 0; i < mapaPossibilidades.length; i++)
        pontuacoes[i] = calculaPontuacao(mapaPossibilidades[i], i);
    render();
}

function resetMapaDePossibilidades() {
    mapaPossibilidades = [
        [map],
        [map],
        [map],
        [map],
        [map],
        [map],
        [map]
    ];
}

function calculaPontuacao(mapa, coluna) {

}