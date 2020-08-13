import { LightningElement, wire, api } from 'lwc';
import getFeedbacksByAccountId from '@salesforce/apex/ClientFeedbacksManagement.getFeedbacksByAccountId';
import getFeedbacksBySearchName from '@salesforce/apex/ClientFeedbacksManagement.getFeedbacksBySearchName';
import { fireEvent ,registerListener  } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import EMPTYSPACE from '@salesforce/resourceUrl/emptySpace'; 

export default class FeedbackExplorationFeebackList extends LightningElement {
 
    @api accountId = '' ;
    @api filterFeedbackName = '';
    @api searchActivation = false;
     feedbackLoad = false;
    @wire(getFeedbacksByAccountId , {idAccount : '$accountId'})
    feedbacks;
    @wire(getFeedbacksBySearchName, {name : '$filterFeedbackName'})
    filteredFeedbacks;
    @wire(CurrentPageReference) pageRef;
    EmptySpace=EMPTYSPACE ;
    

    connectedCallback() {
        registerListener('searchFeedback', this.getFeedbacks, this); 
    }

    getFeedbacks = (key) =>{
        this.feedbackLoad=true;
        this.accountId = key ; 
        this.searchActivation = false ;
        refreshApex(feedbacks);

    }

    getFilteredFeedbacks = (event) =>{
        
        this.filterFeedbackName = '%' + event.target.value + '%' ;
        this.searchActivation = true ;
        
    }





    handleShow = (event) => {
        fireEvent(this.pageRef, 'getFeedbackAnswers', event.target.value);
        fireEvent(this.pageRef, 'getFeedbackDetails', event.target.value); 

    }





    handleKeyUp = (event) => {

    }


}