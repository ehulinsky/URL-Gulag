function createPopup(){
    console.log("Created");
    var div = document.createElement("div");
	div.id = "URL_Gulag_popup"
	div.style.background="chrome-extension://fbmkfmefmcnofaphjnpegncejakldehk/stalin.png";
	div.style.all = "initial";
    div.style.width = "200px";
    div.style.height = "200px";
	div.style.position = "fixed";
	div.style.left="50%";
	div.style.top="50%";
	div.style.transform="translate(-50%, -50%)";
	div.style.backgroundColor="red";
	div.style.visibility = "hidden";
	div.style.zIndex = "100000000";
    div.innerHTML = "Oh no comrade!!! You let <div style='all:inital' id='URL_Gulag_popup_domain'> WEBSITE </div> escape the Gulag!!!! Close the tab for the motherland!!!! </br> <a style='font-size:30px;' id='URL_Gulag_popup_button'> ok</a>";
    document.body.appendChild(div);
}


function showPopup(domain) {
	var popup=document.getElementById("URL_Gulag_popup");
	popup.style.visibility = "visible";
	popup.innerHTML= "Oh no comrade!!! You let "+domain+" escape the Gulag!!!! Close the tab for the motherland!!!! </br> <a style='font-size:30px;' id='URL_Gulag_popup_button'> ok</a>";
	
	//i think it creates a new element when you change the html so you need to redo this
	document.getElementById("URL_Gulag_popup_button").addEventListener("click", hidePopup);
	//var domainDiv=document.getElementById("URL_Gulag_popup_domain");
	//domainDiv.innerHTML=domain;
	
}

function hidePopup() {
	var popup=document.getElementById("URL_Gulag_popup");
	popup.style.visibility = "hidden";
}




createPopup();
hidePopup();


//send a message to background script when page is loaded
//then if the response is an alert_domain show the alert
chrome.runtime.sendMessage({message: "loaded"}, function(response) {
	if(response.alert_domain) {
		showPopup(response.alert_domain);
	}
});
