const images = [];
const bgImage = './images/fundo.png';
const cartas = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];
for(let i=1; i<=10;i++) {
    images.push(`images/${i}.png`);
}
//estado do jogo
let clickTravado = false;
let temCartaVirada = false;
let posCartaVirada = -1;
let pontos = 0;
//desenha as imagens na tela
onload = () => {
    const elemImagens = document.querySelectorAll('#memoria img');
    elemImagens.forEach((img, i) => {
        img.src = bgImage;
        img.setAttribute('data-valor', i);
        img.style.opacity = '0.7';
    });
    document.querySelector('#btn-iniciar').onclick = iniciarJogo;
}
const iniciarJogo = () => {
    let i=0;
    while(i < cartas.length) {
        let pos = Math.trunc(Math.random() * cartas.length);
        let aux = cartas[pos];
        cartas[pos] = cartas[i];
        cartas[i] = aux;
        i++;
    }
    
    //associar evento às imagens
    const elemImagens = document.querySelectorAll('#memoria img');
    elemImagens.forEach((img, i) => {
        img.onclick = tratarClickImagem;
        img.style.opacity = 1;
        img.src = bgImage;
    });
    clickTravado = false;
    temCartaVirada = false;
    posCartaVirada = -1;
    valorCartaVirada = 0;
    pontos = 0;
    document.querySelector('#timer').style.backgroundColor = 'orange';
    document.querySelector('#btn-iniciar').disabled = true;
    timerDoJogo.start();
    console.log(images);
    console.log(cartas);
}
const tratarClickImagem = (element) => {
    const pos = parseInt(element.target.getAttribute('data-valor'));
    const valor = cartas[pos];
    element.target.src = images[valor-1];
    element.target.onclick = null;
    if(!temCartaVirada) {
        temCartaVirada = true;
        posCartaVirada = pos;
        valorCartaVirada = valor;
    } else {
        if(valor == valorCartaVirada) {
            pontos++;
        } else {
            const p0 = posCartaVirada;
            clickTravado = true;
            setTimeout(() => {
                element.target.src = bgImage;
                element.target.onclick = tratarClickImagem;
                let img = document.querySelector('#memoria #i'+p0);
                img.src = bgImage;
                img.onclick = tratarClickImagem;
                clickTravado = false;
            }, 500);
        }
        temCartaVirada = false;
        posCartaVirada = -1;
        valorCartaVirada = 0;
    }
    if(pontos == cartas.length/2) {
        timerDoJogo.stop();
        document.querySelector('#btn-iniciar').disabled = false;
        document.querySelector('#timer').style.backgroundColor = 'lightgreen';
        setTimeout(()=> {
            alert('Você venceu! :)');
        }, 100);
    }
}

const timerDoJogo = new Timer('#timer');
function Timer(e) {
    this.element = e;
    this.time = 0;
    this.control = null;
    this.start = () => {
        this.time = 0;
        this.control = setInterval(() => {
            this.time++;
            const minutes = Math.trunc(this.time/60);
            const seconds = this.time % 60;
            document.querySelector(this.element).innerHTML = (minutes < 10 ? '0': '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }, 1000);
    }
    this.stop = () => {
        clearInterval(this.control);
        this.control = null;
    }
}