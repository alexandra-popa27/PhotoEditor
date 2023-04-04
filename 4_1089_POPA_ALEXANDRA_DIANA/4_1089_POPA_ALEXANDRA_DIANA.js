let canvas=document.getElementById("id_canvas");
let overlay=document.getElementById("id_overlay");
let context=canvas.getContext("2d");
let overlayCtx=overlay.getContext("2d");

canvas.width=window.innerWidth-20;
canvas.height=window.innerHeight-100;
overlay.width=window.innerWidth-20;
overlay.height=window.innerHeight-100;

var img;
var crop;

let uploader=document.getElementById("uploader");
uploader.addEventListener('change',(e)=>{
    console.log('upload');
    const file=uploader.files[0];
    console.log(file.name);
    img=new Image();
    img.src=URL.createObjectURL(file);
    img.onload=function(){
        console.log('image uploaded');
        canvas.width=img.width;
        canvas.height=img.height;
        overlay.width=img.width;
        overlay.height=img.height;
        context.drawImage(img,0,0);
    }
})

let btn_select=document.getElementById("id_button_select");
var isDrawing=false;
var finishX;
var finishY;
btn_select.addEventListener('click',()=>{
    function clearOverlay() {
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        overlayCtx.strokeStyle = 'black';
        overlayCtx.lineWidth = 1;
    }
    
    overlay.addEventListener('mousedown', e => {
        startX = e.offsetX;
        startY = e.offsetY;
        isDrawing = true;
        clearOverlay();
        overlay.style.cursor = "crosshair";
    });
    
    overlay.addEventListener('mousemove', e => {
        if (isDrawing) {
            clearOverlay();
            overlayCtx.beginPath();
            overlayCtx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);  
            overlayCtx.stroke();
        } 
    });
    
    overlay.addEventListener('mouseup', e => {
        if (isDrawing) {
            isDrawing = false;
            overlay.style.cursor = "default";
            finishX=e.offsetX;
            finishY=e.offsetY;
        }
    });

    console.log('part of image selected');
})

let btn_crop=document.getElementById("id_button_crop");
btn_crop.addEventListener('click',()=>{
    canvas.width=finishX-startX;
    canvas.height=finishY-startY;
    overlay.width=finishX-startX;
    overlay.height=finishY-startY;
    context.drawImage(img,startX,startY,finishX-startX,finishY-startY,0,0,finishX-startX,finishY-startY);
    var url=canvas.toDataURL();
    img.src=url;
    console.log('image cropped');
})

let btn_delete=document.getElementById("id_button_delete");
btn_delete.addEventListener('click',()=>{
    context.beginPath();
    context.rect(startX,startY,finishX-startX,finishY-startY);
    context.fillStyle='white';
    context.fill();
    var url=canvas.toDataURL();
    img.src=url;
    console.log('deleted selection');
})

crop=new Image();

let btn_blur=document.getElementById("id_button_blur");
btn_blur.addEventListener('click',()=>{
    context.filter='blur(4px)';
    context.drawImage(img,0,0);
    var url=canvas.toDataURL();
    crop.src=url;
    context.filter='none';
    context.drawImage(img,0,0);
    context.drawImage(crop,startX,startY,finishX-startX,finishY-startY,startX,startY,finishX-startX,finishY-startY);
    var url=canvas.toDataURL();
    img.src=url;
    console.log('blur filter applied');
    context.drawImage(img,0,0);
})

let btn_grayscale=document.getElementById("id_button_grayscale");
btn_grayscale.addEventListener('click',()=>{
    let imgData=context.getImageData(startX,startY,finishX-startX,finishY-startY);
    let pixels=imgData.data;
    for (var i = 0; i < pixels.length; i += 4) {
        let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
        pixels[i] = lightness;
        pixels[i + 1] = lightness;
        pixels[i + 2] = lightness;
      }
    context.putImageData(imgData, startX, startY);
    var url=canvas.toDataURL();
    img.src=url;
    console.log('grayscale filter applied');
})

let btn_resize=document.getElementById("id_button_resize");
const inputLatime=document.getElementById("id_latime");
btn_resize.addEventListener('click',()=>{
    const ratio=img.width/img.height;
    canvas.width=inputLatime.value;
    canvas.height=inputLatime.value/ratio;
    overlay.width=inputLatime.value;
    overlay.height=inputLatime.value/ratio;
    context.drawImage(img,0,0,inputLatime.value,inputLatime.value/ratio);
    var url=canvas.toDataURL();
    img.src=url;
    console.log('resized the image');
})

let btn_add_text=document.getElementById("id_button_add_text");
const inputText=document.getElementById("id_text");
const inputDimensiune=document.getElementById("id_dimensiune");
const inputCuloare=document.getElementById("id_culoare");
const inputX=document.getElementById("id_coordonata_x");
const inputY=document.getElementById("id_coordonata_y");
btn_add_text.addEventListener('click',()=>{
    const font=inputDimensiune.value+"px Helvetica";
    console.log(font);
    context.font=font;
    context.fillStyle=inputCuloare.value;
    context.fillText(inputText.value,inputX.value,inputY.value);
})

let btn_color_map=document.getElementById("id_button_color_map");

let btn_save=document.getElementById("id_button_save");
btn_save.addEventListener('click',()=>{
    const dataURI=canvas.toDataURL("image/jpeg");
    if(window.navigator.msSaveBlob){
        window.navigator.msSaveBlob(canvas.msToBlob(),"canvas-image.png");
    }
    else{
        const a=document.createElement("a");
        document.body.appendChild(a);
        a.href=canvas.toDataURL();
        a.download="canvas-image.png";
        a.click();
        document.body.removeChild(a);
    }
})