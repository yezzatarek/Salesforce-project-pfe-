public with sharing class CaseManagement  {

    public static String globalaccountid = '' ;
    

    @AuraEnabled(cacheable=true)
    public static List<Case> getCase(){
        List<Case> result=[SELECT CaseNumber, Status, Subject FROM Case ];
        return result;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccount(){

        List<Account> result=[SELECT Id , Name FROM Account  Limit 20];
        return result;
    }

    @AuraEnabled(cacheable=true)
    public static List<Local__c> getLocal(){
        List<Local__c> result=[SELECT Name FROM Local__c ];
        return result ;
        
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getFilterAccount( String accountName){
        List<Account> result=[SELECT Id , Name FROM Account  WHERE Name LIKE  :accountName];
        return result;
        
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getFFilterCase(String accountId){
        if(accountId==''){
            List<Case> result=[SELECT CaseNumber , Subject ,Local__c, Status from Case WHERE Status IN ( 'New' , 'Closed')];
            return result;
        }else{
        List<Case> result=[SELECT CaseNumber , Subject ,Local__c, Status from Case WHERE AccountId = :accountId AND Status IN ( 'New' , 'Closed')];
        return result ;
        }
    }

    @AuraEnabled(cacheable=true)
    public static string getCaseStatus(String caseNumber){
        Case c = new Case();
        c=[SELECT Id, Status FROM Case WHERE CaseNumber = :caseNumber ][0] ; 
        return c.Status ;
    } 

    @AuraEnabled(cacheable=true)
    public static integer modifyCaseProperties (String accountId) {
        globalaccountid=accountId;
        return 0 ;
        
    }
    @AuraEnabled(cacheable=true)
    public static List<Case> caseLoadDescription (String caseNumber){
        
        List<Case> result=[SELECT CaseNumber, Status, Subject , Description , CreatedDate , Origin , Local__c , Priority FROM Case
        WHERE CaseNumber = :caseNumber];
        return result ;

    }

    @AuraEnabled(cacheable=true)
    public static String getCaseDate(String CaseNumber){
        Case result= new Case();
        List<Case> x= new List<Case> ();
         x=[SELECT Id,CaseNumber, Status, Subject , Description , CreatedDate , Origin , Local__c , Priority FROM Case
        WHERE CaseNumber = :caseNumber];
        result=x[0];
        
        System.debug(String.valueOf(result.CreatedDate));
        return String.valueOf(result.CreatedDate) ;
        
    }

    @AuraEnabled(cacheable=true)
    public static String getCaseId(String CaseNumber){
        Case result= new Case();
        List<Case> x= new List<Case> ();
         x=[SELECT Id,CaseNumber, Status, Subject , Description , CreatedDate , Origin , Local__c , Priority FROM Case
        WHERE CaseNumber = :caseNumber];
        result=x[0];
        
        System.debug(String.valueOf(result.Id));
        return String.valueOf(result.Id) ;
        
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> accountLoadDescription(String account){
        List<Account> result=[SELECT Id , Name , Phone , Website , Email__c , Description ,Fax ,  RecordType.DeveloperName  FROM Account WHERE Id= :account];
        return result ;
        
    }

    @AuraEnabled(cacheable=true)
    public static String getAccountRecordType(String accountId){
        Account result=[SELECT Id , Name , RecordType.DeveloperName  FROM Account WHERE Id= :accountId][0];
        return result.RecordType.DeveloperName ;
    }

    @AuraEnabled(cacheable=true)
    public static List<Local__c> caseLocationLoad(String LocalNumber){
        List<Local__c> result = [SELECT Name, Street__c , Adresse__c , City__c , PostalCode__c , State__c , Country__c From Local__c WHere Id= :LocalNumber        ]; 
        return result ;
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> searchCaseLoad(String caseNumber){
        if(caseNumber==''){
            List<Case> result=[SELECT CaseNumber , Subject ,Local__c, Status from Case WHERE Status IN ( 'New' , 'Closed')];
            return result;
        }else{
        List<Case> result=[SELECT CaseNumber , Subject ,Local__c, Status from Case WHERE CaseNumber like :caseNumber AND  Status IN ( 'New' , 'Closed')];
        return result ;
        }
        
    }

   @AuraEnabled
    public static Integer deleteCase(String caseNumber){
        List<Case> doomedCases= [SELECT Id, CaseNumber  , Subject FROM Case WHERE CaseNumber = :caseNumber];
        try {
            delete doomedCases ;
        }catch(DmlException e){
            

        }
        return 1 ;
    }

    @AuraEnabled
    public static Integer transmitCase(String caseNumber){
        
        List<Case> queriedCase = [SELECT Id, CaseNumber  , Subject , Status FROM Case WHERE CaseNumber = :caseNumber];
        for(Case c : queriedCase ){
            c.Status = 'Escalated';
        }
        try {
        upsert queriedCase ; 
        }catch(Exception e){
            system.debug(e);

        }
        return 1 ;
        
    }

    @AuraEnabled
    public static Integer CloseCase(String caseNumber){
        List<Case> queriedCase = [SELECT Id, CaseNumber  , Subject , Status FROM Case WHERE CaseNumber = :caseNumber];
        for(Case c : queriedCase ){
            c.Status = 'Closed';
        }
        try {
        upsert queriedCase ; 
        }catch(Exception e){
            system.debug(e);

        }
        return 1 ; 
        
        
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getAllEscalatedCases(){
        List<Case> result = new List<Case> ();
        result = [SELECT Id, CaseNumber  , Subject , Status , Technician__r.Name , Description FROM Case WHERE Status IN ('Assigned' , 'Escalated' )];
        return result ;
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getFiltereddEscalatedCases(String inputtedValue){
        List<Case> result = new List<Case> ();
        result = [SELECT Id, CaseNumber  , Subject , Status , Technician__r.Name , Description FROM Case WHERE Status IN ('Assigned' , 'Escalated') AND (CaseNumber LIKE :inputtedValue OR Subject LIKE :inputtedValue OR Status LIKE :inputtedValue)];
        return result ;
        
    }
    
    @AuraEnabled(cacheable=true)
    public static string getTechnicianName(String caseNumberInput){
        Case x= new Case();
        x=[SELECT Id, CaseNumber  , Subject , Status , Technician__r.Name , Description FROM Case WHERE CaseNumber = :caseNumberInput ][0];
        String result = x.Technician__r.Name ;
        return result ;
    }

    @AuraEnabled
    public static string assignCase(String idCase){
        Case x = new case();
        x = [SELECT Id , CaseNumber ,  Status FROM Case WHERE Id = :idCase][0];
        x.Status='Assigned';
        upsert(x) ;
        return 'ok' ; 
        
    }

    
}
