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
function mostrarElement(id) {
    /*
    <p class=\"informacioExtesa\" onclick=\"mostrarElement(id);\">Més informació</p>";
    */
    document.getElementById(id).style.display = "block";
}

//Per ocultar l'element
function tancarElement(element){
    element.parentElement.style.display = "none";
}

//Quan cliquen al botó de cercam. Executam aquesta funció.
function realitzarcerca() {
    //Si ja hem fet alguna cerca, ocultam els resultats anteriors.
    borrarResultatsAnteriors();
    //salta aviso si no han indicado un valor en las habitaciones
    if ((document.getElementById("individual").value == "" && document.getElementById("doble").value == "") ||
    (document.getElementById("individual").value == 0 && document.getElementById("doble").value == 0)){
        alert("Per favor, indica la quantitat d'habitacions a cercar");
        document.getElementById("individual").style.border = "2px solid red";
        document.getElementById("doble").style.border = "2px solid red";
        //oculto este elemento por si se ha hecho una búsqueda anterior
        document.getElementById("preu").style.display = "none";
    }
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
            //segons la temporada, mostrarem uns preus o uns altres
            if (temporadaAlta) {
                llistaPreus = objHab.tarifes.temporadaAlta;
            }
            else{
                llistaPreus = objHab.tarifes.temporadaBaixa;
            }

            if ((numDoble > 0 && (objHab.tipus == "Doble" || objHab.tipus == "Suite")) || numIndividual > 0 && objHab.tipus == "Individual"){
                var auxPreu;
                for (objPreu of llistaPreus){
                    //accedo a los precios de esa temporada
                    if (auxPreu == null || auxPreu.preu.total < objPreu.preu.total){
                        auxPreu = objPreu;
                    }
                }
                var objCerca = new Object();
                objCerca.hotel = objHotel;
                objCerca.hab = objHab;
                objCerca.tarifa = objPreu;
                objCerca.temporadaAlta = temporadaAlta;

                //Guardarem dins una llista les dades bàsiques per identificar l'hotel, habitació i preu.
                llistatHotelsSeleccionats.push(objCerca);
                pintarInformacioHotelHabPreu(objCerca);
            }
        }
    }
    if (llistatHotelsSeleccionats = null){
        document.getElementById("notrobat").style.display = "block";
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
                    case "filterParking":
                        //mayor que cero porqué sino hay hoteles no hay filtros que aplicar
                        if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                            llistaAuxiliar = new Array();
                            for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                if (hotelSeleccionat.hotel.parking) {
                                    llistaAuxiliar.push(hotelSeleccionat);
                                }
                            }
                            llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                        }
                        break;
                    case "filterWifi":
                        if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                            llistaAuxiliar = new Array();
                            for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                if (hotelSeleccionat.hotel.wifi) {
                                    llistaAuxiliar.push(hotelSeleccionat);
                                }
                            }
                            llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                         }
                        break;
                    case "filterAnimals":
                        if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                            llistaAuxiliar = new Array();
                            for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                if (hotelSeleccionat.hotel.animals) {
                                    llistaAuxiliar.push(hotelSeleccionat);
                                }
                            }
                            llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                        }
                        break;
                    case "filterCat":
                        alert("Idioma canviat a català.");
                        break;
                    case "filterCas":
                        alert("Idioma cambiado a castellano.");
                        break;
                    case "filterEus":
                        alert("hizkuntza aldatu zen euskarara.");
                        break;
                    case "filterBerenar":
                        if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                            llistaAuxiliar = new Array();
                            for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                for (dieta of hotelSeleccionat.hotel.dietes){
                                    if (dieta.nom == "Berenar") {
                                        llistaAuxiliar.push(hotelSeleccionat);
                                    }
                                }
                            }
                            llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                        }
                        break;
                    case "filterDinar":
                        if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                            llistaAuxiliar = new Array();
                            for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                for (dieta of hotelSeleccionat.hotel.dietes){
                                    if (dieta.nom == "Dinar") {
                                        llistaAuxiliar.push(hotelSeleccionat);
                                    }
                                }
                            }
                            llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                        }
                        break;
                    case "filterSopar":
                        if (llistatHotelsSeleccionatsFiltrats.length > 0) {
                            llistaAuxiliar = new Array();
                            for (hotelSeleccionat of llistatHotelsSeleccionatsFiltrats) {
                                for (dieta of hotelSeleccionat.hotel.dietes){
                                    if (dieta.nom == "Sopar") {
                                        llistaAuxiliar.push(hotelSeleccionat);
                                    }
                                }
                            }
                            llistatHotelsSeleccionatsFiltrats = llistaAuxiliar;
                        }
                        break;
                    default:
                    //no tomar accion
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

    //mostraré la cesta de compra
    document.getElementById("preu").style.display = "block";

    //me aseguro que los inputs no tienen border en rojo por aviso
    document.getElementById("individual").style.border = "none";
    document.getElementById("doble").style.border = "none";

    //sustituimos nombre moneda por simbolo
    var simboloCurrency = recuperarMoneda(objInformacioElement);

    //recupero los servicios includos para mostrarlos como info adicional
    var serveisInclosos = recuperarServeis(objInformacioElement.hotel);

    //recupero las fotos de la habitacion
    var imatgesHab = recuperarFotosHab(objInformacioElement.hab);

    //mostraré preu total sense iva, amb comissio inclosa
    var preuNet = objInformacioElement.tarifa.preu.base + objInformacioElement.tarifa.preu.comissio;

    var StrHtml = "<div class=\"habitacio\">";
    StrHtml += "<div class=\"imatgeHab\">";
    StrHtml += "<img class=\"imgMiniHab\" src=\"" + objInformacioElement.hab.fotosHabitacio[0] + "\" />";
    StrHtml += "</div>";
    StrHtml += "<div class=\"infoHab\">";
    StrHtml += "<h3 class=\"titolHotel\">" + objInformacioElement.hotel.nom + "</h3><label class=\"estrelles\">" + objInformacioElement.hotel.estrelles + " Estrelles" + "</label>";
    StrHtml += "<div class=\"hotelDescripcio\">" + objInformacioElement.hotel.descripcio + "</div>";
    //cuando enviamos un parametro cuyo nombre es una concatenación, el parametro debe ir entre comilla simple
    StrHtml += "<p class=\"informacioExtesa\" onclick=\"mostrarElement('hotel_id_" + objInformacioElement.hotel.id + "_hab_id_" + objInformacioElement.hab.id + "');\">Més informació</p>";
    StrHtml += "</div>";
    StrHtml += "<div class=\"preuHab\">";
    StrHtml += "<p class=\"informacioExtesa\">Hab. " + objInformacioElement.hab.tipus + "</p>";
    StrHtml += "<p>Preu: " + preuNet + " " + simboloCurrency + "</p>";
    StrHtml += "<p>Impostos " + objInformacioElement.tarifa.preu.impostPercent + "% </p>";
    StrHtml += "<p>Total: " + objInformacioElement.tarifa.preu.total + " " + simboloCurrency + "</p>";
    StrHtml += "</div>";
    StrHtml += "<div class=\"mesInfo\" id=\"hotel_id_" + objInformacioElement.hotel.id + "_hab_id_" + objInformacioElement.hab.id + "\">";
    StrHtml += "<h3 id=\"titolPrincmesInfo\">Foto Principal del Hotel</h3><label style=\"float: right;\" onclick=\"tancarElement(this);\">Tanca X</label>";
    StrHtml += "<img class=\"imgMiniHab\" style=\"clear: both;\"src=\"" + objInformacioElement.hotel.fotoPrinc + "\">";
    StrHtml += "<div id=\"mesInfoDesc\">";
    StrHtml += "<p>" + objInformacioElement.hab.descripcio + "</p>";
    StrHtml += "<h4>Serveis inclosos:</h4><hr>";
    StrHtml += serveisInclosos;
    StrHtml += "</div>";
    StrHtml += "<div id=\"fotosHab\">";
    StrHtml += "<h3 style=\"text-align: center;\">Més fotos de s'habitació:</h3>";
    StrHtml += imatgesHab;
    StrHtml += "</div>";
    StrHtml += "</div>";
    StrHtml += "<div class=\"seleccionar\">";
    StrHtml += "<label>Quantitat: </label>";
    StrHtml += "<input type=\"number\" id=\"" + objInformacioElement.hotel.id + "_" + objInformacioElement.hab.id + "_" + objInformacioElement.temporadaAlta + "_" + objInformacioElement.tarifa.preu.agregadorId + "\" />";
    StrHtml += "<button type=\"button\" onclick=\"seleccionarHabitacio(" + objInformacioElement.hotel.id + "," + objInformacioElement.hab.id + "," + objInformacioElement.temporadaAlta + ",'" + objInformacioElement.tarifa.preu.agregadorId + "'," + objInformacioElement.tarifa.preu.total + ")\" >Seleccionar</button>";
    StrHtml += "</div>";
    StrHtml += "</div>";
    StrHtml += "";

    document.getElementById("resultats").innerHTML += StrHtml;
}

