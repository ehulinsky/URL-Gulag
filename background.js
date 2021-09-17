jail = new Map();


  //copy saved data to map
chrome.storage.local.get('domains', function(data) {
	
	if (data['domains']) {
		if(Array.isArray(data['domains'])) {
			
			data['domains'].forEach( function(domain) {
				
				jail.set(domain[0],domain[1]);
				
			});
		}
	}
	else {
		chrome.storage.local.set({'domains':[]},function(){});
	}
});





setInterval(function() {
	chrome.tabs.query({}, updateDates);
}, 1000);


//if a link is open, set the last used datetime to the current datetime
function updateDates(tabs) {
	
	
	var newData = [];
	
	d=new Date();
	//update stored data and local map
	chrome.storage.local.get('domains', function(data) {
		
			jail=new Map();
			for(let entry of data['domains']) {
				
				let found = false;
				for(let tab of tabs) {
					let domain=urlToDomain(tab.url);
					if (entry[0]===domain) {
						newData.push([entry[0],d.getTime()]);
						jail.set(entry[0],d.getTime());
						found = true;
						break;
					}
				}
				
				if(!found) {
					newData.push(entry);
					jail.set(entry[0],entry[1]);
				}
				
			}
			chrome.storage.local.set({'domains':newData},function(){});
	});
	
			
			
			
			//Array.from(jail.keys()).forEach(key => console.log(key,jail.get(key))		
}



function urlToDomain(url) {
	let domain = (new URL(url));
	domain = domain.hostname;
	domain = domain.replace("www.","");
	return domain;
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	
    if (request.message === "loaded") {
		
		chrome.tabs.query({}, updateDates);
		domain = urlToDomain(sender.tab.url);
		if(Array.from(jail.keys()).includes(domain)) {
			sendResponse({alert_domain: domain});
		}
		else {
			sendResponse({});
		}
      
	}
  }
);



chrome.browserAction.onClicked.addListener(function() {
   chrome.windows.create({'url': 'popup.html', 'type': 'popup'}, function(window) {
   });
});