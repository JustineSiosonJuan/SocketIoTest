let socket = io();
let thisItem = document.querySelector("#chatMessages");
let thisVal = document.getElementById("chatMsg");
let clearBtn = document.getElementById("clear");
let insBox = document.querySelector('.row');
let thisName = document.querySelector("#chatName");


clearBtn.addEventListener('click', ()=>{
    thisVal.value = "";
});

cht.addEventListener('click', ()=>{
    if(thisVal.value != ""){
        socket.emit('chat',{ user: thisName.value, msg: thisVal.value});
    }
});

socket.on('chat', (data)=>{
    chatFunc(data.user, data.msg);
});

socket.emit('message', {user: thisName.value, mess: ' join the chat!'});

window.addEventListener("beforeunload", ()=>{
    socket.emit('endchat', {user: thisName.value, mess: ' left the chat!'});
});

socket.on('endchat', (data)=>{
    getMess(data.user, data.mess);
});


socket.on('message', (data)=>{
    getMess(data.user, data.mess);
});


function getMess(data1, data2){
    let rowBox = document.createElement("div");
    let txtBox = document.createElement("div");
    let createCont = document.createElement("div");

        thisItem.appendChild(rowBox);
        rowBox.appendChild(txtBox);
        createCont.innerHTML = "<b>" + data1  + "</b>" + data2;

        txtBox.className = "card p-3 bg-secondary m-2";
        rowBox.className = "row d-flex justify-content-start";
        createCont.className = "text-light ";
        txtBox.appendChild(createCont);
        thisItem.scrollTop = thisItem.scrollHeight;
}


function chatFunc(user, data){
    let d = Date(Date.now());
    let rowBox = document.createElement("div");
    let txtBox = document.createElement("div");

        thisItem.appendChild(rowBox);
        txtBox.className = "card p-3 bg-danger m-2";

        rowBox.appendChild(txtBox);
        rowBox.className = "row d-flex justify-content-start";

    let createCont = document.createElement("div");
    let createCont2 = document.createElement("div");
    let thisDate = document.createTextNode(d.toString());

            createCont.innerHTML = "<b>" + user + ": </b>" + data;
            createCont.className = "text-light ";
            createCont2.appendChild(thisDate);
            createCont2.className = "dateTime text-dark";
            txtBox.appendChild(createCont);
            txtBox.appendChild(createCont2);


                thisVal.value = "";
                thisItem.scrollTop = thisItem.scrollHeight;

}