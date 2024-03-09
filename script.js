// RESETA TODOS OS INPUTS PARA 0
function resetarInputs() {
    var todosInputs = document.querySelectorAll('input');
    
    todosInputs.forEach(function (input) {
        input.value = 0;
    });
}




// INICIALIZA OS INPUTS EM 0 E COM VALOR MÁXIMO DE 359
function inicializarInputs(inputIds, limite) {
    inputIds.forEach(function (elementId) {
        var inputElement = document.getElementById(elementId);

        // Verifica se o elemento é um input
        if (inputElement.tagName === 'INPUT') {
            inputElement.value = 0;

            inputElement.addEventListener('input', function () {
                var valorAtualizado = parseFloat(inputElement.value);

                if (isNaN(valorAtualizado)) {
                    valorAtualizado = 0;
                }

                if (elementId === 'hueInput') {
                    valorAtualizado = Math.min(359, Math.max(0, valorAtualizado));
                } else {
                    valorAtualizado = Math.min(limite, Math.max(0, valorAtualizado));
                }

                inputElement.value = valorAtualizado;
            });
        }
    });
}


// LIMITA O rgbInput EM 255 DINAMICAMENTE
var limitarRGB = ['redInput', 'greenInput', 'blueInput'];
inicializarInputs(limitarRGB, 255);


// LIMITA O cmykInput EM 100 DINAMICAMENTE
var limitarCMYK = ['cyanInput', 'magentaInput', 'yellowInput', 'blackInput'];
inicializarInputs(limitarCMYK, 100);


// LIMITA O HSVInput EM 359 DINAMICAMENTE
var limitarHSV = ['hueInput', 'saturacaoInput', 'valueInput'];
inicializarInputs(limitarHSV, 359);


// LIMITA O CAMPO saturationInput EM 100 DINAMICAMENTE
document.getElementById('saturacaoInput').addEventListener('input', function () {
    var valorAtualizado = parseFloat(this.value);
    valorAtualizado = Math.min(100, Math.max(0, valorAtualizado));
    this.value = valorAtualizado;
});


// LIMITA O CAMPO valueInput EM 100 DINAMICAMENTE
document.getElementById('valueInput').addEventListener('input', function () {
    var valorAtualizado = parseFloat(this.value);
    valorAtualizado = Math.min(100, Math.max(0, valorAtualizado));
    this.value = valorAtualizado;
});


// INICIALIZA OS CAMPOS DO FORMULÁRIO DE ACORDO COM A OPERAÇÃO
atualizarCampos(document.getElementById('selecionarOperacao').value);


// ALTERA OS RÓTULOS QUANDO A OPERAÇÃO É SELECIONADA
document.getElementById('selecionarOperacao').addEventListener('change', function () {
    var operacaoSelecionada = this.value;
    resetarInputs();
    atualizarCampos(operacaoSelecionada);
});




// ATUALIZAR CAMPOS
function atualizarCampos(operacao) {
    var inputs = {
        'hsvRGB': 'hsvInput',
        'cmykRGB': 'cmykInput',
        'normalizar': 'rgbInput',
    };
    
    Object.values(inputs).forEach(function (inputId) {
        document.getElementById(inputId).style.display = 'none';
    }); // Esconde todos os inputs

    var inputId = inputs[operacao] || 'rgbInput';

    document.getElementById(inputId).style.display = 'block';

    var inputLabels = document.querySelectorAll('#' + inputId + ' label');
    var rotulos = []; // Atualiza os rótulos

    // Define os rótulos com base na operação selecionada
    if (operacao === 'hsvRGB') {
        rotulos = ['Hue °', 'Saturation %', 'Value %'];
    } else if (operacao === 'cmykRGB') {
        rotulos = ['Cyan %', 'Magenta %', 'Yellow %', 'Black %'];
    } else {
        rotulos = ['Red', 'Green', 'Blue'];
    }

    inputLabels.forEach((label, index) => {
        label.innerText = rotulos[index] + ':';
    }); 
}




// Adiciona um ouvinte de evento para alterar os rótulos quando a operação é selecionada
document.getElementById('selecionarOperacao').addEventListener('change', function () {
    var operacaoSelecionada = this.value;
    atualizarCampos(operacaoSelecionada);
});




