//Clousure clase XHR PURE JS
(function(objetoGlobal) {
  //create by claudio.dcv@gmail.com
    var EasyUpload = function(objetoConstructor) {

        //Private
        var obj = objetoConstructor;

        this.containerGeneral = this._(obj.containerGeneral);
        this.internalId = this.containerGeneral.id + new Date().getTime();
        this.classNameContainerCanvas = "class-" + this.internalId;

        var styleCSS = document.createElement("STYLE");
        var classCSS = document.createTextNode("." + this.classNameContainerCanvas + " canvas{max-width: 200px;max-height: 200px;}");
        styleCSS.appendChild(classCSS);
        this.containerGeneral.appendChild(styleCSS);

        //CREACION BARAR PROGRES
        this.progressBar = document.createElement("PROGRESS");
        this.progressBar.setAttribute("max", 0);
        this.progressBar.value = 0;
        this.progressBar.setAttribute("style", "width:300px");
        this.containerGeneral.appendChild(this.progressBar);
        //CREACION INPUT FILE MULTIPLE
        this.file = document.createElement("INPUT");
        this.file.type = "file";
        this.file.name = "file2";
        this.file.id = "file2";
        this.file.className = "btn btn-default";

        //obj.multiple = obj.multiple || true;
        if (obj.multiple) {
            this.file.setAttribute("multiple", "multiple");
        }
        this.file.setAttribute("accept", "image/*");

        this.containerGeneral.appendChild(this.file);

        //CREACION INPUT BUTTON TO SEND FILES
        this.button = document.createElement("INPUT");
        this.button.type = "button";
        this.button.value = "Subir";
        this.button.className = "btn btn-default";
        this.containerGeneral.appendChild(this.button);

        //TAG STATUS
        this.tagStatus = document.createElement("DIV");
        this.containerGeneral.appendChild(this.tagStatus);

        //TAG INFO
        this.tagInfo = document.createElement("DIV");
        this.containerGeneral.appendChild(this.tagInfo);

        /*
        obj.idProgresBar
        obj.url
        obj.idInputFIle
        obj.idButtonSend
        */
        //atributo privado xhr
        this.ajax = new XMLHttpRequest();
        this.url = obj.url;
        this.validFiles = 0;
        this.max = obj.max || 20480000;
        this.tamanioFile = 0;
        this.canvas = [];
        this.formData = new FormData();


        this.listenerFile();
        this.setButtonSendServer();
        this.createCSSStyle();

    }
    EasyUpload.prototype.listenerFile = function() {
        //si cambia el input file se agregar los files al objeto FormData
        var chageListener = function(e) {

            //crea nuevamente el formData para remover lo anteriormente seteado
            this.formData = new FormData();
            this.valiFiles = 0;
            this.canvas = [];
            //console.log(this.file.files);
            var j = 0;
            for (var i = 0; this.file.files.length > i; i++) {
                //console.log(this.file.files[i]);
                //se evalua el tamaño maximo permitodo
                if (this.file.files[i].size > this.max) {
                    console.log(this.file.files[i].name + " Es muy grande y no se enviara");
                } else {
                    if (this.file.files[i].type == "image/png" ||
                        this.file.files[i].type == "image/jpg" ||
                        this.file.files[i].type == "image/jpeg" ||
                        this.file.files[i].type == "image/gif") {
                        //archivos validos
                        this.formData.append("file-" + j, this.file.files[i]);
                        j++;
                        this.validFiles++;
                        this.createCanvasNode(this.file.files[i], i);
                    } else {
                        console.log(this.file.files[i].name + " No es una imagen");
                    }
                }
            }

            //console.log(this.canvas);
            this.addCanvasToContain();
            console.log(this.canvas);

        }
        this.file.addEventListener('change', chageListener.bind(this));
    }
    EasyUpload.prototype.sendServer = function() {

    }
    EasyUpload.prototype.setButtonSendServer = function() {

        //metodo privado
        var enviar = function() {
            //SI ES TODO CORRECTO CARGO Y ENVIO
            this.ajax.upload.addEventListener("progress", this.progressHandler.bind(this), false);
            this.ajax.addEventListener("load", this.completeHandler.bind(this), false);
            this.ajax.addEventListener("error", this.errorHandler.bind(this), false);
            this.ajax.addEventListener("abort", this.abortHandler.bind(this), false);
            this.ajax.open("POST", this.url);
            this.ajax.send(this.formData);

        }
        this.button.addEventListener("click", enviar.bind(this));
    }

    //
    EasyUpload.prototype.createCanvasNode = function(file, indexFile) {

        ///////// PROCESO DE LECTURA DE IMAGEN Y PINTADO //////////////////
        //1: se crean variables y se guarda el contexto del canvas
        var canvasElm = document.createElement("CANVAS");
        var ctx = canvasElm.getContext('2d');
        //2: se instancia el objeto que lee archivos
        var reader = new FileReader();
        //4: se captura el evento del objeto reader cuando el archivo del paso 3 es leido
        reader.onloadend = function(event) {
                //5: instancia del objeto Imagen en variable img
                var img = new Image();
                //7: al completarce el paso 6 de asignacion de datos desde el event.target.result
                //se captura el evento disparado por img -> on load
                img.onload = function() {
                        //console.log(img.width);
                        //8: obtengo las propiedades de img y las asigno al canvas
                        canvasElm.width = img.width;
                        canvasElm.height = img.height;
                        //9: pinto la img en el contexto del canvas FIN...
                        ctx.drawImage(img, 0, 0);
                    }
                    //6: cuando el paso 4 es completado se lee el objeto parametro event
                    // dentro en su result siene el archivo en texto blob y se guarda en img
                img.src = event.target.result;
            }
            //3: el objeto reader lee el archivo pasado como parametro al metodo
        reader.readAsDataURL(file);
        //////////////// FIN DEL PROCESO //////////////////////////////////

        //Crear un canvas solo cuando un file type image es coincidente
        this.canvas.push(canvasElm); // Create a <button> element
        //var t = document.createTextNode("CLICK ME");       // Create a text node
        //btn.appendChild(t);                                // Append the text to <button>
        //document.body.appendChild(btn);
    };
    EasyUpload.prototype.createCSSStyle = function() {

        this.canvasContain = null;
        this.canvasContain = document.createElement("DIV");
        this.canvasContain.id = this.internalId + "-canvasContain";
        this.canvasContain.className = this.classNameContainerCanvas;

    };
    EasyUpload.prototype.addCanvasToContain = function() {
        //limpio el contenedor de canvas para agregar las imagenes en canvas nuevas
        var clearOldSelector = this._(this.internalId + "-canvasContain");
        console.log(clearOldSelector, this.internalId);
        if (clearOldSelector)
            clearOldSelector.innerHTML = "";

        for (var i = 0; i < this.canvas.length; i++) {
            //console.log(canvas);
            var img = this.canvas[i];
            img.id = "preview-" + i;
            this.canvasContain.appendChild(img);
        }

        //console.log(this.canvasContain);


        this.containerGeneral.appendChild(this.canvasContain);
    };
    //METODOS DISPARADOR POR XHR
    EasyUpload.prototype.errorHandler = function(event) {
        this.tagStatus.innerHTML = "Upload Failed";
    }
    EasyUpload.prototype.abortHandler = function(event) {
        this.tagStatus.innerHTML = "Upload Aborted";
    }
    EasyUpload.prototype.completeHandler = function(event) {
        console.log(event.target.responseText);
        this.tagStatus.innerHTML = JSON.parse(event.target.responseText).msg;
        //menu.data.mesageSubida = event.target.responseText;
        this.progressBar.value = 0;
        //var canvas = document.getElementById('imageCanvas');
        //var context = canvas.getContext('2d');
        //context.clearRect(0, 0, canvas.width, canvas.height);
        //document.getElementById('imageCanvas').removeEventListener("click",openModal);

    };
    EasyUpload.prototype.progressHandler = function(event) {

            ////this._("loaded_n_total").innerHTML = "Uploaded "+event.loaded+" bytes of "+event.total;
            this.tagInfo.innerHTML = "Se ha subido " + this.formatBytes(event.loaded) + " de " + this.formatBytes(event.total);
            var percent = (event.loaded / event.total) * 100;
            this.progressBar.value = Math.round(percent);
            this.tagStatus.innerHTML = Math.round(percent) + "% Subido... espere unos momentos";

        }
        //HELPER
        //Selector of id
    EasyUpload.prototype._ = function(id) {
        return document.getElementById(id);
    }
    EasyUpload.prototype.formatBytes = function(bytes, decimals) {
        if (bytes == 0) return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };
    //Agregando Objeto al scope general
    window.EasyUpload = EasyUpload;
})(window);
