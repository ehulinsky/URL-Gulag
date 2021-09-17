setInterval(function() {
	reloadData();
}, 1000);



var entries=[]


//remove all entries from div
function clearEntries() {
	entries=[];
	list=document.getElementById('list');
	list.innerHTML="";
}

//add a domain to the list div
function appendEntry(domain,datetime) {
	
	list=document.getElementById('list');
	
	list.innerHTML+="<img class='icon' src='http://"+domain+"/favicon.ico'></img> "+domain+" <a id='n"+entries.length+"'>"+"</a></br>";
	reloadEntry(entries.length,datetime);
	
	entries.push(domain);
}

//change just the number so the screen doesnt flicker
function reloadEntry(id,datetime) {
	var d = new Date();
	var deltatime=d.getTime()-datetime;
	
	//convert to days
	displayTime = Math.floor(deltatime/(1000*60*60*24)).toString() +' days '+ (Math.floor(deltatime/(1000*60*60))%24).toString()+' hours '+(Math.floor(deltatime/(1000*60))%60).toString()+' minutes '+(Math.floor(deltatime/(1000))%60).toString()+' seconds';
	
	document.getElementById('n'+id).innerHTML = displayTime;
}


function reloadData() {
	chrome.storage.local.get('domains', function(data) {
		
		var i=0;
		data['domains'].forEach( function(entry) {
			if(entries[i]===entry[0]) {
				reloadEntry(i,entry[1]);
			}
			else
			{
				appendEntry(entry[0],entry[1]);
			}
			i++;
		});
	});
}


reloadData();


document.getElementById("add").addEventListener("click", function() {
	domainInput=document.getElementById("domain_input");
	domainValue=domainInput.value;
	
	chrome.storage.local.get('domains', function(data) {
		
		newData=[]
		domainFound=false;
		data['domains'].forEach( function(entry) {
			if(entry[0]===domainValue) {
				domainFound=true;
			}
			newData.push([entry[0],entry[1]]);
		});
		
		if(!domainFound) {
			var d = new Date();
			newData.push([domainValue,d.getTime()]);
		}
		console.log(newData);
		//save new array and reload display
		chrome.storage.local.set({'domains':newData}, function() {
			reloadData();
			if(!domainFound)
			{
				domainInput.value="";
			}
		}); 
	});
});

document.getElementById("remove").addEventListener("click", function() {
	
	domainInput=document.getElementById("domain_input");
	domainValue=domainInput.value;
	
	chrome.storage.local.get('domains', function(data) {
		
		//create new array, dont add deleted domain
		newData=[]
		data['domains'].forEach( function(entry) {
			if(entry[0]!==domainValue) {
				newData.push(entry);
			}
		});
		
		//save new array and reload display
		chrome.storage.local.set({'domains':newData}, function() {
			clearEntries();
			reloadData();
			domainInput.value="";
		}); 
	});
});