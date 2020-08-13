import { LightningElement, wire, api } from 'lwc';
import getAllFeedbackTemplates from "@salesforce/apex/FeedbackManagement.getAllFeedbackTemplates";
import getFilterFeedbackTemplates from "@salesforce/apex/FeedbackManagement.getFilterFeedbackTemplates";
import { fireEvent, registerListener } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import deleteFeedbackTemplate from "@salesforce/apex/FeedbackManagement.deleteFeedbackTemplate";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class FeedbackList extends LightningElement {
    @wire(getAllFeedbackTemplates)
    AllFeedbackTemplates;
    @wire(getFilterFeedbackTemplates, { Name: '$FeeddbackTemplateFilterName' })
    FilteredFeedbackTemplates;
    @wire(CurrentPageReference) pageRef;

    @api search = false;
    @api FeeddbackTemplateFilterName = '';
     ModalActive=false ;
     ValueToModal = '';

    connectedCallback() {
        registerListener('NewFeedbackTemplateCreated', this.handlereloadComponent, this);
        registerListener('refreshLoadTemplateFromModalAction', this.handlerefreshLoadTemplateFromModalAction, this);
    }

    handlerefreshLoadTemplateFromModalAction = (key) => {
        console.log(key);
        refreshApex(this.AllFeedbackTemplates) ;
        refreshApex(this.FilteredFeedbackTemplates);
    }

    handlereloadComponent = (evt) => {
        refreshApex(this.AllFeedbackTemplates);
        refreshApex(this.FilteredFeedbackTemplates);

    }

    getFilteredFeedbackTemplates = (event) => {
        if (event.target.value == '') {
            this.search = false;
        } else {
            this.search = true;
            this.FeeddbackTemplateFilterName = '%' + event.target.value + '%';
        }
    }
    handleKeyUp = (event) => {

    }
    handleNew = (event) => {
        fireEvent(this.pageRef, 'createNewTemplate', event.target.value);

    }
    handleModify = (event) => {
        fireEvent(this.pageRef, 'selectTemplate', event.target.value);
        fireEvent(this.pageRef, 'modifyTemplate', event.target.value);
        fireEvent(this.pageRef, 'NewModyQuestions', event.target.value); 




    }

    handleDeleteTemplateSelected = (event) => {
        this.ModalActive=true ;
        this.ValueToModal=event.target.value ;

        


    }

    handleModalDeleteButton = (event) =>{
        deleteFeedbackTemplate({ IdTemplate: this.ValueToModal })
        .then( res => {
            console.log("deleted");
            refreshApex(this.AllFeedbackTemplates);
            refreshApex(this.FilteredFeedbackTemplates);
        });
        this.ModalActive=false ;
        const evt = new ShowToastEvent({
            title: "Feedback Template Deleted",
          //  message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);
        fireEvent(this.pageRef, 'noQuestionsdisplay', event.target.value);


    }

    handleModalCancelButton = (event) =>{
        this.ModalActive=false ;

    }

    

    
}