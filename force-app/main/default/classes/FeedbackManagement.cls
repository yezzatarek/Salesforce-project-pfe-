public with sharing class FeedbackManagement {
    public FeedbackManagement() {
    }

    @AuraEnabled(cacheable=true)
    public static List<FeedbackTemplate__c> getAllFeedbackTemplates(){

        List<FeedbackTemplate__c> result= [SELECT ID__c , Name FROM FeedbackTemplate__c];
        return result ;
    }

    @AuraEnabled(cacheable=true)
    public static List<FeedbackTemplate__c> getFilterFeedbackTemplates(String Name){
        List<FeedbackTemplate__c> result= [SELECT  ID__c , Name FROM FeedbackTemplate__c WHERE Name like :Name];
        return result ;
    }

    @AuraEnabled(cacheable=true)
    public static List<FeedbackTemplate__c> getFeedbackTemplatesById(String Id){
        List<FeedbackTemplate__c> result= [SELECT  ID__c , Name FROM FeedbackTemplate__c WHERE ID__c = :Id];
        return result ;
        
    }

    @AuraEnabled
    public static string deleteFeedbackTemplate(String IdTemplate ){
        List<Feedback_Question__c> QuestionsToDelete = new List<Feedback_Question__c> () ;
        QuestionsToDelete = [SELECT  ID__c , Question__c FROM Feedback_Question__c WHERE FeedbackTemplate__r.ID__c  = :IdTemplate];
        List<FeedbackTemplate__c> TemplateToDelete = new List<FeedbackTemplate__c> ();
        TemplateToDelete = [SELECT  ID__c , Name FROM FeedbackTemplate__c WHERE ID__c  = :IdTemplate];
        try {
            
                delete QuestionsToDelete;
            
            } catch (DmlException e) {
            }
        try {
            delete TemplateToDelete;
        } catch (DmlException e) {

        }
        return 'ok';
        
    }


    @AuraEnabled(continuation=true cacheable=true)
    public static List<Feedback_Question__c> getQuestionsByTemplateId(String Id){
        List<Feedback_Question__c> result = [SELECT  ID__c , Question__c FROM Feedback_Question__c WHERE FeedbackTemplate__r.ID__c  = :Id];
        return result ;
    }

    @AuraEnabled
    public static string updateFeedbackTemplate( String jsonInput ){
       // String jsonInput = '{"IdTemplate":"1","Questions":[{"ID__c":"5","Name":"Question 15"},{"ID__c":"1","Name":"Question 1"},{"ID__c":null,"Name":"bbbb"}]}' ;
        
        Map<String, Object> m = (Map<String, Object>)  JSON.deserializeUntyped(jsonInput);
        // get the id of feedback template
        String templateid=(String) m.get('IdTemplate') ;
        // get the internal id template
        List<FeedbackTemplate__c> internaltemplatelist = new List<FeedbackTemplate__c> ();
        internaltemplatelist = [SELECT  id   FROM FeedbackTemplate__c WHERE ID__c  = :templateid] ;
        // System.Debug(internaltemplatelist[0].id);
        
        // get the new list of questions related to the feedback template
        List<Object> questions=(List<Object>) m.get('Questions') ; 
        
        // check the json input  and put json questions in list of questions
        List<String> InputtedQuestionsNames = new List<String> ();
        List<String> InputtedQuestionsIds = new List<String> ();
        
        System.debug(templateid);
        Map<String, Object> i=new Map<String, Object> ();
        for(Object q : questions){
            i= (Map<String, Object>) q ;
           InputtedQuestionsNames.add(String.valueOf(i.get('Name')));
            InputtedQuestionsIds.add(String.valueOf(i.get('ID__c')));
           // System.debug(i.get('ID__c'));
           // system.debug(i.get('Name'));    
        } 
        // working here on update 
        Feedback_Question__c y = new Feedback_Question__c ();
        
		 List<Feedback_Question__c> RecentQuestions = new List<Feedback_Question__c> ();
        List<Feedback_Question__c> NewQuestions = new List<Feedback_Question__c> ();
        RecentQuestions = [SELECT  ID__c , Question__c FROM Feedback_Question__c WHERE FeedbackTemplate__r.ID__c  = :templateid] ;
       for(Feedback_Question__c q : RecentQuestions) {
            if(InputtedQuestionsIds.contains(q.ID__c)){
               // System.debug('contained');
               // System.debug(q.Name);
               q.Question__c=InputtedQuestionsNames[InputtedQuestionsIds.indexOf(q.ID__c)];
                NewQuestions.add(q);
            }else{
                //add action delete 
              //  System.debug('deleted');
              //  System.debug(q.Name);
              delete(q);
            }
        } 
        for( Integer z=0 ; z < InputtedQuestionsIds.size() ; z++ ){
            if(InputtedQuestionsIds[z]==null){
                
                NewQuestions.add(new Feedback_Question__c(Question__c=InputtedQuestionsNames[z] , FeedbackTemplate__c = internaltemplatelist[0].id  ) );
            }
        }       
           for( Feedback_Question__c el : NewQuestions ) {
            System.debug(el.Question__c);
            System.debug(el.ID__c);
        } 
         upsert NewQuestions ;
         
        return 'hello';
        
    }
     
    // Get informations about Feedback Template
    @AuraEnabled(cacheable=true)
    public static FeedbackTemplate__c getFeedbackTemplateInfo(String idTemplate) {
        FeedbackTemplate__c result = new FeedbackTemplate__c ();
        result = [SELECT id , Name , Description__c,isSent__c FROM FeedbackTemplate__c WHERE ID__c = :idTemplate][0];
        return result ;
    } 

    @AuraEnabled
    public static String updateFeedbackTemplateDetails (String idTemplate , String name , String descr) {
        FeedbackTemplate__c result = new FeedbackTemplate__c() ;
        result = [SELECT id , Name , Description__c FROM FeedbackTemplate__c WHERE ID__c = :idTemplate][0];
        result.Name=name ;
        result.Description__c=descr ;
        update(result); 
        return 'done' ;
    } 

    @AuraEnabled
    public static String updateIsSentTemplate (String idTemplate){

        FeedbackTemplate__c fd = [SELECT id , Name , isSent__c FROM FeedbackTemplate__c WHERE ID__c = :idTemplate][0] ;
        if(idTemplate == '131'){
            fd.isSent__c = false ;
        }else{
            fd.isSent__c = true ;
        }
        update(fd);
        return 'ok';
    }






  //Communication with Rest SW FeedbackTemplate
 
    
    /////////////////////////////////Ajout Feedback Template is WS
      @future (callout=true)  
    public static void AddFeedbackTemplateToSW(String id, String name, String description){
         Http http = new Http();
        HttpRequest request = new HttpRequest();  
        request.setEndpoint('https://sw-feedback-temp-questions.herokuapp.com/feedbacktemplate');
        request.setMethod('POST');
		request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setBody('{"id_feedbacktemplate":"'+id+'","name":"'+name+'","description":"'+description+'","feedbackQuestionlist":[]}');
    	HttpResponse response = http.send(request);
        if (response.getStatusCode() != 201) {
       		 System.debug('The status code returned was not expected: ' +
                          response.getStatusCode() + ' ' + response.getStatus());} 
                  else {System.debug(response.getBody());}} 
 /////////////////////////////////Delete Feedback Template is WS
      @future (callout=true)  
    public static void DeleteFeedbackTemplateFromSW(String id){
         Http http = new Http();
        HttpRequest request = new HttpRequest();  
        request.setEndpoint('https://sw-feedback-temp-questions.herokuapp.com/feedbacktemplate/delete/'+id);
        request.setMethod('DELETE');
    	HttpResponse response = http.send(request);
        if (response.getStatusCode() != 201) {
       		 System.debug('The status code returned was not expected: ' +
                          response.getStatusCode() + ' ' + response.getStatus());} 
                  else {System.debug(response.getBody());}}
/////////////////////////////////Update Feedback Template in WS
@future (callout=true)  
    public static void UpdateFeedbackTemplateFromSW(String id,String name,String description){
        //Body Request
   String feedback='{"id_feedbacktemplate":"'+id+'","name":"'+name+'","description":"'+description+'","feedbackQuestionlist":[';
//Get Questions     
        List<Feedback_Question__c> listquestions;
      listquestions=[select Id,Question__c from Feedback_Question__c where FeedbackTemplate__r.Id=: id];
        //Si template without question
        if (listquestions.size()==0){
     Http http = new Http();
        HttpRequest request = new HttpRequest();  
        request.setEndpoint('https://sw-feedback-temp-questions.herokuapp.com/feedbacktemplate');
        request.setMethod('PUT');
		request.setHeader('Content-Type', 'application/json;charset=UTF-8');
            request.setBody('{"id_feedbacktemplate":"'+id+'","name":"'+name+'","description":"'+description+'","feedbackQuestionlist":[]}');            
            	HttpResponse response = http.send(request);

        }
        //Sinon
        else{
        for(Feedback_Question__c q:listquestions){
        feedback=feedback+'{'+'"id_feedbackquestion":'+'"'+q.Id+'"'+','+'"question":'+'"'+q.Question__c+'"'+'},'; }
       feedback = feedback.substring(0,feedback.length()-1);
        feedback=feedback+']}';
        System.debug('+++++++++++++++++++++++++++'+id);  System.debug('++++'+name);  System.debug('++++'+description);
        Http http = new Http();
        HttpRequest request = new HttpRequest();  
        request.setEndpoint('https://sw-feedback-temp-questions.herokuapp.com/feedbacktemplate');
        request.setMethod('PUT');
		request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setBody(feedback);
    	HttpResponse response = http.send(request);
        if (response.getStatusCode() != 201) {
       		 System.debug('The status code returned was not expected: ' +
                          response.getStatusCode() + ' ' + response.getStatus());} 
            else {System.debug(response.getBody());}}} 

      //Communication with Rest SW FeedbackTemplate Questions
@future (callout=true)
    public static void UpdateFeedbackTemplateToSW(String id, String name, String description){
//Body Request
        String feedback='{"id_feedbacktemplate":"'+id+'","name":"'+name+'","description":"'+description+'","feedbackQuestionlist":[';
//Get Questions     
        List<Feedback_Question__c> listquestions;
        listquestions=[select Id,Question__c from Feedback_Question__c where FeedbackTemplate__r.Id=: id];
             
        for(Feedback_Question__c q:listquestions){
        feedback=feedback+'{'+'"id_feedbackquestion":'+'"'+q.Id+'"'+','+'"question":'+'"'+q.Question__c+'"'+'},'; }
        feedback = feedback.substring(0,feedback.length()-1);
        feedback=feedback+']}';
        Http http = new Http();
        HttpRequest request = new HttpRequest();  
        request.setEndpoint('https://sw-feedback-temp-questions.herokuapp.com/feedbacktemplate');
        request.setMethod('PUT');
		request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setBody(feedback);
    	HttpResponse response = http.send(request);
        if (response.getStatusCode() != 201) {
       		 System.debug('The status code returned was not expected: ' +
                          response.getStatusCode() + ' ' + response.getStatus());} 
            else {System.debug(response.getBody());}
    
    }
    
 
    // sending Template to Clients 

    @AuraEnabled
    public static String sendTemplateToClients (String idTemplate) {
        // get all adreeses to send
        String SalesforceIdTemplate  ;
        FeedbackTemplate__c feed = new FeedbackTemplate__c();
        feed = [SELECT id FROM FeedbackTemplate__c WHERE ID__c= :idTemplate ][0] ; 
        SalesforceIdTemplate = feed.id ;
        System.debug(SalesforceIdTemplate);
        
        List<Account> accounts = new List<Account> ();
        
        List<String> emails = new List<String> () ;
        accounts = [SELECT Email__c , id  FROM Account WHERE id in ('0013z00002PCIi9AAH' , '0013z00002Q51ReAAJ')] ;
        for(Account element : accounts){
            emails.add(element.Email__c);
        }
		
        
        
        
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {' '};
        for(Account acc : accounts ) {

        
        toAddresses[0] =  acc.Email__c;
        
        mail.setToAddresses(toAddresses);
        mail.setSenderDisplayName('feeback');
        mail.setSubject('New feedback to do');
        mail.setPlainTextBody('Url = : https://feedbackinterface.herokuapp.com/' + acc.id +'/' + SalesforceIdTemplate );
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        } 
        return 'ok';

        //configure the mail to send 
    }
    
    @AuraEnabled
    public static string sendingTemplateToClients(String jsonInput){
       // System.debug(jsonInput);
       Map<String ,Object> m = (Map<String ,Object>)  JSON.deserializeUntyped(jsonInput);
       System.debug(m.get('ids'));
        String ids = String.valueOf(m.get('ids'));
        String idTemplate = String.valueOf(m.get('idTemplate'));
       // System.debug(IdTemplate);
       // System.debug(ids);
        List<Object> n = (List<Object>) m.get('ids');
        
        
         
        
         List<String> accountIds = new List<String>() ;
        String x ;
        Map<String,Object> i = new Map<String,Object> ();
        for(Object e : n){
            i=(Map<String,Object>) e;
            //system.debug(i.get('id'));
            x=String.valueOf(i.get('id'));
             accountIds.add(x);
        }
        for(String acc: accountIds ) {
            system.debug(acc);
        }
        
        
        
        
        
        
        String SalesforceIdTemplate  ;
        FeedbackTemplate__c feed = new FeedbackTemplate__c();
        feed = [SELECT id FROM FeedbackTemplate__c WHERE ID__c= :idTemplate ][0] ; 
        SalesforceIdTemplate = feed.id ;
        System.debug(SalesforceIdTemplate);
        
        List<Account> accounts = new List<Account> ();
        
        List<String> emails = new List<String> () ;
        System.debug(accountIds.isEmpty());
        if(accountIds.isEmpty()==true){
            accounts = [SELECT Email__c , id  FROM Account ] ;
        }else{
            accounts = [SELECT Email__c , id  FROM Account WHERE id in :accountIds] ;
        }
        
        for(Account element : accounts){
            emails.add(element.Email__c);
        }
		
        
        
        
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {' '};
        for(Account acc : accounts ) {

        
        toAddresses[0] =  acc.Email__c;
        
        mail.setToAddresses(toAddresses);
        mail.setSenderDisplayName('feeback');
        mail.setSubject('New feedback to do');
        mail.setPlainTextBody(' Hi, \n To help us improve our services, \n we would  like to ask you a few questions about your experience so far. It will only take 3 minutes, and your answers will help us create experienxe for you and for all of our customers. Thanks, \n Marketing Team \n Url = : https://feedbackinterface.herokuapp.com/' + acc.id +'/' + SalesforceIdTemplate );
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        } 
        return 'ok';
    }

    // END sending Template to Clients 
    
    
    
}