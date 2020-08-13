public class FeedbackResponseCallout {
    
    public FeedbackResponseCallout(){}
    
    public static void getFeedbackResponse(){
        String external_id;
        String client;
        String feedbackTemplate;
     Http http = new Http();
        HttpRequest request= new HttpRequest();
        request.setEndpoint('https://sw-feedback-temp-questions.herokuapp.com/feedback');
        request.setMethod('GET');
        HttpResponse response=http.send(request);
             //Add Feedback 
                if(response.getStatusCode()== 200){
            Map<String,Object> results= (Map<String,Object>) JSON.deserializeUntyped(response.getBody());
            List<Object> elements=(List<Object>) results.get('FeedbackResponses') ;
           Map<String, Object> i=new Map<String, Object> ();
           for (Object e : elements) {
             i=(Map<String, Object>) e;
            external_id=String.valueOf(i.get('id_feedback'));
            client=String.valueOf(i.get('id_client'));
           feedbackTemplate=String.valueOf(i.get('feedback_template'));
   Feedback__c f= new Feedback__c(Name='Feedback'+external_id ,id_external_feedback__c=external_id,Account__c=client,FeedbackTemplate__c= feedbackTemplate);
            Database.insert(f, false); 
           //Get response 
      List<Object> responseFeedback=(List<Object>) i.get('feedbackResponselist') ;     
               system.debug('***********responssssssssssssse*'+responseFeedback);
               //Tarek modif
               List<Feedback_Answer__c> answers = new List<Feedback_Answer__c> ();
               // END Tarek modif
                    Map<String, Object> r=new Map<String, Object> ();
                    for (Object res : responseFeedback) {
                        r=(Map<String, Object>) res;
                       String external_id_response=String.valueOf(r.get('id_feedbackresponse'));
                       String question=String.valueOf(r.get('id_question'));
                       String responseclient=String.valueOf(r.get('response'));
                        System.debug('external_id_response++++++++++++'+external_id_response);
                        System.debug('question++++++++++++'+question);
                        System.debug('responseclient++++++++++++'+responseclient);
                        
                //Get id Salesforce Feedback inserted      
            String ids=[Select id from Feedback__c where id_external_feedback__c=: external_id].id;
                //insert into answer 
         Feedback_Answer__c answer =new Feedback_Answer__c(Name='Answer'+external_id_response,id_external_response__c=external_id_response,Feedback__c=ids,Feedback_Question__c=question,response__c=responseclient);
                
                         //   Database.insert(answer, false); 
        answers.add(answer);
                        
                    
                    }
               insert(answers);
           }}
    
    
        
    }

    	
    
     
}