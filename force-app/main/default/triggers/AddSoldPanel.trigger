trigger AddSoldPanel on Opportunity (after update) {
  //public Sold_Panel__c s;
  public list<OpportunityLineItem> listOppobjects;
    //public Product2 prd;
    Sold_Panel__c sold;
    //private Opportunity oppLocal;
    //List<Product2> produit= new List<Product2>();
       List<Sold_Panel__c> sp= new List<Sold_Panel__c>();
     for (Opportunity opp: Trigger.New){
    listOppobjects=[SELECT Id, Product2.Id,Quantity FROM OpportunityLineItem oppline WHERE Opportunity.id =:opp.Id];
    String acc= [select Local__r.Account_Name__c from Opportunity where id =:opp.Id].Local__r.Account_Name__c;
     String adressLocal=[select Local__r.Adresse__c from Opportunity where id =: opp.Id].Local__r.Adresse__c;
         if (opp.StageName== 'Closed Won'){
            for(OpportunityLineItem a: listOppobjects){
                sold  =new Sold_Panel__c();
               sold.Local__c=opp.Local__c;
                sold.Account__c=acc;
                sold.Panel_State__c='good';
                sold.Local_Adress__c=adressLocal;
               sold.Opportunity__c=opp.Id;
               sold.Product__c=a.Product2.Id;
               sold.Quantity__c=a.Quantity;
                 sp.add(sold);  
                  
            }
            insert sp;
        }
            
     }
}