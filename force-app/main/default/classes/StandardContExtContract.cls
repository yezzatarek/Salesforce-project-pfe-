public class StandardContExtContract {
			private  Facture__c facture {get;set;} 
			public String currentRecordId {get;set;}
      private Account acc;
    private Opportunity opp;
      public list<OpportunityLineItem> listOppobjects; 
    public StandardContExtContract(){}
   public StandardContExtContract(ApexPages.StandardController controller){
 this.facture = (Facture__c )controller.getRecord(); 
 this.facture= [select Id,Opportunity__r.Id,Contract_Name__c,Name,
                Start_Date__c,End_Date__c,Account__r.Name, Account__r.Email__c , 
                Account__r.Phone, Opportunity__r.AccountId, Opportunity__r.Amount from Facture__c where Id  =: facture.Id];
     acc= [select Name,Phone,Email__c from Account where Account.id =:getAccountId()] ; 
     opp =[select Local__r.Adresse__c from Opportunity where Id=:getOppId()];

       String myGeneratedFileName = 'Contract:'+getFactureNumber()+'_'+getNameAccount()+'.pdf';
       Apexpages.currentPage().getHeaders().put('content-disposition', 'inline; filename='+myGeneratedFilename);   }
   
    
    //Information geted directement from Object Facture(Contract)
     public String getFactureName(){
        return facture.Contract_Name__c;
    }
    
    public String getFactureNumber(){
        return facture.Name;
    }
    
    public Date getStartDate(){
        return facture.Start_Date__c;
    }
    
    public Date getEndDate(){
        return facture.End_Date__c;
    }
    
    public Decimal getAmountOpp(){
        return facture.Opportunity__r.Amount;
    }
    
    // Informations geted from Opportunité related to Facture(Contract)
    public String getOppId(){
        return facture.Opportunity__r.Id;
    }
    
     public String getOppName(){
        return facture.Opportunity__r.Name;
    }
    public String getNameOppId(){
        return opp.Local__r.Adresse__c;
    }
    
   //Informations to get Porducts from Opportunity  
    public list<OpportunityLineItem> getOppInfos(){
     listOppobjects=[SELECT Id, Product2.Name,Quantity,ListPrice,TotalPrice,UnitPrice,Subtotal  FROM OpportunityLineItem WHERE Opportunity.id =: getOppId()];
        
       return  listOppobjects;
    }
    
    public String getAccountId(){
                return facture.Opportunity__r.AccountId;
}
    
    
    
    
    
    
    //Informations geted from Account related to Opportunity related to Facture(Contract)
    public String  getNameAccount(){
        return acc.Name ; 
    }  
    public String getAccountPhone(){
        return acc.Phone;
    }
    
    public String getAccountEmail(){
        return acc.Email__c;
    }
   
}