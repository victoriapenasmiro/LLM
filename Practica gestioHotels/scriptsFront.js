//Llita dels hotels carregats del Json
var llistatHotels;
//Llita dels hotels resultat de la cerca
var llistatHotelsSeleccionats;
//Llita dels hotels resultat de la cerca i filtres
var llistatHotelsSeleccionatsFiltrats;
//llista d'habitacions seleccionades.Que necessitarem per calcular el preu total
var llistaHabitacionsSeleccionades;

//Funció per carregar Json
function loadJSON(callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    //Molt alerta! si la url es un fitxer local no ens funcionarà sense canviar els permisos del navegador. Per aquest motiu ho he pujat a un fitxer de gitHub.
    xobj.open('GET', 'https://raw.githubusercontent.com/victoriapenasmiro/LLM/master/Practica%20gestioHotels/3hotelsdata.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

//Functio per defecte per carregar el Json.
function init() {
    loadJSON(function (response) {
        // Parse JSON string into object
        objJson = JSON.parse(response);
        llistatHotels = objJson.hotels;
    });
}

//Borram tots els resultats d'una cerca anterior.
function borrarResultatsAnteriors() {
    document.getElementById("resultats").innerHTML = "";
}

//Desmarcam tots els filtres del lateral.
function desmarcarTotsElsFiltresDelLateral() {
    //Seleccionam tots els filtre per la classe.
    var filtres = document.getElementsByClassName("filtre");
    for (filtre of filtres) {
        filtre.checked = false;
    }
}

//Per mostrar el div de més info.
function mostrarElement(elementActual) {
    /*
     <div>
        <a href="mostrarElement()">Més informació</a>
        <div class="mesInfo">Mostrariem més informació</div>
     </div>
    */
    //Cercarem l'element sense id. Cercarem per classe de l'element pare
    var llistaElements = elementActual.parentElement.getElementsByClassName("mesInfo");
    //la llista d'elements ha de ser 1.
    llistaElements[0].style.display = "block";
}

//Quan cliquen al botó de cercam. Executam aquesta funció.
function realitzarcerca() {
    //Si ja hem fet alguna cerca, ocultam els resultats anteriors.
    borrarResultatsAnteriors();
    //Camps de la cerca
    var temporadaAlta = false;
    var numIndividual = 0;
    var numDoble = 0;
    var llistaPreus;
    //la var temporadAlta es un boolean, si lo que está en el parentesis se cumple se pondrá a true
    temporadaAlta = (getValorRadio("temporada") == "alta");
    numIndividual = document.getElementById("individual").value;
    numDoble = document.getElementById("doble").value;

    //Quan feim una nova cerca, desmarcam tots els filtres seleccionats del lateral.
    desmarcarTotsElsFiltresDelLateral();


    llistatHotelsSeleccionats = new Array();
    //Per cada hotel que tenim a la llista
    for (objHotel of llistatHotels) {
        for (objHab of objHotel.habitacions) {
            //Comprovarem els filtres de llits. Si concorden els llits de l'habitació cercarem pels altres filtres.
            if (temporadaAlta) {
                //segons la temporada, mostrarem uns preus o uns altres
                llistaPreus = objHab.tarifes.temporadaAlta;
            }
            else{
                llistaPreus = objHab.tarifes.temporadaBaixa;
            }

            if (numIndividual > 0 && objHab.tipus == "Individual"){
                for (objPreu of llistaPreus){
                    //accedo a los precios de esa temporada
                    var objCerca = new Object();
                    objCerca.hotel = objHotel;
                    objCerca.hab = objHab;
                    objCerca.preu = objPreu;
                    objCerca.temporadaAlta = temporadaAlta;

                    //Guardarem dins una llista les dades bàsiques per identificar l'hotel, habitació i preu.
                    llistatHotelsSeleccionats.push(objCerca);
                    var index = llistatHotelsSeleccionats.length;
                    pintarInformacioHotelHabPreu(objCerca, index);
                }
            }

            if (numDoble > 0 && (objHab.tipus == "Doble" || objHab.tipus == "Suite")){//no pongo else if porqué podría enseñar el mismo hotel, su hab individual y su doble
                for (objPreu of llistaPreus){
                    //accedo a los precios de esa temporada
                    var objCerca = new Object();
                    objCerca.hotel = objHotel;
                    objCerca.hab = objHab;
                    objCerca.preu = objPreu;
                    objCerca.temporadaAlta = temporadaAlta;

                    //Guardarem dins una llista les dades bàsiques per identificar l'hotel, habitació i preu.
                    llistatHotelsSeleccionats.push(objCerca);
                    var index = llistatHotelsSeleccionats.length;
                    pintarInformacioHotelHabPreu(objCerca, index);
                }
            }
        }
    }
}

function aplicarFiltres() {
    /*
     var objCerca = new Object();
    objCerca.hotel = objHotel;
    objCerca.hab = objHab;
    objCerca.preu = objPreu;
    */
    //Si la cerca no te resultats, no fa falta filtrar res.
    if (llistatHotelsSeleccionats != null && llistatHotelsSeleccionats.length > 0) {
        //Revisarem la llista de checksbox que tenim

        llistatHotelsSeleccionatsFiltrats = llistatHotelsSeleccionats;
        var llistaAuxiliar;
        for (oFiltre of document.getElementsByClassName("filtre")) {
            //Revisarem els que estan marcats.
            if (oFiltre.checked) {
                switch (oFiltre.id) {
                    case "filterGym":
                        //Com a l'exemple no tenc gym he fet un filtre damunt el nom. Per treure l'hotel Prova 3. Això només és per mostrar-vos un exemple.
                        if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                            llistaAuxiliar = new Array();
                            for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                if (hotelSeleccionat.hotel.nom == "Prova 3") {
                                    llistaAuxiliar.push(hotelSeleccionat);
                                }
                            }
                            llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                        }

                        break;
                    case "habitacioMinibar":
                        /* if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                             llistaAuxiliar = new Array();
                             for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                 if (hotelSeleccionat.hab.minibar == true) {
                                     llistaAuxiliar.push(hotelSeleccionat);
                                 }
                             }
                             llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                         }*/
                        break;
                    case "servei":
                        /*if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                            llistaAuxiliar = new Array();
                            for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                for (servei of hotelSeleccionat.hotel.serveis) {
                                    if (servei.valorDelServei == true) {
                                        llistaAuxiliar.push(hotelSeleccionat);
                                    }
                                }
                            }
                            llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                        }*/
                        break;
                    default:

                }
            }
        }

        borrarResultatsAnteriors();
        for (objCerca of llistatHotelsSeleccionatsFiltrats) {
            pintarInformacioHotelHabPreu(objCerca);
        }

    }
}