function recuperarFotosHab(habitacio){
    var imatgesHab = "";
    imatgesHab += "<div>";
    for (foto of habitacio.fotosHabitacio){
        imatgesHab += "<img class=\"imgMiniHab\" src=\"" + foto + "\">";
    }
    imatgesHab += "</div>";
    return imatgesHab;
}

function recuperarServeis(hotel){
    var serveisInclosos = "<ul>";
    if (hotel.parking){
        serveisInclosos += "<li>Parking</li>";
    }
    if (hotel.wifi){
        serveisInclosos += "<li>Wifi</li>";
    }
    if (hotel.animals){
        serveisInclosos += "<li>S'admeten el següents animals: ";
        for (var i=0; i<hotel.llistaMascotes.length;i++){
            serveisInclosos += hotel.llistaMascotes[i];
            if (i != hotel.llistaMascotes.length-1){
                serveisInclosos += ", ";
            }
        }
        serveisInclosos += "</li>";
    }
    serveisInclosos += "</ul>";
    return serveisInclosos;
}

function recuperarMoneda(objInformacioElement){
    if (objInformacioElement.hotel.moneda == "Euro"){
        simboloCurrency = "€";
    } else if(objInformacioElement.hotel.moneda == "Dolar"){
        simboloCurrency = "$";
    }
    else if(objInformacioElement.hotel.moneda == "Lliura"){
        simboloCurrency = "£";
    }
    return simboloCurrency;
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

//funcio general per resetejar styles
function resetStyle(element){
    element.style.border = "none";
}