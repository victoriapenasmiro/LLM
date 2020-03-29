
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
    }

    if (document.getElementById("estrellesHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Número d'estrelles no introduït\n";
    }

    if (document.getElementById("emailHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "E-mail no introduït\n";
    }
    //controlo que la direccion de correo es correcta con expresiones regulares
    else if (!validar_email(document.getElementById("emailHotel").value)){
        strErrors += "La direcció d'email " + document.getElementById("emailHotel").value + " és incorrecta.";
    }

    if (document.getElementById("tlfHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Telèfon no introduït\n";
    }
    /*valido que el formato del telefono sea: Prefijo internacional (+ seguido de 2 o 3 cifras),
    espacio en blanco y 9 cifras consecutivas*/
    else if (!/^\+\d{2,3}\s\d{9}$/.test(document.getElementById("tlfHotel").value)){
        strErrors += "El telèfon introduït no està en el format requerit\n";
    }

    if (document.getElementById("direccioHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Direcció no introduida\n";
    }

    if (document.getElementById("codiPostalHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Codi postal no introduït\n";
    }

    else if (document.getElementById("codiPostalHotel").value > 99999 ||
    document.getElementById("codiPostalHotel").value < 0){
        strErrors += "El codi postal introduït no existeix\n";
    }

    if (document.getElementById("ciutatHotel").value == "") {
        //El \n és un bot de linea.
        strErrors += "Ciutat no introduïda\n";
    }
    
    if(document.getElementById("advisorHotel").value != "" && !validarURL(document.getElementById("advisorHotel").value)){
        strErrors += "L'enllaç de Tripadvisor indicat no és correcte.";
    }

    return strErrors;
}

//Generar l'objecte d'un hotel amb les dades introduides.
function generarObjHotel(id) {
    let hotel = new Object();
    hotel.id = id;
    hotel.nom = document.getElementById("nomHotel").value;
    hotel.estrelles = document.getElementById("estrellesHotel").value;
    hotel.email = document.getElementById("emailHotel").value;
    hotel.tel = document.getElementById("tlfHotel").value;
    hotel.direccio = document.getElementById("direccioHotel").value;
    hotel.codiPostal = document.getElementById("codiPostalHotel").value;
    hotel.ciutat = document.getElementById("ciutatHotel").value;
    hotel.parking = document.getElementById("parkingHotel").checked = getCheckPark(); //no funciona, pdte testar
    hotel.wifi = document.getElementById("wifiHotel").checked = getCheckWifi(); //no funciona, pdte testar
    hotel.animals = document.getElementById("animalsAdmesos").checked = getCheckAnima(); //no funciona, pdte testar
    hotel.llistaMascotes = document.getElementById("mascostes").value; //no funciona, pdte testar
    hotel.fotoPrinc = document.getElementById("fotoHotel").value; 
    hotel.puntuacioBooking = document.getElementById("puntuacioBooking").value;
    hotel.advisorHotel = document.getElementById("advisorHotel").value;
    return hotel;
}

function getCheckPark() {
    if(document.getElementById("parkingHotel").checked == false){
        return false;
    }
    else{
        return true;
    }
}
function getCheckWifi() {
    if(document.getElementById("wifiHotel").checked == false){
        return false;
    }
    else{
        return true;
    }
}
function getCheckAnimal() {
    if(document.getElementById("animalsAdmesos").checked == false){
        return false;
    }
    else{
        return true;
    }
}

//Afegirem un hotel. Controlarem si les dades són correctes i el ficarem a la llista i generarem el Json.
function afegirHotel() {
    var dadesCompletes = controlDeLesDades();
    var idLlista = comptadorHotels;
    comptadorHotels += 1;
    if (dadesCompletes == "") {
        var objHotel = generarObjHotel(idLlista);
        //Crearem un element més a la llista d'hotels
        var strHtmlHotel = "<li id=\"liHotel" + idLlista + "\">";
        //Crearem un input hidden. Com un text, però no visible per guardar el Json de l'hotel
        strHtmlHotel += "<label id=\"lblNomHot" + idLlista + "\">" + objHotel.nom + "</label>";
        strHtmlHotel += "<input type=\"hidden\" class=\"jsonHotel\" id=\"jsonHotel" + idLlista + "\" value=\"\" />";
        //Crearem un botó per eliminar l'hotel
        strHtmlHotel += "<button onclick=\"eliminarHotel(" + idLlista + ")\">Eliminar</button>";
        //Crearem un botó per modificar l'hotel
        strHtmlHotel += "<button onclick=\"modificarHotel(" + idLlista + ")\">Modificar</button>";
        strHtmlHotel += "</li>";
        var jsonHotel = JSON.stringify(objHotel);
        document.getElementById("llistaHotels").innerHTML += strHtmlHotel;
        //Asignam el json al input hidden del hotel. Ho faig aquí així no he de fer el parse de les ". Ja ho fa javascript automàtic.
        document.getElementById("jsonHotel" + idLlista).value = jsonHotel;
        netejarCamps();
        alert("Afegit correctament");
    } else {
        alert("Falten dades per completar:\n" + dadesCompletes);
    }
}

function controlMascotes() {
    if (document.getElementById("animalAdmesos").checked == true) {                
        document.getElementById("dvMascotes").style.display = "block";
    } else {
        document.getElementById("dvMascotes").style.display = "none";
    }
}  

//Modificació de les dades d'un hotel.
function desarModificacioHotel() {
    var idLlista = document.getElementById("idHotel").value;
    var dadesCompletes = controlDeLesDades();
    if (dadesCompletes == "") {
        var objHotel = generarObjHotel(idLlista);
        document.getElementById("lblNomHot" + idLlista).value = objHotel.nom;
        var jsonHotel = JSON.stringify(objHotel);
        document.getElementById("jsonHotel" + idLlista).value = jsonHotel;
        netejarCamps();
    }
}

//Carregam les dades al main i preparam el botons per desar modificacions i no ficar un nou hotel
function modificarHotel(idLi) {
    let objHotel = new Object();
    objHotel = JSON.parse(document.getElementById("jsonHotel" + idLi).value);
    document.getElementById("nomHotel").value = objHotel.nom;
    document.getElementById("estrellesHotel").value = objHotel.estrelles;
    document.getElementById("emailHotel").value = objHotel.email;
    document.getElementById("tlfHotel").value = objHotel.tel;
    document.getElementById("direccioHotel").value = objHotel.direccio;
    document.getElementById("codiPostalHotel").value = objHotel.codiPostal;
    document.getElementById("ciutatHotel").value = objHotel.ciutat;
    document.getElementById("parkingHotel").checked = objHotel.parking; //pdte tomeu
    document.getElementById("wifiHotel").checked = objHotel.wifi; //pdte tomeu
    document.getElementById("animalsAdmesos").checked = objHotel.animals; //pdte tomeu
    document.getElementById("mascostes").value; //pdte testar
    hdocument.getElementById("fotoHotel").value = objHotel.fotoPrinc;
    document.getElementById("puntuacioBooking").value = objHotel.puntuacioBooking;
    document.getElementById("advisorHotel").value = objHotel.advisorHotel;
    document.getElementById("idHotel").value = idLi;
    document.getElementById("modificar").style.display = "inline";
    document.getElementById("afegir").style.display = "none";
}

//Deixam tots els camps sense valors, per realitzar la pròxima operació.
function netejarCamps() {
    document.getElementById("nomHotel").value = "";
    document.getElementById("estrellesHotel").value = 0;
    document.getElementById("idHotel").value = "";
    document.getElementById("emailHotel").value = "";
    document.getElementById("tlfHotel").value = "";
    document.getElementById("direccioHotel").value = "";
    document.getElementById("codiPostalHotel").value = "";
    document.getElementById("ciutatHotel").value = "";
    document.getElementById("parkingHotel").checked = false;
    document.getElementById("wifiHotel").checked = false;
    document.getElementById("animalAdmesos").checked = false;
    document.getElementById("fotoHotel").value = "";
    document.getElementById("puntuacioBooking").value = 0;
    document.getElementById("advisorHotel").value = "";

    //Deixam la visibilitat dels botons per defecte.
    document.getElementById("modificar").style.display = "none";
    document.getElementById("afegir").style.display = "inline";
}

//Eliminar un hotel. Seleccionat l'hotel l'eliminam de la llista.
function eliminarHotel(idLi) {
    let hotel = document.getElementById("liHotel"+idLi);
    if (!hotel) {
        alert("L'hotel seleccioninat no existeix.");
    } else {
        if (confirm("Segur que vols eliminar l'hotel?")) {
            let nodePare = hotel.parentNode;
            nodePare.removeChild(hotel);
            alert("Eliminat correctament.");
        }
    }
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