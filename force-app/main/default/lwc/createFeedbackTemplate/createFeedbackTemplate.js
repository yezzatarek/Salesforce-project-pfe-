import { LightningElement, api ,wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/FeedbackTemplate__c.Name';
import DESCRIPTION__C_FIELD from '@salesforce/schema/FeedbackTemplate__c.Description__c';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, fireEvent } from 'c/pubsub';
export default class CreateFeedbackTemplate extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @api objectApiName='FeedbackTemplate__c';
    fields = [NAME_FIELD, DESCRIPTION__C_FIELD];
    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "Feedback Template created",
          //  message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);
        fireEvent(this.pageRef, 'NewFeedbackTemplateCreated', event.target.value);
        fireEvent(this.pageRef, 'NewFeedbackTemplateReload', event.target.value);
        
        
        
       // document.location.reload(true);
    }
}