// FUNÇÃO CONVERTER CORES
function converterCor() {
    var operacao = document.getElementById('selecionarOperacao').value;
    var resultado;

    switch (operacao) {
        case 'normalizar':
            resultado = normalizarRGB(
                parseFloat(document.getElementById('redInput').value),
                parseFloat(document.getElementById('greenInput').value),
                parseFloat(document.getElementById('blueInput').value)
            );
            break;
        case 'rgbHSV':
            resultado = rgbHSV(
                parseFloat(document.getElementById('redInput').value),
                parseFloat(document.getElementById('greenInput').value),
                parseFloat(document.getElementById('blueInput').value)
            );
            break;
        case 'hsvRGB':
            resultado = hsvToRgb(
                parseFloat(document.getElementById('hueInput').value),
                parseFloat(document.getElementById('saturacaoInput').value),
                parseFloat(document.getElementById('valueInput').value)
            );
            break;
        case 'rgbCMYK':
            resultado = rgbCMYK(
                parseFloat(document.getElementById('redInput').value),
                parseFloat(document.getElementById('greenInput').value),
                parseFloat(document.getElementById('blueInput').value)
            );
            break;
        case 'cmykRGB':
            resultado = cmykRGB(
                parseFloat(document.getElementById('cyanInput').value),
                parseFloat(document.getElementById('magentaInput').value),
                parseFloat(document.getElementById('yellowInput').value),
                parseFloat(document.getElementById('blackInput').value)
            );
            break;
            case 'rgbCinza':
            resultado = rgbCinza(
                parseFloat(document.getElementById('redInput').value),
                parseFloat(document.getElementById('greenInput').value),
                parseFloat(document.getElementById('blueInput').value)
            );
            break;
            
        default:
            resultado = 'Operação Inválida!';
    }

    document.getElementById('resultado').innerText = JSON.stringify(resultado);
}




// EVENTO DO BOTÃO CONVERTER
document.getElementById('converterButton').addEventListener('click', function () {
    converterCor();
});




// NORMALIZAR RGB
function normalizarRGB(red, green, blue) {
    var total = red + green + blue;

    if (total === 0) {
        return "RGB Normalizado: (0.00, 0.00, 0.00)";
    }

    var r = (red / total).toFixed(2);
    var g = (green / total).toFixed(2);
    var b = (blue / total).toFixed(2);

    return `RGB Normalizado: (${r}, ${g}, ${b})`;
}




// RGB PARA HSV
function rgbHSV(red, green, blue) {
    var r = red / 255;
    var g = green / 255;
    var b = blue / 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);

    let saturacao = 0;
    if (max !== 0) {
        saturacao = 1 - min / max;
    }

    let matiz;
    if (max === min) {
        matiz = 0;
    } else {
        switch (max) {
            case r:
                matiz = (g - b) / (max - min) + (g < b ? 6 : 0);
                break;
            case g:
                matiz = (b - r) / (max - min) + 2;
                break;
            case b:
                matiz = (r - g) / (max - min) + 4;
                break;
        }
        matiz /= 6;
    }

    var value = max;

    return `HSV: (${Math.round(matiz * 360)}, ${Math.round(saturacao * 100)}%, ${Math.round(value * 100)}%)`;
}




// HSV PARA RGB
function hsvToRgb(hue, saturation, value) {
    var h = hue / 360;
    var s = saturation / 100;
    var v = value / 100;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];

    return `RGB: (${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}




// RGB PARA CMYK
function rgbCMYK(red, green, blue) {

    if (red === 0 && green === 0 && blue === 0) {
        return "CMYK: (0%, 0%, 0%, 100%)";
    }

    var r = red / 255;
    var g = green / 255;
    var b = blue / 255;

    var k = 1 - Math.max(r, g, b); // Calcula O black
    
    var c = (1 - r - k) / (1 - k);
    var m = (1 - g - k) / (1 - k);
    var y = (1 - b - k) / (1 - k); // Calcula os componentes C, M, Y

    c = Math.min(1, Math.max(0, c));
    m = Math.min(1, Math.max(0, m));
    y = Math.min(1, Math.max(0, y));
    k = Math.min(1, Math.max(0, k));

    c = Math.round(c * 100);
    m = Math.round(m * 100);
    y = Math.round(y * 100);
    k = Math.round(k * 100);

    return `CMYK: (${c}%, ${m}%, ${y}%, ${k}%)`;
}




// CMYK PARA RGB
function cmykRGB(cyan, magenta, yellow, black) {
    var c = cyan / 100;
    var m = magenta / 100;
    var y = yellow / 100;
    var k = black / 100;

    var r = (1 - c) * (1 - k);
    var g = (1 - m) * (1 - k);
    var b = (1 - y) * (1 - k);

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    return `RGB: (${r}, ${g}, ${b})`;
}




// RGB PARA ESCALA DE CINZA
function rgbCinza(red, green, blue) {
    var r = red / 255;
    var g = green / 255;
    var b = blue / 255;

    var gray = (r + g + b) / 3;

    gray = Math.round(gray * 255);

    // Formatar o resultado com duas casas decimais
    gray = gray.toFixed(2);

    return `Escala de Cinza: (${gray})`;
}