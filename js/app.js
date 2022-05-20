// Constructores

// Constructor de Seguro
function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// Proto > Realiza la cotizacion con los datos

Seguro.prototype.cotizarSeguro = function(){

let cantidad;
const base = 2000;

switch(this.marca) {
    case '1':
        cantidad = base *1.15;
        break;
    case '2':
        cantidad = base *1.05;
        break;
    case '3':
        cantidad = base *1.35;
        break;
    default:
        break;
}

// leer el year
const diferencia = new Date().getFullYear() - this.year;

// cada year que la diferencia es mayor, el costo va a reducirse un 3%
cantidad -= ((diferencia * 3) * cantidad) /100;

/*
    Si el seguro es basico se multiplica por un 30%
    Si el seguro es completo se multiplica por un 50%
*/

if(this.tipo === 'basico'){
    cantidad *= 1.30;
} else{
    cantidad *= 1.50;
}
    return cantidad;
}

/* Logica de Seguros
1= Americano 1.15
2= Asiatico 1.05
3= Europeo 1.35

Y por cada year que el auto sea mas antiguo > Reducir un 3%

*/

//Constructor de Usuario

function UI(){
}
//Llena opciones de years (Prototype)
UI.prototype.llenarOpciones = ()=>{
    const max = new Date().getFullYear(),
    min = max - 20;
    const selectYear = document.querySelector('#year');
    for(let i=max; i > min; i--){
        let option = document.createElement('option');
        option.value = i; // Year donde estamos Iterando
        option.textContent = i; // Usuario va a ver los years
        selectYear.appendChild(option);
    }
}


// Muestra mensaje de Error (Prototype)

UI.prototype.mostrarMensaje = (mensaje,tipo)=>{

    const div = document.createElement ('div');
    
    if(tipo === 'error'){
        div.classList.add('mensaje','error');
    } else {
        div.classList.add('mensaje','correcto'); // Sacando del CSS para darle los estilos cargados
    }
    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro'); // En vez de crear formulario global, se puede colocar aqui
    formulario.insertBefore(div,document.querySelector('#resultado'));

    setTimeout(()=>{
    div.remove();
    },3000);
}

UI.prototype.mostrarResultado = (total,seguro)=>{
    
    const {marca,year,tipo} = seguro;// Destructuring para tomar marca,year y tipo
    let textoMarca;
    switch(marca){
        case '1' :
            textoMarca = 'Americano'
            break;
        
        case '2' :
            textoMarca = 'Asiatico'
            break;
        
        case '3' :
            textoMarca = 'Europeo'
            break;

        default:
            break;
    }
    // Crear resultado
    const div = document.createElement('div')
    div.classList.add('mt-10');

    div.innerHTML = `
    <p class="header">Tu Resumen</p>
    <p class="font-bold">Marca: <span class="font-normal">   ${textoMarca} </span></p>
    <p class="font-bold">Año: <span class="font-normal">   ${year} </span></p>
    <p class="font-bold">Tipo: <span class="font-normal capitalize">   ${tipo} </span></p>
    <p class="font-bold">Total: <span class="font-normal"> $ ${total} </span></p>
    `;
    const resultadoDiv = document.querySelector('#resultado');

    // Mostrar Spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout (()=>{
        spinner.style.display = 'none'; // Si ponemos remove se va a eliminar una vez que cotizemos otra vez, por eso el none
        resultadoDiv.appendChild(div); // Se ejecuta despues de que el Spinner fue eliminado
    },3000);
}
// Instanciar UI
const ui = new UI();

document.addEventListener("DOMContentLoaded",()=>{
    ui.llenarOpciones(); // Llena el select con Years
})
eventListeners();

// Adding a prototype a este selector va a consumir datos
function eventListeners(){
    const formulario = document.querySelector('#cotizar-seguro')
    formulario.addEventListener('submit',cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();

    // Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    
    // Leer year seleccionado
    const year = document.querySelector('#year').value;
    
    // Leer tipo de cobertura/Poliza
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    
    if(marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }
    ui.mostrarMensaje('Cotizando...', 'correcto');

    // Ocultar cotizaciones previas

    const resultados = document.querySelector('#resultado div'); // Selecciona el div dentro de resultado
    if(resultados != null){
        resultados.remove();
    }

    // Instanciando el seguro 
    const seguro = new Seguro(marca, year, tipo)
    const total = seguro.cotizarSeguro();

    // Utilizar el prototype que va a cotizar
    ui.mostrarResultado(total, seguro);

}

