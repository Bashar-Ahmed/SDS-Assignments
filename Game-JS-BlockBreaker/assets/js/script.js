var canvas=document.getElementById("background");
var tool=canvas.getContext("2d");
var ball=canvas.getContext("2d");

var arrc=['white','yellow','orange','red','black'];
var bricks=[];
var stx=60;
var sty=20;
var i,j,c;
var currentbrick=[];
var score=0;
var x=canvas.width/2;
var y=canvas.height-100;
var dx=0;
var dy=0;
var up=true;
var right=false;
var posx=x+dx;
var posy=y+dy;
var px=canvas.width/2-60;
var py=y;
var rightarrow=false;
var leftarrow=false;
var highscore=[];
var names=[];
var play=true;
var endg=false;
var lbpg=false;
var automate=[true,false];

var img=new Image();
img.src="assets/sprite-sheet/ss.png";
var netf=new sound("assets/sounds/Netflix.mp3");
var hitp=new sound("assets/sounds/hit.wav");

sessto=window.sessionStorage;
sessto.setItem('score',score);
locsto=window.localStorage;
if(locsto.getItem('lb')==null)
    locsto.setItem('lb',JSON.stringify(highscore));
if(locsto.getItem('name')==null)
    locsto.setItem('name',JSON.stringify(names));

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function generator() {
    for(i=0;stx+100<canvas.width;stx+=110,i++) {
        sty=20;
        bricks[i]=[];
        for(j=0;sty<6*canvas.height/10;sty+=40,j++) {
            var n=Math.floor((Math.random()*5));
            bricks[i][j]=[stx,sty,n];
        }
    }
}

function reset() {
    arrc=['white','yellow','orange','red','black'];
    bricks=[];
    stx=60;
    sty=20;
    i,j,c;
    currentbrick=[];
    score=0;
    x=canvas.width/2;
    y=canvas.height-100;
    dx=0;
    dy=0;
    up=true;
    right=false;
    posx=x+dx;
    posy=y+dy;
    px=canvas.width/2-60;
    py=y;
    rightarrow=false;
    leftarrow=false;
    highscore=[];
    names=[];
    play=true;
    endg=false;
    lbpg=false;
    automate=[true,false];
}

function keyDownHandler(e) {
    if(e.key=="ArrowRight") {
        rightarrow=true;
    }
    else if(e.key=="ArrowLeft") {
        leftarrow=true;
    }
}

function keyUpHandler(e) {
    if(e.key=="ArrowRight") {
        rightarrow=false;
    }
    else if(e.key=="ArrowLeft") {
        leftarrow=false;
    }
}

function drawbricks() {
    for(var ii=i-1;ii>=0;ii--) {
        for(var jj=j-1;jj>=0;jj--) {
            var b=bricks[ii][jj];
            if(b[2]!=-1){
            tool.fillStyle=arrc[b[2]];
            tool.fillRect(b[0],b[1],100,30);
            }
        }
    }
}

function drawpaddle() {
    if(automate[1])
        px=posx-20;
    tool.fillStyle = 'chartreuse';
    tool.fillRect(px,py,120,10);
}

function drawball() {
    ball.fillStyle = 'chartreuse';
    ball.beginPath();
    ball.arc(x+dx,y+dy,10,0,Math.PI*2);
    ball.fill();
    ball.closePath();
}

function drawcontrol() {
    if(play)
        tool.drawImage(img,0,0,379,403,canvas.width-250,y,100,100);
    else
        tool.drawImage(img,379,0,379,403,canvas.width-255,y,100,100);
    tool.drawImage(img,758,0,379,403,canvas.width-150,y,100,100);
}

function collisiondetect() {
    for(var ii=i-1;ii>=0;ii--) {
        for(var jj=j-1;jj>=0;jj--) {
            var b=bricks[ii][jj];
            if(b[2]===-1)
                continue;
            if(posx>=b[0]&&posx<=b[0]+100&&posy>=b[1]&&posy<=b[1]+30){
                if((currentbrick[0]!=ii||currentbrick[1]!=jj)) {
                    b[2]--;
                    score++;
                    sessto.setItem('score',score);
                    currentbrick=[ii,jj];
                    up=up?false:true;
                    
                }
            }
            
        }
    }
}

function wincheck() {
    c=0;
    for(var ii=i-1;ii>=0;ii--) {
        for(var jj=j-1;jj>=0;jj--) {
            var b=bricks[ii][jj];
            if(b[2]!=-1)
                c++;    
        }
    }
    
}

