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
        pintarHotelsDestacats();
    });
}

//pintar hotelesDestacados
function pintarHotelsDestacats(){
    var destacats = recuperarHotelsDestacats();
    var minPrecio;
    var simboloCurrency;
    var estrelles;
    for (objHotel of destacats){
        var objCerca = new Object(); //he de fer-ho així perque la funcio de currency siguie standard i la pugui emplear aqui tmb
        objCerca.hotel = objHotel; 
        objCerca.hab = objHotel.habitacions;
        estrelles = recuperarEstrelles(objCerca.hotel.estrelles);
        minPrecio = obtenerPreciomin(objCerca.hab);
        simboloCurrency = recuperarMoneda(objCerca);
        var StrHtml = "<div class=\"destacats\" id=\"" + objHotel.id + "\">";
        StrHtml += "<img src=\"" + objHotel.fotoPrinc + "\" alt=" + objHotel.nom + "\">";
        StrHtml += "<h3>" + objHotel.nom + " " + estrelles + "</h3>";
        StrHtml += "<p>" + objHotel.descripcio + "</p>";
        StrHtml += "<p class=\"precioDestacado\">DESDE: " + minPrecio + " " + simboloCurrency + "</p>";
        StrHtml += "<button type=\"button\" onclick=\"escriureNomHotel('" + objHotel.nom + "'); window.location.href='#titolPrinc';\">RESERVAR</button>";//pdte meter ancla, pasado a tomeu
        StrHtml += "</div>";

        document.getElementById("resultats").innerHTML += StrHtml;
    }
}

function escriureNomHotel(nomHotel){
    document.getElementById("nomHotel").value = nomHotel;
    realitzarcerca();
}

function recuperarHotelsDestacats(){
    var destacats = new Array();
    for (objHotel of llistatHotels){
        if (objHotel.destacar){
            destacats.push(objHotel);
        }
    }
    return destacats;
}

function obtenerPreciomin(habitacions){
    var minPreu;
    var auxPreu;
    for (hab of habitacions){
        for (tarifa of hab.tarifes.temporadaBaixa){
            auxPreu = tarifa.preu.base + tarifa.preu.comissio;
            if (minPreu == null || minPreu > auxPreu){
                minPreu = auxPreu;
            }
        }
    }
    return minPreu;
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
    //salta aviso si no han indicado un valor en las habitaciones
    if (document.getElementById("individual").checked == false && document.getElementById("doble").checked == false){
        alert("Per favor, indica el tipus d'habitació.");
        //oculto este elemento por si se ha hecho una búsqueda anterior
        document.getElementById("preu").style.display = "none";
    }
    else if(document.getElementById("nits").value == 0){
        alert("Per favor, indica el número de nits.");
        document.getElementById("nits").style.border = "2px solid red";
    }
    else{
        //Si ja hem fet alguna cerca, ocultam els resultats anteriors.
        borrarResultatsAnteriors();
        //Camps de la cerca
        var temporadaAlta = false;
        var nits = 0;
        var llistaPreus;
        //per si es cerca per nom de s'hotel
        var auxnomHotel = document.getElementById("nomHotel").value;
        var nomHotel = auxnomHotel.toLowerCase();
        //la var temporadAlta es un boolean, si lo que está en el parentesis se cumple se pondrá a true
        temporadaAlta = (getValorRadio("temporada") == "alta");
        nits = document.getElementById("nits").value;
        //carregam numNits al resum de la reserva
        document.getElementById("numNits").innerHTML = "Num de nits: " + document.getElementById("nits").value;
        //Quan feim una nova cerca, desmarcam tots els filtres seleccionats del lateral.
        desmarcarTotsElsFiltresDelLateral();

        llistatHotelsSeleccionats = new Array();
        //Per cada hotel que tenim a la llista
        for (objHotel of llistatHotels) {
            //convierto el nombre del hotel a minuculas para comparar
            var auxNom = objHotel.nom;
            var nomMin = auxNom.toLowerCase();
            if ((nomHotel == "" || nomHotel == null) || (nomHotel != "" && nomHotel == nomMin)){
                for (objHab of objHotel.habitacions) {
                    //Comprovarem els filtres de llits. Si concorden els llits de l'habitació cercarem pels altres filtres.
                    //segons la temporada, mostrarem uns preus o uns altres
                    if (temporadaAlta) {
                        llistaPreus = objHab.tarifes.temporadaAlta;
                    }
                    else{
                        llistaPreus = objHab.tarifes.temporadaBaixa;
                    }
                    if ((document.getElementById("doble").checked && (objHab.tipus == "Doble" || objHab.tipus == "Suite")) || document.getElementById("individual").checked && objHab.tipus == "Individual"){
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

                        //ocultamos el buscador y muestro un boton para hacer una nueva búsqueda
                        document.getElementById("cercador").style.display = "none";
                        document.getElementById("opcionesEncontradas").style.display = "block";
                    }
                }
            }
        }
        //si no hi ha hotels, activam el div de notrobat
        if (llistatHotelsSeleccionats == null || llistatHotelsSeleccionats.length == 0){
            document.getElementById("notrobat").style.display = "block";
        }
        //amb aquest else ho tornam a ocultar si tornam a fer una cerca amb resultats
        else{
            document.getElementById("notrobat").style.display = "none";
            document.getElementById("opcionesEncontradas").children[0].innerHTML = "S'han trobat " + llistatHotelsSeleccionats.length + " hotels amb els criteris de cerca."
        }
    }
}

