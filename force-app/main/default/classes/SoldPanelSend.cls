public class SoldPanelSend {
public SoldPanelSend() {
    }
    @future (callout=true)  
    public static void AddSoldPanelToSW(String id, String name){
        Http http = new Http();
        HttpRequest request = new HttpRequest();  
        request.setEndpoint('https://sw-state-panels.herokuapp.com/panels/create');
        request.setMethod('POST');
		request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setBody('[{"id":"'+id+'","status": "good","name":"'+name+'", "priority":"", "description":""}]');
    	HttpResponse response = http.send(request);
    	
        if (response.getStatusCode() != 201) {
       		 System.debug('The status code returned was not expected: ' +
            response.getStatusCode() + ' ' + response.getStatus());
    	} else {
        	System.debug(response.getBody());
    	}
    
    }
}