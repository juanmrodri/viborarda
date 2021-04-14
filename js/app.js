// Botones
//const btnReinicio = document.querySelector("#reiniciarBtn");
//const btnStop = document.querySelector("#stopBtn");
const btnUp = document.querySelector("#flechaArriba");
const btnDown = document.querySelector("#flechaAbajo");
const btnLf = document.querySelector("#flechaIzq");
const btnRg = document.querySelector("#flechaDer");
// puntaje y timer
const puntaje = document.querySelector(".puntos");
const timer = document.querySelector("#timer");

// timer
counter = 0;

function timerCount() {
  setInterval(() => {
    timer.innerHTML = counter;
    counter += 1;
  }, 500);
}

timerCount();

// eventos de botones

Listeners();

// listeners declarado abajo de el onkeydown

// ancho y alto de mi canvas
const ANCHOALTO = 500;
// constantes de control
const PESO = 10;
// intervalo del loop
const INTERVALO = 80; // milisegundos
// configuraciones de direcciones
const DIRECCION = {
  KeyA: [-1, 0],
  KeyD: [1, 0],
  KeyS: [0, 1],
  KeyW: [0, -1],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};
let controles = {
  direccion: { x: 1, y: 0 },
  bicho: [{ x: 25, y: 25 }],
  victima: { x: 0, y: 250 },
  jugando: false, // vamos a detectar si el juego esta corriento
  crecimiento: 0, // esto va a chequear si tiene que crecer o no
};
let teclaApretada;
// referencio el canvas en JS
let papel = document.querySelector("canvas");
// referencia al contexto de canvas
let ctx = papel.getContext("2d");
// creamos el loop
let looper = () => {
  // creamos un objeto vacio que represente la cola
  let cola = {};
  // clonar la ultima posicion de bicho en cola
  Object.assign(cola, controles.bicho[controles.bicho.length - 1]); // espera dos parametros, el primero es a donde quiero copiar lo que voy a copiar, el segundo es el elemento que vamos a copiar, es decir, el ultimo que existe, si recien arranca, es la cabeza
  // instancio la cabeza del bicho
  const sq = controles.bicho[0];
  // verifico que bicho atrapo a la victima
  let atrapado = sq.x === controles.victima.x && sq.y === controles.victima.y; // aca si esto se cumple, guardamos un true
  puntaje.innerHTML = controles.bicho.length - 1; // esto muestra el puntaje
  // detecto si en esta vuelta del loop, hay un choque
  if (detectarChoque()) {
    // si existe este choque, detengo el juego y llamamamos a la funcion reiniciar
    alert("Gameover");
    reiniciarJuego();
  }
  // referencio la direccion actual
  let dx = controles.direccion.x;
  let dy = controles.direccion.y;
  // guardo el tamaño de mi bicho
  let tamanio = controles.bicho.length - 1;
  // pregunto si el juego corre
  if (controles.jugando) {
    //hacemos un for a la inversa, del bicho
    for (let idx = tamanio; idx > -1; idx--) {
      // referencio la cabeza del bicho
      const sq = controles.bicho[idx]; // yo necesito aca saber la posicion del fragmento actual del bicho
      // esto lo que hace es asignarle al ultimo elemento, la posicion de su posicion anterior, y asi se van
      // "moviendo" siendo la cabeza el ultimo elemento que se mueve en realidad
      // aca pregunto si esta es la cabeza
      if (idx === 0) {
        // si es la cabeza, avanza a la nueva direccion
        // por eso el +=
        sq.x += dx;
        sq.y += dy;
      } else {
        // si no es la cabeza, asigno posicion del miembro anterior
        sq.x = controles.bicho[idx - 1].x;
        sq.y = controles.bicho[idx - 1].y;
      }
    }
  }

  // verifico si atrape algo
  if (atrapado) {
    // le digo a la serpiente que creza en 1
    controles.crecimiento += 1; // aca sabemos que la cabeza va a crecer uno
    // reposicionamos el cuadrado blanco "victima"
    revictima();
  }
  // pregunto si tengo que crecer
  if (controles.crecimiento > 0) {
    // agrego a mi bicho el clon de cola creado anteriormente
    controles.bicho.push(cola); // esto le agrega el objeto vacio con la copia de la cabeza
    controles.crecimiento -= 1; // esto vuelve a 0 para que no siga creciendo
  }

  // llamo a la animacion a dibujar
  requestAnimationFrame(dibujar);

  // llamar a la funcion luedo de x intervalo
  setTimeout(looper, INTERVALO);
};
// detecto choques contra las paredes y contra si misma
let detectarChoque = () => {
  // primero comprobamos que la cabeza no choque contra los bordes
  const head = controles.bicho[0];
  // pregunto si choca con los bordes o se sale de ellos
  if (
    head.x < 0 ||
    head.x >= ANCHOALTO / PESO ||
    head.y >= ANCHOALTO / PESO ||
    head.y < 0
  ) {
    return true;
  }
  // detectamos la colision contra nosotros mismos
  for (let idx = 1; idx < controles.bicho.length; idx++) {
    const sq = controles.bicho[idx];
    // si la posicion del "cuerpos" es igual a la posicion de la cabeza, significa que chocamos contra nosotros mismos y se termina el juego
    if (sq.x === head.x && sq.y === head.y) {
      return true; // si algun choque pase tiro un true
    }
  }
};

