//bkcol='#d6a7d3',nodcol='#7a2d74',canvascol='#e8d7e7';
var b_place,i_v1,i_v2,b_adde,b_edg,b_reset,b_nstep,b_pstep;
var totnods,maxnods,totedg,maxedg,count,step;
var bkcol='#b3d9ff',nodcol='#0080ff';
var canvascol='#d2e4f7',canvasx=30,canvasy=50,canvasw,canvash=480;
var mainarr,disparr,msg=[],msgflag,place;
var bfsarr,queue,visited;
var vhl,qhl,edghl,next,nexttot;

msg[0]='';
msg[1]='*INVALID INPUT';
msg[2]='*AT LEAST 2 NODES REQUIRED';
msg[3]='*MAXIMUM NODE LIMIT REACHED';
msg[4]='*THOSE ARE TOO MANY EDGES!';
msg[5]='*EDGE ADDED';
msg[6]='*EDGE ALREADY EXISTS';

function setup(){
  var mycv=createCanvas(window.innerWidth,window.innerHeight-80);
  mycv.parent('sketch-holder');

  b_place=createButton('PLACE NODES');
  b_place.attribute('class','btn btn-light');
  b_place.position(canvasx,canvasy+canvash+150);
  b_place.mousePressed(nodesplaced);

  i_v1=createInput();
  i_v1.position(b_place.x+b_place.width+20,b_place.y);
  i_v2=createInput();
  i_v2.position(i_v1.x+i_v1.width,i_v1.y);

  b_adde=createButton('ADD EDGE');
  b_adde.position(i_v2.x+i_v2.width,i_v2.y);
  b_adde.mousePressed(addedge);

  b_edg=createButton('START');
  b_edg.attribute('class','btn btn-light');
  b_edg.position(b_adde.x+b_adde.width+20,b_adde.y);
  b_edg.mousePressed(defedgs);

  b_reset=createButton('CLEAR');
  b_reset.position(b_edg.x+b_edg.width+300,b_edg.y+50);
  b_reset.mousePressed(reset);

  b_pstep=createButton('STEP BACK');
  b_pstep.position(b_reset.x+b_reset.width,b_reset.y);
  b_pstep.mousePressed(pstep);

  b_nstep=createButton('STEP FORWARD');
  b_nstep.position(b_pstep.x+b_pstep.width,b_reset.y);
  b_nstep.mousePressed(nstep);

  reset();
}

function draw(){
  background(bkcol);
  noStroke();
  fill(0);
  textSize(35);
  textStyle(BOLD);
  textAlign(CENTER,CENTER);
  text('BREADTH FIRST SEARCH',window.innerWidth/2,40);

  fill(canvascol);
  rect(canvasx,canvasy+30,canvasw,canvash,20);
  
  textSize(18);
  textStyle(NORMAL);
  textAlign(LEFT,CENTER);

  fill(0);
  text(msg[msgflag],canvasx,canvash+canvasy+125);
  
  text('VISITED NODE: ',b_edg.x+b_edg.width+37,canvash+canvasy+80);
  fill('#242144');
  ellipse(900,610,35,35);
  fill(nodcol);
  ellipse(900,610,23,23);

  fill(0);
  text('QUEUE: '+qhl[step],b_reset.x,canvasy+canvash+60);
  if(vhl)
  text('BFS: '+vhl[step],b_reset.x+28,canvasy+canvash+88);
  
  

  if(placecondition()){
    fill(nodcol);
    ellipse(mouseX,mouseY,50,50);
  }
  
  strokeWeight(4);
  for(var i=0;i<totnods;i++){
    for(var j=0;j<i+1;j++){
      if(mainarr[i][j]==1){
        if((edghl[step][0]==j&&edghl[step][1]==i)||(edghl[step][0]==i&&edghl[step][1]==j))
          stroke(255);
        else
          stroke(128);
        line(disparr[i][1],disparr[i][2],disparr[j][1],disparr[j][2]);
      }
    }
  }
  noStroke();

  for(var i=0;i<maxnods;i++){
    if(disparr[i][0]!=undefined){
      for(var x=0;x<vhl[step].length;x++){
        if(i==vhl[step][x]){
          fill('#242144');
          ellipse(disparr[i][1],disparr[i][2],67,67);
        }
      }
      fill(nodcol);
      ellipse(disparr[i][1],disparr[i][2],50,50);
      fill(255);
      textAlign(CENTER,CENTER);
      text(disparr[i][0],disparr[i][1],disparr[i][2]);
    }
  }

}

