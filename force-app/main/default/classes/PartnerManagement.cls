public inherited sharing class PartnerManagement {
       
    @AuraEnabled(Cacheable = true)
    public static List<Partners__c> getPartners(){
        return [SELECT Id, Name,Phone__c, Adress__c,Fax__c,Email__c, Description__c,Sector__c  FROM Partners__c];
    }
    
@AuraEnabled
    public static void deletePartners(list<Id> lstConIds){
        try {
            list<Partners__c> lstConsToDelete = new list<Partners__c>();
            System.debug('lstConIds ====> '+lstConIds);
            for(Id idCon : lstConIds) {
                lstConsToDelete.add(new Partners__c(Id = idCon));
            }
            if(!lstConsToDelete.isEmpty()) {
                delete lstConsToDelete;
            }
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
    
    
    @AuraEnabled
    public static Partners__c createPartner(Partners__c p) {
        system.debug('p'+p);
        insert p;
        return p;
    }
    
@AuraEnabled
    public static List<Partners__c>   getPartnersList(String searchKey){
        String  sTempSearchKey='%' + searchKey +'%';
        list<Partners__c> lstPartner = new list<Partners__c>();
    for (Partners__c par :[Select Id, Name,Phone__c, Adress__c,Fax__c,Email__c,
                           Sector__c,Description__c  FROM Partners__c where Name LIKE : sTempSearchKey
                          ]){
         lstPartner.add(par);
                              
                          }
        if (lstPartner.size() ==0){
            throw new AuraHandledException('No Record Found..');
        }
        return lstPartner;
    
    }
   
    
    @AuraEnabled
    public static void UpdatePartner(list<Id> lstPartner){
        try {
            list<Partners__c> lstConsToUpdate = new list<Partners__c>();
            System.debug('lstPartner ====> '+lstPartner);
            for(Id idPartner : lstPartner) {
                lstConsToUpdate.add(new Partners__c(Id = idPartner));
            }
            if(!lstConsToUpdate.isEmpty()) {
                update lstConsToUpdate;
            }
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
    
    
}