function scoredisp() {
    tool.font = "28px Arial";
    tool.fillStyle = 'chartreuse';
    tool.fillText("Score: "+sessto.getItem('score'),50,y+60);
}

function end(s) {
    netf.play();
    alert("GAME "+s+"\nYour Score : "+score);
    var name=prompt("Enter Your Name");
    clearInterval(interval);
    var nameslb=JSON.parse(locsto.getItem('name'));
    nameslb.push([name,score]);
    locsto.setItem('name',JSON.stringify(nameslb));
    ball.clearRect(0, 0, canvas.width, canvas.height);
    var temp=JSON.parse(locsto.getItem('lb'));
    temp.push(score);
    temp.sort(function(a, b){return b-a});
    locsto.setItem('lb',JSON.stringify(temp));
    leaderboarddisp();  
    play=false;               
}

function leaderboarddisp() {
    lbpg=true;
    var offset=200;
    var shift=400;
    var temp=JSON.parse(locsto.getItem('lb'));
    var nameslb=JSON.parse(locsto.getItem('name'));
    tool.font = "60px Arial";
    tool.fillStyle = 'chartreuse';
    tool.fillText("L E A D E R B O A R D",canvas.width/2-offset-50-shift,100);
    tool.fillStyle = 'brown';
    tool.font = "30px Arial";
    tool.fillText("NAME",canvas.width/2-offset-shift,170);
    tool.fillText("SCORE",canvas.width/2+offset-shift,170);
    tool.fillStyle = 'black';
    for(var i=0;i<10;i++){
        var pname='Unknown';
        var j=0
        for(;j<nameslb.length;j++)
            if(nameslb[j][1]===temp[i])
                pname=nameslb[j][0];
        tool.fillText(pname,canvas.width/2-offset-shift,220+i*30);
        tool.fillText(temp[i],canvas.width/2+offset-shift,220+i*30);
    }
    shift=100;
    tool.fillStyle = 'chartreuse';
    tool.beginPath();
    tool.arc(1000+shift,300,200,0,Math.PI*2);
    tool.fill();
    tool.closePath();
    tool.fillStyle = 'white';
    tool.font = "60px Arial";
    tool.fillText("Play Again",860+shift,320);
}

function move() {   
    ball.clearRect(0, 0, canvas.width, canvas.height);
    collisiondetect();
    drawcontrol();
    wincheck();
    drawbricks();
    drawpaddle();
    scoredisp();
    drawball();
    if(automate[0]) {
        ball.clearRect(0, 0, canvas.width, canvas.height);
        var inp=prompt("Enter \'M\' to play Manually\nEnter \'A\' to Automate the Game");
        if(inp==="A")
            automate[1]=true;
        automate[0]=false;
    }
    if(x+dx-10<=0)
        right=true;
    if(x+dx+10>=canvas.width)
        right=false;
    if(y+dy-10<=0)
        up=false;
    else if(posy>y-10) {
        if(posx>px&&posx<px+120) {
                up=true;
                hitp.play();
            }
            else {
                end("OVER");          
            }
    }
    if(c===1){
        end("WON");
    }
    if(endg)
        end("ENDED");
    dy=up?dy-15:dy+15;
    dx=right?dx+15:dx-15;
    posx=x+dx;posy=y+dy;
    if(leftarrow&&px>0)
        px-=5;
    if(rightarrow&&px+120<canvas.width)
        px+=5;
    if(play)
        requestAnimationFrame(move);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("click",function(event){
    var mx=event.clientX;
    var my=event.clientY;
    var cx=1100;
    var cy=300;
    var dist=Math.sqrt(((mx-cx)*(mx-cx))+((my-cy)*(my-cy)));
    if(dist<200&&lbpg){
        reset();
        generator();
        requestAnimationFrame(move);
    }
});
canvas.addEventListener("click",function(event){
    var mx=event.clientX;
    var my=event.clientY;
    if(mx>canvas.width-250&&mx<canvas.width-150&&my>y&&my<y+100){
        if(play){
            play=false;
        }
        else {
            play=true;
            requestAnimationFrame(move);
        }
    }
});
canvas.addEventListener("click",function(event){
    var mx=event.clientX;
    var my=event.clientY;
    if(mx>canvas.width-150&&mx<canvas.width-50&&my>y&&my<y+100){
        endg=true;
    }
});
generator();
var interval=requestAnimationFrame(move);
// var interval=setInterval(move,2);