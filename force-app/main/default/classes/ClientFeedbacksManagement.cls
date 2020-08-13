public with sharing class ClientFeedbacksManagement {

    @AuraEnabled(cacheable=true)
    public static List<Feedback__c> getFeedbacksByAccountId( String idAccount) {

        List<Feedback__c> result = new List<Feedback__c> ();
        result = [SELECT id_external_feedback__c , FeedbackTemplate__c , id , Name , format(CreatedDate)  FROM Feedback__c WHERE Account__c = :idAccount ORDER BY Name DESC  ] ;
        return result ;
    }

    @AuraEnabled(cacheable=true)
    public static List<Feedback__c> getFeedbacksBySearchName(String name){
        List<Feedback__c> result = new List<Feedback__c> ();
        result = [SELECT id_external_feedback__c , FeedbackTemplate__c	, id , Name , format(CreatedDate) FROM Feedback__c WHERE Name like :name  ORDER BY Name DESC ];
        return result ;
        
    }

    @AuraEnabled(cacheable=true)
    public static FeedbackTemplate__c getFeedbackTemplateById(String idFeedbackTemplate){
        FeedbackTemplate__c result = new FeedbackTemplate__c();
        result = [SELECT ID__c, id , Name , Description__c FROM FeedbackTemplate__c WHERE id= :idFeedbackTemplate ] ; 
        return result ;
    }

    @AuraEnabled(cacheable=true)
    public static List<Feedback_Question__c> getQuestionsByFeedbackTemplateId(String idTemplate ){
        List<Feedback_Question__c> result= new List<Feedback_Question__c>();
        result = [SELECT ID__c , id , Question__c FROM Feedback_Question__c WHERE FeedbackTemplate__c =:idTemplate];
        return result ;

    }

    @AuraEnabled(cacheable=true)
    public static Feedback_Answer__c getAnswerByFeedbackIdAndQuestionId(String idFeedback , String idQuestion ){
        Feedback_Answer__c result = new Feedback_Answer__c();
        result = [SELECT ID__c , id ,response__c, Name FROM Feedback_Answer__c WHERE Feedback_Question__c = :idQuestion  AND Feedback__c = :idFeedback ];
        return result ;
    }

    @AuraEnabled(cacheable=true)
    public static String getIdFeembackTemplateByFeedbackId(String idFeedback){
        String result= [SELECT FeedbackTemplate__c   FROM Feedback__c WHERE id = :idFeedback][0].FeedbackTemplate__c  ;
        return result ;
    }
 
}
 