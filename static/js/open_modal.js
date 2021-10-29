function show_modal_localy(targetUrl,htmlCode, width, height){
				
				if (typeof(window.nanoRep) === 'undefined') window.nanoRep = {};
				if (typeof(window.nanoRep.Soup) === 'undefined') window.nanoRep.Soup = {};
				if (typeof(window.nanoRep.Soup.ImageBox) === 'undefined') {
					window.nanoRep.Soup.ImageBox = {};
					var sc = document.createElement("script"); 
					sc.src = '//cdn-customers.nanorep.com/common/js/nanorep.soup.imagebox.js';
					document.head.appendChild(sc);
					window.nanoRep.Soup.ImageBox.onload = function()
					{
						nanoRep.Soup.ImageBox.init({
							zIndexBase: 2000
						});
					}
					if (targetUrl!==null && targetUrl!=="" && targetUrl)
						setTimeout(function(){window.nanoRep.Soup.ImageBox.show(targetUrl);},200);
					//else
					//setTimeout(function(){window.nanoRep.Soup.ImageBox.showBox(htmlCode, width, height);},200);
				}
	
				
				else {
					if (targetUrl!==null)
							window.nanoRep.Soup.ImageBox.show(targetUrl);
					else 
						window.nanoRep.Soup.ImageBox.showBox(htmlCode, width, height);
				}
}