function placecondition(){
  if(place&&mouseX-30>=canvasx&&mouseX+30<=canvasx+canvasw&&mouseY-30>=canvasy+30&&mouseY<=canvasy+canvash)
    return true;
  else
    return false;
}

function nodesplaced(){
  if(count<=1){
    msgflag=2;//at least 2 nodes
    return;
  }
  totnods=count;
  b_place.attribute('disabled','');
  b_edg.removeAttribute('disabled');
  b_adde.removeAttribute('disabled');
  count=0;
  place=false;
  msgflag=0;
}

function mouseClicked(){
  if(placecondition()){
    disparr[count][0]=count;
    disparr[count][1]=mouseX;
    disparr[count][2]=mouseY;
    count++;
    if(count==maxnods){
      place=false;
      count=0;
      totnods=maxnods;
      b_place.attribute('disabled','');
      b_edg.removeAttribute('disabled');
      b_adde.removeAttribute('disabled');
      msgflag=3;//max node limit
    }
  }
}

function defedgs(){
  i_v1.attribute('disabled','');
  i_v2.attribute('disabled','');
  b_adde.attribute('disabled','');
  totedg=count;
  step=0;
  msgflag=0;
  b_edg.attribute('disabled','');
  traverseBFS();
}

function addedge(){
  var v1=i_v1.value().replace(/\s+/g,"");
  i_v1.value('');
  var v2=i_v2.value().replace(/\s+/g,"");
  i_v2.value('');
  if(isFinite(v1)&&v1!=''&&isFinite(v2)&&v2!=''){
    v1=int(v1);
    v2=int(v2);
    if(v1>=totnods||v2>=totnods||v1==v2){
      msgflag=1;
      return;
    }
    if(mainarr[v1][v2]==0){
      mainarr[v1][v2]=1;
      mainarr[v2][v1]=1;
      msgflag=5;
      count++;
    }
    else{
      msgflag=6;//edges exists
      return;
    }
  }
  else{
    msgflag=1;//invalid input
  }
}

function traverseBFS(){
  var i,k;
  queue.push(0);
  bfsarr.push(0);

  qhl[next]=queue.slice();   
  edghl[next]=edghl[next].slice(); 
  vhl[next++]=bfsarr.slice();

  while(queue.length!=0){
    i=queue.shift();
    visited[i]=true;
    //queue.unshift(i);

    for(k=0;k<totnods;k++){
      if(i!=k&&mainarr[i][k]==1&&!visited[k]){
        queue.push(k);
        bfsarr.push(k);
        visited[k]=true;

        edghl[next]=[i,k];
        qhl[next]=queue.slice();
        vhl[next]=bfsarr.slice();
        next++;
      }
    }
    //var x=queue.shift();

    qhl[next]=queue.slice();
    edghl[next]=edghl[next].slice(); 
    vhl[next++]=bfsarr.slice();
  }

  qhl[next]=queue.slice();
  vhl[next]=bfsarr.slice();
  edghl[next]=edghl[next].slice(); 

  nexttot=next;
  next=0;
}

function nstep(){
  step++;
  if(step==nexttot)
    step--;
}

function pstep(){
  step--;
  if(step==-1)
    step=0;
}

function reset(){
  totnods=0;
  maxnods=10;
  totedg=0;
  maxedg=0;
  count=0;
  step=0;
  msgflag=0;
  place=true;
  mainarr=[];
  disparr=[];
  bfsarr=[];
  queue=[];
  visited=[];
  next=0;
  nexttot=0;
  vhl=[];
  qhl=[];
  edghl=[];

  for(var i=0;i<maxnods;i++){
    mainarr[i]=[];
    disparr[i]=[];
    visited[i]=false;
  }

  for(var i=0;i<maxnods;i++){
    for(var j=0;j<maxnods;j++){
      mainarr[i][j]=0;
    }
    for(var j=0;j<3;j++){
      disparr[i][j]=undefined;
    }
  }

  for(var i=0;i<100;i++){
    vhl[i]=[];
    qhl[i]=[];
    edghl[i]=[];
  }

  b_place.removeAttribute('disabled');

  b_edg.attribute('disabled','');
  b_adde.attribute('disabled','');

  i_v1.removeAttribute('disabled');
  i_v2.removeAttribute('disabled');

  i_v1.value("");
  i_v2.value("");

  textSize(18);
  textStyle(NORMAL);

  canvasw=window.innerWidth-2.5*canvasx;
}