
//variable global
var comptadorHotels = 0;

//Generar el Json del llitat d'hotels.
function generarJsonHotels() {
    var llistaHotels = new Array();

    //Cada input hiden te el class jsonHotel. El getElementsByClassName ens retorna una llista d'elements.
    //Els recorrerem per recollir le dades dels hotels.
    var liHotels = document.getElementsByClassName("jsonHotel");
    //Comprovem si en tenim algún.
    if (liHotels != null) {
        for (var i = 0; i < liHotels.length; i++) {    
            elementHotel =  liHotels.item(i);
            var objHotel = new Object();
            objHotel = JSON.parse(elementHotel.value);               
            llistaHotels.push(objHotel);
        }
    }
    var jsonString = JSON.stringify(llistaHotels);
    document.getElementById("JsonText").innerText = jsonString;
    //convierto el campo a solo lectura
    document.getElementById("JsonText").readOnly = "true";
}

/************
Funció auxiliar per quan afegim o modificam un hotel.
Revisarem si les dades estan completades correctament.
Es podria fer amb subfuncions per controlar els diferents tipus de dades. Strings, numerics etc.
**************/
function controlDeLesDades() {
    let strErrors = "";

    //Si el nom no l'han introduit serà error.
    if (document.getElementById("nomHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Nom no introduït\n";
        document.getElementById("nomHotel").style.backgroundColor = "#ff000078";
    }

    if (document.getElementById("estrellesHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Número d'estrelles no introduït\n";
        document.getElementById("estrellesHotel").style.backgroundColor = "#ff000078";
    }

    if (document.getElementById("descHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Descripció de s'hotel no introduïda\n";
        document.getElementById("descHotel").style.backgroundColor = "#ff000078";
    }

    if (document.getElementById("emailHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "E-mail no introduït\n";
        document.getElementById("emailHotel").style.backgroundColor = "#ff000078";
    }
    //controlo que la direccion de correo es correcta con expresiones regulares
    else if (!validar_email(document.getElementById("emailHotel").value)){
        strErrors += "La direcció d'email " + document.getElementById("emailHotel").value + " és incorrecta.";
        document.getElementById("emailHotel").style.backgroundColor = "#ff000078";
    }

    if (document.getElementById("tlfHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Telèfon no introduït\n";
        document.getElementById("tlfHotel").style.backgroundColor = "#ff000078";
    }
    /*valido que el formato del telefono sea: Prefijo internacional (+ seguido de 2 o 3 cifras),
    espacio en blanco y 9 cifras consecutivas*/
    else if (!/^\+\d{2,3}\s\d{9}$/.test(document.getElementById("tlfHotel").value)){
        strErrors += "El telèfon introduït no està en el format requerit\n";
        document.getElementById("tlfHotel").style.backgroundColor = "#ff000078";
    }

    if (document.getElementById("direccioHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Direcció no introduida\n";
        document.getElementById("direccioHotel").style.backgroundColor = "#ff000078";
    }

    if (document.getElementById("codiPostalHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Codi postal no introduït\n";
        document.getElementById("codiPostalHotel").style.backgroundColor = "#ff000078";
    }

    else if (document.getElementById("codiPostalHotel").value > 99999 ||
    document.getElementById("codiPostalHotel").value < 0){
        strErrors += "El codi postal introduït no existeix\n";
        document.getElementById("codiPostalHotel").style.backgroundColor = "#ff000078";
    }

    if (document.getElementById("ciutatHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Ciutat no introduïda\n";
        document.getElementById("ciutatHotel").style.backgroundColor = "#ff000078";
    }

    if (document.getElementById("preuBaseBerenar").value < 0 || document.getElementById("impostPreuBerenar").value < 0) {
        //El \n és un bot de linea.
        strErrors += "Els preus indicats pel berenar no són valids\n";
        document.getElementById("preuBaseBerenar").style.backgroundColor = "#ff000078";
        document.getElementById("impostPreuBerenar").style.backgroundColor = "#ff000078";
    }

    if(document.getElementById("preuBaseDinar").value < 0 || document.getElementById("impostPreuDinar").value < 0){
        strErrors += "Els preus indicats pel dinar no són valids\n";
        document.getElementById("preuBaseDinar").style.backgroundColor = "#ff000078";
        document.getElementById("impostPreuDinar").style.backgroundColor = "#ff000078";
    }

    if(document.getElementById("preuBaseSopar").value < 0 || document.getElementById("impostPreuSopar").value < 0){
        strErrors += "Els preus indicats pel sopar no són valids\n";
        document.getElementById("preuBaseSopar").style.backgroundColor = "#ff000078";
        document.getElementById("impostPreuSopar").style.backgroundColor = "#ff000078";
    }
    
    if(document.getElementById("fotoHotel").value != "" && !validarURL(document.getElementById("fotoHotel").value)){
        strErrors += "L'enllaç de sa imatge no és correcte";
        document.getElementById("fotoHotel").style.backgroundColor = "#ff000078";
    }

    if(document.getElementById("advisorHotel").value != "" && !validarURL(document.getElementById("advisorHotel").value)){
        strErrors += "L'enllaç de Tripadvisor indicat no és correcte.";
        document.getElementById("advisorHotel").style.backgroundColor = "#ff000078";
    }

    return strErrors;
}

//Generar l'objecte d'un hotel amb les dades introduides.
function generarObjHotel(id) {
    let hotel = new Object();
    hotel.id = id;
    hotel.nom = document.getElementById("nomHotel").value;
    hotel.estrelles = parseInt(document.getElementById("estrellesHotel").value);
    hotel.descripcio = document.getElementById("descHotel").value;
    hotel.email = document.getElementById("emailHotel").value;
    hotel.tel = document.getElementById("tlfHotel").value;
    hotel.direccio = document.getElementById("direccioHotel").value;
    hotel.codiPostal = parseInt(document.getElementById("codiPostalHotel").value);
    hotel.ciutat = document.getElementById("ciutatHotel").value;
    hotel.parking = document.getElementById("parkingHotel").checked;
    hotel.wifi = document.getElementById("wifiHotel").checked;
    hotel.animals = document.getElementById("animalAdmesos").checked;
    hotel.dietes = getDietes();
    hotel.moneda = document.getElementById("idMoneda").value;
    hotel.llistaMascotes = getMascotes();
    hotel.fotoPrinc = document.getElementById("fotoHotel").value;
    hotel.puntuacioBooking = parseInt(document.getElementById("puntuacioBooking").value);//hay que convertir a numero para que se conviera bien en el json, revisar todos los atributos afectados.
    hotel.advisorHotel = document.getElementById("advisorHotel").value;
    return hotel;
}

function getDietes() {
    let dietes = new Array();
    let tipus = ["Berenar", "Dinar", "Sopar"];
    for (auxTipus of tipus){
        if (document.getElementById(auxTipus).checked) {
            let preu = new Object();
            preu.nom = document.getElementById(auxTipus).value;
            preu.base = parseFloat(document.getElementById("preuBase" + auxTipus).value);
            preu.impostPercent = parseFloat(document.getElementById("impostPreu" + auxTipus).value);
            preu.total = parseFloat(document.getElementById("total" + auxTipus).value);
            preu.moneda = document.getElementById("moneda" + auxTipus).value;
            dietes.push(preu);
        }
    }
    return dietes;
}

//és fer la inversa del getDietes.
function setDietes(dietes) {        
    //Per cada dieta. Ho faré amb un for amb i. Però lo seu seria for (auxDieta of dietes)
    //Total no necessitam la i per res més que per iterar.
    let i;
    //En el cas de tenir un objecte és que aquest està seleccionat. Per tant l'hem de seleccionar.    
    for (i = 0; i < dietes.length; i++) {
        let preu = dietes[i] //es un objeto
        let nomTipusSeleccionat = preu.nom; //accedo al atributo nom
        document.getElementById(nomTipusSeleccionat).checked = true; //al get getDietes revisavem si era true, aquí l'assignam a true.
        document.getElementById("preuBase" + nomTipusSeleccionat).value = preu.base; // Tots aquests camps són com get Dietes però l'assignació a l'inversa.
        document.getElementById("impostPreu" + nomTipusSeleccionat).value = preu.impostPercent;
        document.getElementById("total" + nomTipusSeleccionat).value = preu.total;
        document.getElementById("moneda" + nomTipusSeleccionat).value = preu.moneda;
        document.getElementById("preus"+nomTipusSeleccionat).style.display = "inline";
    }    
}

function getMascotes(){
    var mascotes = new Array ();
    var opt;
    for (let i=0; i<document.getElementById("mascotes").length; i++) {
        opt = document.getElementById("mascotes")[i];
        if (opt.selected) {
          mascotes.push(opt.value);
        }
    }
    return mascotes;
}

//Funció genèrica per seleccionar selects multiples. 
function setMascotes(nomInput, valorsSeleccionats) {
    var multiSel = document.getElementById(nomInput);
    for (opcio of multiSel.options) {
        //indexOf per trobar un caracter dins un string. O un string dins una llista. returns -1 si no troba sa string
        opcio.selected = valorsSeleccionats.indexOf(opcio.value) >= 0;
    }
}

function controlMascotes() {
    if (document.getElementById("animalAdmesos").checked == true) {                
        document.getElementById("dvMascotes").style.display = "block";
    } else {
        document.getElementById("dvMascotes").style.display = "none";
    }
}

function controlDietes(dieta,preu) {
    if (document.getElementById(dieta).checked == true) {                
        document.getElementById(preu).style.display = "inline";
    } else {
        document.getElementById(preu).style.display = "none";
    }
}

function asignarMoneda(id) {
    var moneda = document.getElementsByName("monedes")[0];
    moneda.addEventListener('input',function(){
        document.getElementById(id).innerHTML = this.value;
    });
}

function calcularTotal(base,impost,total) {
    var base = document.getElementById(base).value;
    var impost = 1+(document.getElementById(impost).value/100);
    document.getElementById(total).value = base*impost;
}

function dosDecimals(dieta) {
    document.getElementById(dieta).value = parseFloat(document.getElementById(dieta).value).toFixed(2);
}

//Afegirem un hotel. Controlarem si les dades són correctes i el ficarem a la llista i generarem el Json.
function afegirHotel() {
    var dadesCompletes = controlDeLesDades();
    var idLlista = comptadorHotels;
    comptadorHotels += 1;
    if (dadesCompletes == "") {
        var objHotel = generarObjHotel(idLlista);
        //Crearem un element més a la llista d'hotels
        var strHtmlHotel = "<tr id=\"liHotel" + idLlista + "\">";
        //Crearem un input hidden. Com un text, però no visible per guardar el Json de l'hotel. Posam s'input hidden i sa label juntes, a sa mateixa celda
        strHtmlHotel += "<td><label id=\"lblNomHot" + idLlista + "\" class=\"liStyle\" >" + objHotel.nom +
        "</label><input type=\"hidden\" class=\"jsonHotel\" id=\"jsonHotel" + idLlista + "\" value=\"\" /></td>";
        //Crearem un botó per eliminar l'hotel
        strHtmlHotel += "<td><img src=\"https://image.flaticon.com/icons/png/512/16/16367.png\" height=\"20\" alt=\"logo papelera\" onclick=\"eliminarHotel(" + idLlista + ")\"></td>";
        //Crearem un botó per modificar l'hotel
        strHtmlHotel += "<td><img src=\"https://image.flaticon.com/icons/png/512/23/23187.png\" height=\"20\" alt=\"logo papelera\" onclick=\"modificarHotel(" + idLlista + ")\"></td>";
        strHtmlHotel += "</tr>";
        var jsonHotel = JSON.stringify(objHotel);
        document.getElementById("llistaHotels").innerHTML += strHtmlHotel;
        //Asignam el json al input hidden del hotel. Ho faig aquí així no he de fer el parse de les ". Ja ho fa javascript automàtic.
        document.getElementById("jsonHotel" + idLlista).value = jsonHotel;
        document.getElementById("noHotels").style.display = "none";
        netejarCamps();
        alert("Afegit correctament");
    } else {
        alert("Falten dades per completar:\n" + dadesCompletes);
    }
}

//Modificació de les dades d'un hotel.
function desarModificacioHotel() {
    var idLlista = document.getElementById("idHotel").value;
    var dadesCompletes = controlDeLesDades();
    if (dadesCompletes == "") {
        var objHotel = generarObjHotel(idLlista);
        document.getElementById("lblNomHot" + idLlista).value = objHotel.nom;
        document.getElementById("lblNomHot" + idLlista).innerHTML = objHotel.nom;//actualizo el nombre del front, por si cambia
        var jsonHotel = JSON.stringify(objHotel);
        document.getElementById("jsonHotel" + idLlista).value = jsonHotel;
        netejarCamps();
    }else {
        alert("Falten dades per completar:\n" + dadesCompletes);
    }
}

//Carregam les dades al main i preparam el botons per desar modificacions i no ficar un nou hotel
function modificarHotel(idLi) {
    let objHotel = new Object();
    objHotel = JSON.parse(document.getElementById("jsonHotel" + idLi).value);
    document.getElementById("idHotel").value = idLi;
    document.getElementById("nomHotel").value = objHotel.nom;
    document.getElementById("estrellesHotel").value = objHotel.estrelles;
    document.getElementById("descHotel").value = objHotel.descripcio;
    document.getElementById("emailHotel").value = objHotel.email;
    document.getElementById("tlfHotel").value = objHotel.tel;
    document.getElementById("direccioHotel").value = objHotel.direccio;
    document.getElementById("codiPostalHotel").value = objHotel.codiPostal;
    document.getElementById("ciutatHotel").value = objHotel.ciutat;
    
    if (objHotel.dietes != null && objHotel.dietes.length > 0) {
        setDietes(objHotel.dietes);//envio el array de objetos
    }
    document.getElementById("idMoneda").value = objHotel.moneda;
    document.getElementById("parkingHotel").checked = objHotel.parking;
    document.getElementById("wifiHotel").checked = objHotel.wifi;
    document.getElementById("animalAdmesos").checked = objHotel.animals;

    if (objHotel.llistaMascotes != null && objHotel.llistaMascotes.length > 0) {
        document.getElementById("dvMascotes").style.display = "block";
        setMascotes("mascotes", objHotel.llistaMascotes);
    }

    document.getElementById("fotoHotel").value = objHotel.fotoPrinc;
    document.getElementById("puntuacioBooking").value = objHotel.puntuacioBooking;
    document.getElementById("textInputBooking").value = objHotel.puntuacioBooking;
    document.getElementById("advisorHotel").value = objHotel.advisorHotel;
    document.getElementById("modificar").style.display = "inline";
    document.getElementById("afegir").style.display = "none";
}

//Deixam tots els camps sense valors, per realitzar la pròxima operació.
function netejarCamps() {
    var inputs, index;
    //recuper un array amb tots els inputs
    inputs = document.getElementsByTagName("input");
    for (index = 0; index < inputs.length; ++index) {
        if(inputs[index].type != "checkbox"){
            inputs[index].style.backgroundColor = "white";
        }
    }
    document.getElementById("nomHotel").value = "";
    document.getElementById("estrellesHotel").value = 0;
    document.getElementById("descHotel").value = "";
    document.getElementById("descHotel").style.backgroundColor = "white";
    document.getElementById("idHotel").value = "";
    document.getElementById("emailHotel").value = "";
    document.getElementById("tlfHotel").value = "";
    document.getElementById("direccioHotel").value = "";
    document.getElementById("codiPostalHotel").value = "";
    document.getElementById("ciutatHotel").value = "";
    document.getElementById("ciutatHotel").style.backgroundColor = "white";
    document.getElementById("parkingHotel").checked = false;
    document.getElementById("Berenar").checked = false;
    document.getElementById("preuBaseBerenar").value = "";
    document.getElementById("impostPreuBerenar").value = "";
    document.getElementById("totalBerenar").value = "";
    document.getElementById("monedaBerenar").innerHTML = "Euro";
    document.getElementById("Dinar").checked = false;
    document.getElementById("preuBaseDinar").value = "";
    document.getElementById("impostPreuDinar").value = "";
    document.getElementById("totalDinar").value = "";
    document.getElementById("monedaDinar").innerHTML = "Euro";
    document.getElementById("Sopar").checked = false;
    document.getElementById("preuBaseSopar").value = "";
    document.getElementById("impostPreuSopar").value = "";
    document.getElementById("totalSopar").value = "";
    document.getElementById("monedaSopar").innerHTML = "Euro";
    document.getElementById("idMoneda").value = "";; //no consigo vaciar el datalist
    document.getElementById("wifiHotel").checked = false;
    document.getElementById("animalAdmesos").checked = false;
    document.getElementById("mascotes").value = "";
    document.getElementById("fotoHotel").value = "";
    document.getElementById("puntuacioBooking").value = 0;
    document.getElementById("textInputBooking").value = "";
    document.getElementById("advisorHotel").value = "";

    //Deixam la visibilitat dels botons per defecte.
    document.getElementById("dvMascotes").style.display = "none";
    document.getElementById("preusBerenar").style.display = "none";
    document.getElementById("preusDinar").style.display = "none";
    document.getElementById("preusSopar").style.display = "none";
    document.getElementById("modificar").style.display = "none";
    document.getElementById("afegir").style.display = "inline";
}

//Eliminar un hotel. Seleccionat l'hotel l'eliminam de la llista.
function eliminarHotel(idLi) {
    let hotel = document.getElementById("liHotel"+idLi);
    if (!hotel) {
        alert("L'hotel seleccionat no existeix.");
    } else {
        if (confirm("Segur que vols eliminar l'hotel?")) {
            let nodePare = hotel.parentNode;
            nodePare.removeChild(hotel);
            alert("Eliminat correctament.");
        }
    }
    //si ens quedam sense hotel, informam que ni ha hotels registrats
    if (document.getElementById("llistaHotels").rows.length<2){
        document.getElementById("noHotels").style.display = "block";
    };
}
//oculto el textarea mientras que no esté generado
function mostrarJSON() {
    let jsonText = document.getElementById('JsonText').style.display;
    if(jsonText == "none")
          document.getElementById('JsonText').style.display = "block";
    else
          document.getElementById('JsonText').style.display = "none";
}

function validar_email( email ) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
}

function validarURL(str) {
    var pattern = /^(http|https|ftp)\:\/\/[a-z0-9\.-]+\.[a-z]{2,4}/gi;
    if(str.match(pattern))
        return true;
    else
        return false;
}

//funció per veure es valor de sa puntuació a booking.com
function rangeValues(val) {
    document.getElementById('textInputBooking').value=val; 
  }