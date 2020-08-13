trigger FeedbackTemplateSend on FeedbackTemplate__c (after insert, after delete, after update) {
   if (Trigger.isInsert) {
     if (Trigger.isAfter) {
    for (FeedbackTemplate__c feedbacktemplate : Trigger.New){
                String id= feedbacktemplate.Id;
                String name=feedbacktemplate.Name;
                String description= feedbacktemplate.Description__c;
FeedbackManagement.AddFeedbackTemplateToSW(id,name,description);

    }}}
    else if  (Trigger.isDelete) {
        for (FeedbackTemplate__c feedbacktemplate : Trigger.old){
                            String idTodelete= feedbacktemplate.Id;

      FeedbackManagement.DeleteFeedbackTemplateFromSW(idTodelete);
            }}
    else if (trigger.isUpdate){
      List<FeedbackTemplate__c> feedbackInfor;
    for (FeedbackTemplate__c feedbacktemplate : Trigger.New){
         feedbackInfor=[select Id, Name,description__c from FeedbackTemplate__c where FeedbackTemplate__c.Id=: feedbacktemplate.id];   

        for(FeedbackTemplate__c ft:feedbackInfor){
        FeedbackManagement.UpdateFeedbackTemplateFromSW(ft.id, ft.name, ft.description__c);
        }
    

      
    }
    
        }
}