trigger FeedbackQuestionsSend on Feedback_Question__c (after insert, after update) {
    List<Feedback_Question__c> listQuest;
    for (Feedback_Question__c feedbackquestion : Trigger.New){
         listQuest=[select FeedbackTemplate__r.Id, FeedbackTemplate__r.Name, FeedbackTemplate__r.description__c from Feedback_Question__c where Feedback_Question__c.Id=: feedbackquestion.id];   

        for(Feedback_Question__c fq:listQuest){
       //FeedbackQuestionsCallout.UpdateFeedbackTemplateToSW(fq.FeedbackTemplate__r.Id,fq.FeedbackTemplate__r.Name, fq.FeedbackTemplate__r.description__c);
        FeedbackManagement.UpdateFeedbackTemplateToSW(fq.FeedbackTemplate__r.Id,fq.FeedbackTemplate__r.Name, fq.FeedbackTemplate__r.description__c);
        }
    

    }
}