document.onkeydown = (e) => {
  // guardo en teclaApretada la nueva direccion
  console.log(e);
  if (e.code === "Numpad7") {
    controles.crecimiento += 2;
  }
  teclaApretada = DIRECCION[e.code];
  // deconstruyo x y de teclaApretada
  const [x, y] = teclaApretada; // lo que esta en la pos 0 se guardara en x e y
  if (-x !== controles.direccion.x && -y !== controles.direccion.y) {
    // con esta simple linea logramos que no se pueda ir en la direccion opuesta a la que estamos yendo, porque la viborita no se puede pisar, entonces si ambas direcciones en negativo, son distintas a las direcciones, nos deja mover al bicho, sino, no pasa nada, ya que se entiende que queremos ir para "atras" y eso no se puede
    // asigno las direcciones a mis controles
    controles.direccion.x = x; // aca establecemos que la tecla apretada indicara la direccion final
    controles.direccion.y = y; // aca establecemos que la tecla apretada indicara la direccion final
  }
};

function Listeners() {
  btnUp.addEventListener("click", () => {
    let flechaArriba = DIRECCION.ArrowUp;
    const [x, y] = flechaArriba; // lo que esta en la pos 0 se guardara en x e y
    if (-x !== controles.direccion.x && -y !== controles.direccion.y) {
      // con esta simple linea logramos que no se pueda ir en la direccion opuesta a la que estamos yendo, porque la viborita no se puede pisar, entonces si ambas direcciones en negativo, son distintas a las direcciones, nos deja mover al bicho, sino, no pasa nada, ya que se entiende que queremos ir para "atras" y eso no se puede
      // asigno las direcciones a mis controles
      controles.direccion.x = x; // aca establecemos que la tecla apretada indicara la direccion final
      controles.direccion.y = y; // aca establecemos que la tecla apretada indicara la direccion final
    }
  });
  btnDown.addEventListener("click", () => {
    let flechaAbajo = DIRECCION.ArrowDown;
    const [x, y] = flechaAbajo; // lo que esta en la pos 0 se guardara en x e y
    if (-x !== controles.direccion.x && -y !== controles.direccion.y) {
      // con esta simple linea logramos que no se pueda ir en la direccion opuesta a la que estamos yendo, porque la viborita no se puede pisar, entonces si ambas direcciones en negativo, son distintas a las direcciones, nos deja mover al bicho, sino, no pasa nada, ya que se entiende que queremos ir para "atras" y eso no se puede
      // asigno las direcciones a mis controles
      controles.direccion.x = x; // aca establecemos que la tecla apretada indicara la direccion final
      controles.direccion.y = y; // aca establecemos que la tecla apretada indicara la direccion final
    }
  });
  btnLf.addEventListener("click", () => {
    let flechaIzq = DIRECCION.ArrowLeft;
    const [x, y] = flechaIzq; // lo que esta en la pos 0 se guardara en x e y
    if (-x !== controles.direccion.x && -y !== controles.direccion.y) {
      // con esta simple linea logramos que no se pueda ir en la direccion opuesta a la que estamos yendo, porque la viborita no se puede pisar, entonces si ambas direcciones en negativo, son distintas a las direcciones, nos deja mover al bicho, sino, no pasa nada, ya que se entiende que queremos ir para "atras" y eso no se puede
      // asigno las direcciones a mis controles
      controles.direccion.x = x; // aca establecemos que la tecla apretada indicara la direccion final
      controles.direccion.y = y; // aca establecemos que la tecla apretada indicara la direccion final
    }
  });
  btnRg.addEventListener("click", () => {
    let flechaDer = DIRECCION.ArrowRight;
    const [x, y] = flechaDer; // lo que esta en la pos 0 se guardara en x e y
    if (-x !== controles.direccion.x && -y !== controles.direccion.y) {
      // con esta simple linea logramos que no se pueda ir en la direccion opuesta a la que estamos yendo, porque la viborita no se puede pisar, entonces si ambas direcciones en negativo, son distintas a las direcciones, nos deja mover al bicho, sino, no pasa nada, ya que se entiende que queremos ir para "atras" y eso no se puede
      // asigno las direcciones a mis controles
      controles.direccion.x = x; // aca establecemos que la tecla apretada indicara la direccion final
      controles.direccion.y = y; // aca establecemos que la tecla apretada indicara la direccion final
    }
  });
}

