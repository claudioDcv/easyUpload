# easyUpload

##una facil manera de implementar un upload de imagenes

##Implementacion
```js
var easyUpload = new EasyUpload({
  "containerGeneral" : "fileUploadSystem1",
  "url"           : "http://localhost:8000/control/archivo",
  "max"           : 20480000,
  "multiple"      : true
});
var easyUpload = new EasyUpload({
  "containerGeneral" : "fileUploadSystem2",
  "url"           : "http://localhost:8000/control/archivo",
  "max"           : 20480000,
  "multiple"      : true
});
var easyUpload = new EasyUpload({
  "containerGeneral" : "fileUploadSystem3",
  "url"           : "http://localhost:8000/control/archivo",
  "max"           : 20480000,
  "multiple"      : true
});
```


```html
  <div id="fileUploadSystem1"></div>
  <div id="fileUploadSystem2"></div>
  <div id="fileUploadSystem3"></div>
```