function resetBusqueda(){
    //borramos búsqueda anterior
    borrarResultatsAnteriors();
    //desmarcam filtres laterals
    desmarcarTotsElsFiltresDelLateral();
    //eliminam seleccio des cercador
    document.getElementById("individual").checked = false;
    document.getElementById("doble").checked = false;
    document.getElementById("nits").value = "";
    document.getElementById("numNits").innerHTML = "Num de nits: ";
    document.getElementById("nomHotel").value = "";
    //cargo nuevamente hoteles destacados
    document.getElementById("resultats").innerHTML += "<h2 id=\"destacatsh2\">HOTELS DESTACATS</h2>";
    pintarHotelsDestacats();
    //mostramos el buscador
    document.getElementById("cercador").style.display = "block";
    //oculto cabecera resultados
    document.getElementById("opcionesEncontradas").style.display = "none";
    //reseteo valores de la cesta
    document.getElementById("preuValor").value = 0;
    document.getElementById("preuMoneda").innerText = "";
    //oculto cesta de compra
    document.getElementById("preu").style.display = "none";
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

        if (llistatHotelsSeleccionatsFiltrats == null || llistatHotelsSeleccionatsFiltrats.length == 0){
            document.getElementById("notrobat").style.display = "block";
            document.getElementById("preu").style.display = "none";
        }
        else{
            document.getElementById("notrobat").style.display = "none";
            document.getElementById("opcionesEncontradas").children[0].innerHTML = "S'han trobat " + llistatHotelsSeleccionatsFiltrats.length + " hotels amb els criteris de cerca."
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

    //recupero simbolo estrellas
    var estrelles = recuperarEstrelles(objInformacioElement.hotel.estrelles);

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
    StrHtml += "<h3 class=\"titolHotel\"><strong>" + objInformacioElement.hotel.nom + "</strong></h3><label class=\"estrelles\"><strong>" + estrelles + "</strong></label>";
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
    StrHtml += "<input type=\"number\" id=\"" + objInformacioElement.hotel.id + "_" + objInformacioElement.hab.id + "_" + objInformacioElement.temporadaAlta + "_" + objInformacioElement.tarifa.preu.agregadorId + "\" min=0 />";
    StrHtml += "<button type=\"button\" onclick=\"seleccionarHabitacio('" + objInformacioElement.hotel.nom + "'," + objInformacioElement.hotel.id + "," + objInformacioElement.hab.id + ",'" + objInformacioElement.hab.tipus + "'," + objInformacioElement.temporadaAlta + ",'" + objInformacioElement.tarifa.preu.agregadorId + "'," + objInformacioElement.tarifa.preu.total +  ",'" + simboloCurrency + "')\" >Seleccionar</button>";
    StrHtml += "</div>";
    StrHtml += "</div>";
    StrHtml += "";

    document.getElementById("resultats").innerHTML += StrHtml;
}

function recuperarEstrelles(estrelles){
    var totalEstrelles = "";
    for (var i = 0; i < estrelles;i++){
        totalEstrelles += "*";
    }
    return totalEstrelles;
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
        serveisInclosos += "<li><i class=\"fas fa-parking\"></i>Parking</li>";
    }
    if (hotel.wifi){
        serveisInclosos += "<li><i class=\"fas fa-wifi\"></i>Wifi</li>";
    }
    if (hotel.animals){
        serveisInclosos += "<li><i class=\"fas fa-paw\"></i>S'admeten el següents animals: ";
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

function seleccionarHabitacio(hotelNom,hotelId, habId, habTipus, tempAlta, provId, preu, moneda) {
    //Si la llista no esta inicialitzada la inicialitzam;
    if (llistaHabitacionsSeleccionades == null) {
        llistaHabitacionsSeleccionades = new Array();
    }
    var numHabSeleccionades = parseInt(document.getElementById(hotelId + "_" + habId + "_" + tempAlta + "_" + provId).value);
    if (numHabSeleccionades > 0) {
        var habTrobada = comprobarhabSeleccionada(hotelId, habId);
        if (habTrobada == false){
            //si la hab no ha sido seleccionada todavia, la creo como objeto
            var habitacioSeleccionada = new Object();
            habitacioSeleccionada.hotelId = hotelId;
            habitacioSeleccionada.habId = habId;
            habitacioSeleccionada.tempAlta = tempAlta;
            habitacioSeleccionada.agregadorId = provId;
            habitacioSeleccionada.preu = preu;
            habitacioSeleccionada.numHabSeleccionades = numHabSeleccionades;
            habitacioSeleccionada.numNits = document.getElementById("nits").value;
            llistaHabitacionsSeleccionades.push(habitacioSeleccionada);

            var StrHtml = "<div id=\"hotelConfirmat_" + hotelId + "habId_" + habId + tempAlta + "\"><ul><li id=\"hotelid_" + hotelId + "_habId_" + habId + "\"><strong>" + hotelNom + "</strong></li></ul>";
            //en el a de a continuación pongo un #! para que no haga un scrollup al hacer el onclick
            StrHtml += "<label id=\"numHabitacions" + hotelId + "_habId_" + habId + "\">0</label><label id=\"seleccioHotelid_" + hotelId + "_habId_" + habId + "\"> x habitacio/ns tipus </label><a href=\"#!\" onclick=\"removeHab(" + hotelId + "," + habId + "," + tempAlta + "," + preu + ");\"><i class=\"fas fa-trash-alt\"></i></a></div>";
            document.getElementById("detallsHotel").innerHTML += StrHtml + "<hr>";
            var quantitat = document.getElementById(hotelId + "_" + habId + "_" + tempAlta + "_" + provId).value;
            document.getElementById("numHabitacions" + hotelId + "_habId_" + habId + "").innerText = quantitat;
            document.getElementById("seleccioHotelid_" + hotelId + "_habId_" + habId).innerHTML += habTipus;
        }
        else{
            //recupero el numero de hab indicadas en el input quantitat y se lo pinto en el numero de hab seleccionadas en ese hotel
            var quantitat = parseInt(document.getElementById(hotelId + "_" + habId + "_" + tempAlta + "_" + provId).value);
            var habActuals = parseInt(document.getElementById("numHabitacions" + hotelId + "_habId_" + habId).innerText);
            var total = quantitat + habActuals;
            document.getElementById("numHabitacions" + hotelId + "_habId_" + habId + "").innerText = total;
            //si la hab ya ha sido seleccionada, recupero el objeto e incremento la cantidad de habitaciones
            incrementNumHab(hotelId, habId, tempAlta, provId, preu, quantitat);
        }

        calcularPreuTotal();
        document.getElementById("preuMoneda").innerText = moneda;
        //deix buit s'input de quantitat de s'opcio seleccionada
        document.getElementById(hotelId + "_" + habId + "_" + tempAlta + "_" + provId).value = "";

    } else {
        alert("Selecciona alguna habitació");
    }
}

function calcularPreuTotal(){
    var suma = 0;
    for(hab of llistaHabitacionsSeleccionades){
        suma+= (hab.preu * hab.numHabSeleccionades)*document.getElementById("nits").value;
    }
    document.getElementById("preuValor").value = suma;
    dosDecimals("preuValor");
}

//funcio per incrementar el numero d'habitacions a un hotels ja seleccionat anteriorment
function incrementNumHab(hotelId, habId, tempAlta, provId, preu, quantitat){
    for (seleccio of llistaHabitacionsSeleccionades){
        if(seleccio.hotelId == hotelId && seleccio.habId == habId && seleccio.tempAlta == tempAlta && seleccio.agregadorId == provId && seleccio.preu == preu){
            seleccio.numHabSeleccionades += quantitat;
        }
    }
}

//funcio general per elimnar un element fill
function removeElement(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}

function removeHab(hotelId,habId,tempAlta,preu){
    //recupero el precio total
    var valorActual = parseFloat(document.getElementById("preuValor").value);
    var nits = document.getElementById("nits").value;
    //recupero el num. de habitaciones a restar
    var numHab = parseInt(document.getElementById("numHabitacions" + hotelId + "_habId_" + habId).innerText);
    //elimino la hab. seleccionada
    removeElement("hotelConfirmat_" + hotelId + "habId_" + habId + tempAlta);
    //resto precio actual del precio total
    document.getElementById("preuValor").value = valorActual - (preu * numHab * nits);//no aplica bien
    dosDecimals("preuValor");
    //elimino la seleccion de la lista de hab seleccionadas
    eliminarHotelLista(hotelId,habId,tempAlta,preu);
}

function eliminarHotelLista(hotelId,habId,tempAlta,preu){
    var trobat = false;
    var index = 0;
    while (trobat == false){
        if (llistaHabitacionsSeleccionades[index].hotelId == hotelId && llistaHabitacionsSeleccionades[index].habId == habId &&
            llistaHabitacionsSeleccionades[index].tempAlta == tempAlta && llistaHabitacionsSeleccionades[index].preu == preu){
                trobat = true;
        }
        else{
            index++;
        }
    }
    llistaHabitacionsSeleccionades.splice(index,index+1);
}

function comprobarhabSeleccionada(hotelId, habId){
    //compruevo si el elemento existe o no
    if(document.getElementById("hotelid_" + hotelId + "_habId_" + habId + "")){
        return true;
    }
    else{
        return false;
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

function accesoLogin(){
    var login = prompt("Indica el teu usuari per accedir a la intranet");
    if (login == null || login == "") {
        alert("No has indicat l'usuari");
    }
}

function conversorMoneda(){
    var euros = parseFloat(document.getElementById("preuValor").value);
    document.getElementById("preuMonedaConversio").innerHTML = (euros * 1.08) + " USD";
}