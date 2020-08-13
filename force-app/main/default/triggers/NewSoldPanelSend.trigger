trigger NewSoldPanelSend on Sold_Panel__c (after insert) {
       Sold_Panel__c sold;
       List<Sold_Panel__c> sp= new List<Sold_Panel__c>();
        public list<Sold_Panel__c> listNewSoldPanel;

    for (Sold_Panel__c sp : Trigger.New){
        listNewSoldPanel=[Select Id, Product__r.Name from Sold_Panel__c  where id =: sp.Id];
            for(Sold_Panel__c soldPanel: listNewSoldPanel){
                 String id=soldPanel.Id;
                 String name=soldPanel.Product__r.Name;
             SoldPanelSend.AddSoldPanelToSW(ID,name);
            }
   
        

}
    
}