//Pintar la informació al Html.
//Del hotel no hem de consultar les habitacions, ja que la seleccionada la tenim com a parametre.
//De la habitacio no hem de consultar els preus, ja que el seleccionat el tenim com parametre.
function pintarInformacioHotelHabPreu(objInformacioElement) {
    /*
    var objCerca = new Object();
    objCerca.hotel = objHotel;
    objCerca.hab = objHab;
    objCerca.preu = objPreu;
    */
    var tempAlta = false;

    var StrHtml = "<div class=\"habitacio\">";
    StrHtml += "<div class=\"imatgeHab\">";
    /*hem d'agar es link de sa imatge de s'objecte - actualitzar json per agafar les pujades a github*/
    StrHtml += "<img class=\"imgMiniHab\" src=\"" + objInformacioElement.hotel.fotoPrinc + "\" />";
    StrHtml += "</div>";
    StrHtml += "<div class=\"infoHab\">";
    StrHtml += "<h3 class=\"titolHotel\">" + objInformacioElement.hotel.nom + "</h3><label class=\"estrelles\">" + objInformacioElement.hotel.estrelles + "Estrelles" + "</label>";
    StrHtml += "<div class=\"hotelDescripcio\">";
    StrHtml += objInformacioElement.hotel.descripcio;
    StrHtml += "</div>";
    StrHtml += "<div class=\"preuHab\">";
    //en mi caso la moneda está a nivel de hotel
    StrHtml += "<p>Preu " + (objInformacioElement.preu.base + objInformacioElement.preu.comissio) + " " + objInformacioElement.hotel.moneda + "</p>";
    StrHtml += "<p>Impostos " + objInformacioElement.preu.impostPercent + "% </p>";
    StrHtml += "<p>Preu Total " + objInformacioElement.preu.total + " </p>";
    StrHtml += "<p class=\"informacioExtesa\ onclick=\"mostrarElement(this)\">Més informació</p>";
    StrHtml += "</div>";
    StrHtml += "<div class=\"mesInfo\">Mostrariem més informació</div>";
    StrHtml += "<div class=\"seleccionar\">";
    StrHtml += "<label>Quantitat:</label>";
    StrHtml += "<input type=\"number\" id=\"" + objInformacioElement.hotel.id + "_" + objInformacioElement.hab.id + "_" + objInformacioElement.temporadaAlta + "_" + objInformacioElement.preu.agregadorId + "\" />";
    StrHtml += "<button type=\"button\" onclick=\"seleccionarHabitacio(" + objInformacioElement.hotel.id + "," + objInformacioElement.hab.id + "," + objInformacioElement.temporadaAlta + ",'" + objInformacioElement.preu.agregadorId + "'," + objInformacioElement.preu.total + ")\" >Seleccionar. </button>";
    StrHtml += "</div>";
    StrHtml += "</div>";
    StrHtml += "";

    document.getElementById("resultats").innerHTML += StrHtml;
}

