

function ajax(url, callback, params)
{
	var xmlHttp;
	try
	{
		// Firefox, Opera 8.0+, Safari
		xmlHttp=new XMLHttpRequest(url);
	}
	catch (e)
	{
		// Internet Explorer
		try
		{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function()
	{
		if(xmlHttp.readyState==4)
		{
			callback(xmlHttp.responseText);
		}
	}

	//Sending POST method.
	if (params)
	{
		xmlHttp.open("POST", url, true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.send(params);
	}
	//Sending GET method.
	else
	{
		xmlHttp.open("GET", url, true);
		xmlHttp.send(null);
	}
}

ajax.boundFunc = function(method) 
{
	var obj = this;
	return function() 
	{
		return method.apply(obj, arguments);
	};
}

