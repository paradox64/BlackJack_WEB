
let id="";
let myHand="myCards";
let dealerHand="dealerCards";
let base="https://deckofcardsapi.com/api/deck/";
let points={myCards:[],dealerCards:[]};
let rounds=0;

fetch(base+"new/shuffle/?deck_count=1")
 .then(response=>response.json())
 .then (newDeck)


function newDeck(response){
    id=response.deck_id;
}


function removeAllChildNodes(parent) {
    const myNode = document.getElementById(parent);
    while (myNode.firstChild) {
      myNode.removeChild(myNode.lastChild);
    }
}

function hit(){
    var myPoints=countPoints("myCards");
    if (myPoints<21){
    drawCard("myCards");
    }
}

function countPoints(hand){
    var count=0;
    var element;
    var asInhand=0;//as in the hand?
    for (let i = 0; i < points[hand].length; i++) {
        element = points[hand][i];
        if (element=="ACE"){
            asInhand++;
            count+=11;
        } else if (element=="KING" ||element=="QUEEN"||element=="JACK"){
            count+=10;
        }else{
            count+=parseInt(element);
        }
    }
    var reducePoints=true;
    //change the value of the ACE to 1
    while (reducePoints){
        if (count>21 && asInhand>0){
            count=count-10;
            asInhand--;    
        }else{
            reducePoints=false;
        }
    }
    return count;
}

function showPoints(boardDiv,points) {
    var h = document.createElement("H1")                 
    if (points==21){
        var t = document.createTextNode("BLACKJACK"); 
    }else if (points<21){
            var t = document.createTextNode(points); 
        } else
            var t = document.createTextNode("BUSTED"); 
    h.appendChild(t);  
    document.getElementById(boardDiv).append(h);
}


function stand(){
    var myPoints=countPoints("myCards");
    var dealerPoints=countPoints("dealerCards");
    showPoints("myCards",myPoints);
    //while (dealerPoints<17){
        if (dealerPoints<17){
        drawCard("dealerCards");
        dealerPoints=countPoints("dealerCards");
        }else{
            showPoints("dealerCards",dealerPoints);
            var message;
            if ((myPoints>21 && dealerPoints>21)|| dealerPoints==myPoints){
                message=" DRAW"
            }else if (myPoints>21){
                message=" YOU lOOSE"
            } else if (dealerPoints>21){
                message=" YOU WIN"
            }else if (myPoints>dealerPoints){
                message=" YOU WIN"
            }else{
                message=" YOU LOOSE"
            }
            document.getElementById("round").innerText+=message;
        }
}


function newRound(){
    points.myCards=[];
    points.dealerCards=[];
    document.getElementById("round").innerText="ROUND "+rounds;
    rounds++;
    removeAllChildNodes("myCards");
    removeAllChildNodes("dealerCards")
    drawCard("myCards");
    drawCard("myCards");
    drawCard("dealerCards");
    
}

function drawCard(pileName){
    var base="https://deckofcardsapi.com/api/deck/";
    var draw="/draw/?count=1"
    fetch(base+id+draw)
       .then(res=>res.json())
       .then (function addToPile(res){
        showImage(pileName,res.cards[0].image);
        points[pileName].push(res.cards[0].value);
        fetch(base+id+"/pile/"+pileName+"/add/?cards="+res.cards[0].code)
        .then(res=>res.json())
    })
}



function showImage(pileName,src){
    var img = document.createElement('img'); 
    img.setAttribute("id", "created");
    img.setAttribute("src",src);
    document.getElementById(pileName).append(img);
   
}
        

