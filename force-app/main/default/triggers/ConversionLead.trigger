trigger ConversionLead  on Lead (before update) {
for(Lead lead:Trigger.new) {
    if (lead.IsConverted) {
        Local__c l= [SELECT Id,Account_Name__c FROM Local__c WHERE Local__c.Id =:lead.Local__c];
       // con.Type__c = lead.Status;      
         l.Account_Name__c= lead.ConvertedAccountId; 
         update l;
         Opportunity o= [SELECT Id  FROM Opportunity WHERE Opportunity.Id =: lead.ConvertedOpportunityId];
        o.Local__c=lead.Local__c;
        o.Approval_Status__c='Pending';
        o.Source__c=lead.Lead_Source__c;
        update o;
         Account a= [SELECT Id  FROM Account WHERE Account.Id =: lead.ConvertedAccountId];
           a.Email__c=lead.Email;
           a.Source__c=lead.Lead_Source__c;
        update a;
    }
}
}