function seleccionarHabitacio(hotelId, habId, tempAlta, preuProv, preuValor) {

    //Si la llista no esta inicialitzada la inicialitzam;
    if (llistaHabitacionsSeleccionades == null) {
        llistaHabitacionsSeleccionades = new Array();
    }

    var valorActual = parseFloat(document.getElementById("preuValor").innerText);
    var numHabActual = parseInt(document.getElementById("numHabitacions").innerText);

    var numHabSeleccionades = parseInt(document.getElementById(hotelId + "_" + habId + "_" + tempAlta + "_" + preuProv).value);

    if (numHabSeleccionades > 0) {
        document.getElementById("numHabitacions").innerText = numHabActual + numHabSeleccionades;
        document.getElementById("preuValor").innerText = valorActual + (preuValor * numHabSeleccionades);

        var habitacioSeleccionada = new Object();
        habitacioSeleccionada.hotelId = hotelId;
        habitacioSeleccionada.habId = habId;
        habitacioSeleccionada.tempAlta = tempAlta;
        habitacioSeleccionada.preuProv = preuProv;
        habitacioSeleccionada.numHabSeleccionades = numHabSeleccionades;
        llistaHabitacionsSeleccionades.push(habitacioSeleccionada);

    } else {
        alert("Selecciona alguna habitació");
    }
}

/**************
Funció genèrica per recuperar valors d'un radiobutton.
nomRadio es el name del radio <input type="radio" name="aquest nom" id="id" />
*********/
function getValorRadio(nomRadio) {
    //obtenim la llista de inputs que tenen el mateix nom
    var radios = document.getElementsByName(nomRadio);
    //recorrem els inputs amb el mateix nom per recuperar el valor del seleccionat.
    for (radio of radios) {
        //si el radio està activat
        if (radio.checked) {
            //retornam el seu valor
            return radio.value;
        }
    }
    //En cas de no haver cap activat retornam "";
    return "";
}

function continuar() {
    if (llistaHabitacionsSeleccionades == null || llistaHabitacionsSeleccionades.length == 0) {
        alert("No hi ha cap habitació seleccionada");
    } else {
        var jsonString = JSON.stringify(llistaHabitacionsSeleccionades);
        document.getElementById("parJson").value = jsonString;
        document.getElementById("dispo").submit();
    }
}