const lineWidth = document.getElementById("line-width");
const color = document.getElementById("color");
const colorOptions = Array.from(document.getElementsByClassName("color-option"));
// array로 만들어야 forEach 사용할 수 있음

const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
//저장 버튼
const saveBtn = document.getElementById("save");

const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); // 그림판 붓

const CANVAS_WIDTH = window.innerWidth * 0.9;
const CANVAS_HEIGHT = window.innerWidth * 0.9;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT; 
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round"; // 끝모서리가 둥글게

let isPainting = false;
let isFilling = false;

function onMove(event){
    // painting 중이면 그림을 그려주고
    if(isPainting){
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    // 아니면 마우스만 이동한다 
    ctx.moveTo(event.offsetX, event.offsetY);
};
function onMouseDown(){
    isPainting = true; // 마우스를 누른 상태면 페인팅 중
}
function onMouseUp(){
    isPainting = false; // 마우스를 떼면 페인팅 끝
    ctx.beginPath(); // 기존의 그린 것과 다른 path
}
function onLineWidthChange(event){
    ctx.lineWidth = event.target.value;
}
function onColorChange(event){
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}
function onColorClick(event){
    const colorValue = event.target.dataset.color;
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue; // 무슨 색으로 변경됐는지 보여주기
}
function onModeClick(){
    if(isFilling){
        isFilling = false;
        modeBtn.innerText = "💧 채우기";
    }else{
        isFilling = true;
        modeBtn.innerText = "✍ 그리기";
    }
}
function onCanvasClick(){
    if (isFilling){
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    }
}
function onDestroyClick(){
    // 그냥 흰색으로 덮어버림
    ctx.fillStyle = "white"; 
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}
function onEraseClick(){
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "✍ 그리기";
}
function onFileChange(event){
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = function(){
        ctx.drawImage(image, 0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fileInput.value = null; // 새로운 사진 다시 첨부 가능하게
    }
}
function onDoubleClick(event){
    const text = textInput.value;
    if (text !== ""){
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = "48px serif";
        ctx.fillText(text, event.offsetX, event.offsetY);
        ctx.restore(); // 기존 선 굵기로 복구하기
    }
}
function onSaveClick(){
    const url = canvas.toDataURL(); // 내가 그린 그림을 url로 변환해줌
    const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
}
  
canvas.addEventListener("dblclick", onDoubleClick);
// 모바일을 위한 위치 정하기
function getTouchPos(e) {
    return {
        x: e.touches[0].clientX - e.target.offsetLeft,
        y: e.touches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop
    }
}
function touchStart(e) {
    e.preventDefault();
    drawing = true;
    const { x, y } = getTouchPos(e);
    startX = x;
    startY = y;
}
function touchMove(e) {
    if(!drawing) return;
    const { x, y } = getTouchPos(e);
    draw(x, y);
    startX = x;
    startY = y;
}
function touchEnd(e) {
    if(!drawing) return;
    // 점을 찍을 경우 위해 마지막에 점을 찍는다.
    // touchEnd 이벤트의 경우 위치정보가 없어서 startX, startY를 가져와서 점을 찍는다.
    ctx.beginPath();
    ctx.arc(startX, startY, ctx.lineWidth/2, 0, 2*Math.PI);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
    drawing = false;
}

let isMobile = false;
function checkMobile(){
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        isMobile = true;
    }else{
        isMobile = false;
    }
};
checkMobile();
console.log(isMobile);
if(isMobile){
    // pc버전
    canvas.onmousemove = onMove;
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp); 
    canvas.addEventListener("mouseleave", onMouseUp); // 그림판 바깥에 갔을때도 false

}else{
    // 모바일 버전
    canvas.addEventListener("touchmove", touchMove, false);
    canvas.addEventListener("touchstart", touchStart, false);
    canvas.addEventListener("touchend", touchEnd, false);
}

// 전체 채우기
canvas.addEventListener("click", onCanvasClick)

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach(color => color.addEventListener("click", onColorClick));
modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraseClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
