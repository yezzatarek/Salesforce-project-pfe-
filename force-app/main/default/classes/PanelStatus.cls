public class PanelStatus {
    public PanelStatus() {
    }
    @future(callout=true)
    public static void getBrokenPanel(){
       // ok var ok  
        List<Sold_Panel__c> PanelsToUpated = new List<Sold_Panel__c>() ;
        List<Sold_Panel__c> AllPanels = new List<Sold_Panel__c>() ;
        List<String> idToUpdate = new  List<String>() ;
        List<Sold_Panel__c> TestBrokenPanels = new List<Sold_Panel__c>();
        String identity;
        String status; 
        String name; 
        String priority; 
        String description; 
        Http http = new Http();
        HttpRequest request= new HttpRequest();
        request.setEndpoint('https://sw-state-panels.herokuapp.com/panels/state');
        request.setMethod('GET');
        HttpResponse response=http.send(request);

        if(response.getStatusCode()== 200){
            Map<String,Object> results= (Map<String,Object>) JSON.deserializeUntyped(response.getBody());
            List<Object> elements=(List<Object>) results.get('Panels') ;
            
           system.debug(results);
            system.debug(elements);
            
            Map<String, Object> i=new Map<String, Object> ();
            Map<String,String> priorities = new Map<String,String> () ;
            Map<String,String> descriptions = new Map<String,String> () ;
         
            // remplir idToUpdate par les ids des paneeaux en panne 
           for (Object e : elements) {
              i=(Map<String, Object>) e;
               identity=String.valueOf(i.get('id'));
               // test not broken before ading
               TestBrokenPanels = [SELECT  Panel_State__c	FROM Sold_Panel__c WHERE id= :identity AND Panel_State__c = 'broken'];
               if(TestBrokenPanels.isEmpty()){
                priorities.put(String.valueOf(i.get('id')),String.valueOf(i.get('priority')));
                descriptions.put(String.valueOf(i.get('id')),String.valueOf(i.get('description')));
                idToUpdate.add(identity);
               }
           }    
           PanelsToUpated = [SELECT  Id , Panel_State__c,Priority__c , Description__c   FROM Sold_Panel__c WHERE Id IN :idToUpdate] ;

            for(Sold_Panel__c p : PanelsToUpated ){
                
                system.debug(priorities.get(p.Id));
                system.debug(descriptions.get(p.Id)) ;      
                p.Priority__c=priorities.get(p.Id) ;
                p.Description__c=descriptions.get(p.Id);
                p.Panel_State__c = 'broken';
                
            }
        system.debug('+++++++++++++++++++++++'+PanelsToUpated);

           update PanelsToUpated ;
            
            
      /*  AllPanels = [SELECT  Id , Panel_State__c FROM Sold_Panel__c WHERE Panel_State__c='broken'] ;
        for( Sold_Panel__c p : AllPanels) {
                if(idToUpdate.contains(p.Id)==false) { p.Panel_State__c = 'good' ; }
            }
           update AllPanels ; */ 
    }
    }
    
}