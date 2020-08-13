trigger NewCasePanelBroken on Sold_Panel__c (after update) {
      public list<Sold_Panel__c> listeSoldPanels;  
          // List<Case> cases= new List<Case>();
    Case c ;
    public static boolean firstRun = true;
    List<String> i=new List<String>();
   for (Sold_Panel__c sp: Trigger.New){
   listeSoldPanels=[Select Id, Local__r.Name,Account__r.Name,Product__r.Name,Local__r.Adresse__c,Priority__c,Description__c from Sold_Panel__c where id =: sp.Id ];
       if (sp.Panel_State__c=='broken'){
          system.debug('****************'+listeSoldPanels);
            for(Sold_Panel__c listSoldPanel: listeSoldPanels){
                c  =new Case();
                c.Sold_Product__c=listSoldPanel.id;
                c.Local__c=listSoldPanel.Local__c;
                c.AccountId=listSoldPanel.Account__c;
                c.Status='New';
                c.Priority=listSoldPanel.Priority__c;
                c.Origin='Web';
                c.Subject='Failure detection in Solar Panel';
                c.Description='A change in the state of the Solar Panel'+' '+listSoldPanel.Product__r.Name+' '+'has been detected because of'+' '+listSoldPanel.Description__c;
                 //cases.add(c);
            }
             System.debug('cases'+c);

      insert c;
            
    /*  if (firstRun) {
	firstRun = false;
      }
      else {
	System.debug('Already ran!');
	return;
}*/
}

        


    
    }


}