let dibujar = () => {
  ctx.clearRect(0, 0, ANCHOALTO, ANCHOALTO); // con esto cada vez que corre el loop, borramos todo lo que este en el canvas, desde las posiciones 0 y en los tamaños 500, es decir, la totalidad del canvas
  // recorro todo el bicho
  for (let idx = 0; idx < controles.bicho.length; idx++) {
    const { x, y } = controles.bicho[idx];
    dibujarActores("#0F3711", x, y);
  }
  // *ahora esto está en el for* const sq = controles.bicho[0]; // con esto sabemos la posicion de la cabeza del bicho, para ubicarnos en el canvas, y para poder redibujar el cuadrado
  const victima = controles.victima; // no le paso posicion porque es un objeto que tiene 2 elementos
  dibujarActores("#0F3711", victima.x, victima.y);
};

// dibuja todos los cuatros
let dibujarActores = (color, x, y) => {
  // Indico cual sera el color de dibujo a crear
  ctx.fillStyle = color;
  // creo un cuadrado (posicionX, posicionY, Ancho, Alto)
  ctx.fillRect(x * PESO, y * PESO, 10, 10); // aca en los 2 primeros argumentos, le pasamos las posiciones de looper
};
// crea posicion y direccion random
let cualquierLado = () => {
  // con esto lo que hago es convertir a DIRECCION, en un array, y guardarlo en direccion, ya que sino, no podria acceder a los valores y en el random me tiraria error
  let direccion = Object.values(DIRECCION);
  return {
    // esto va a ser un numero random entre 0 y 500
    x: parseInt((Math.random() * ANCHOALTO) / PESO), // aca lo dividimos por peso, ya que si lo dejamos como esta, cualquier numero que aparezca, sera multiplicado por peso, y nos daria posiciones por fuera del canvas
    y: parseInt((Math.random() * ANCHOALTO) / PESO),
    d: direccion[parseInt((Math.random() * 11) / PESO)],
  };
};
// reposicionar a la victima cuando fue capturada
let revictima = () => {
  // reposiciona a la victima en otro lado
  let nuevaPosicion = cualquierLado();
  let victima = controles.victima;
  victima.x = nuevaPosicion.x;
  victima.y = nuevaPosicion.y;
};

// reiniciamos el juego y sus valores
let reiniciarJuego = () => {
  // reiniciamos los valores de controles a 0
  counter = 0;
  controles = {
    direccion: { x: 1, y: 0 },
    bicho: [{ x: 25, y: 25 }],
    victima: { x: 0, y: 250 },
    jugando: false, // vamos a detectar si el juego esta corriento
    crecimiento: 0, // esto va a chequear si tiene que crecer o no
  };
  posiciones = cualquierLado();
  let head = controles.bicho[0];
  head.x = posiciones.x;
  head.y = posiciones.y;
  controles.direccion.x = posiciones.d[0]; // aca establecemos que la tecla apretada indicara la direccion final
  controles.direccion.y = posiciones.d[1];
  // posicion random de la victima
  posicionVictima = cualquierLado();
  let victima = controles.victima;
  victima.x = posicionVictima.x;
  victima.y = posicionVictima.y;
  controles.jugando = true;
};
// cuando el documento carga, llamo a looper
window.onload = () => {
  reiniciarJuego();
  //looper();
};
