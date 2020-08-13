import { LightningElement,wire,api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, fireEvent } from 'c/pubsub';
import EMPTYSPACE from '@salesforce/resourceUrl/emptySpace';
import getFeedbackTemplateInfo from '@salesforce/apex/FeedbackManagement.getFeedbackTemplateInfo';

export default class FeedbackManagementInterface extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    NewTemplateDisplay=false ;
    ModifyTemplateDisplay=false;
    idSelectedTemplate='';
    imageDisplay=true ;
    isSentSelectedTemplate=false;
    @api EmptySpace = EMPTYSPACE; 
    connectedCallback() {
       
        registerListener('createNewTemplate', this.handleNewTemplate, this);
        registerListener('modifyTemplate', this.handleModifyTemplate, this);
        registerListener('selectTemplate', this.handleSelectedTemplate, this);
        registerListener('NewFeedbackTemplateReload', this.handlereloadNewTemplateComponent, this);
        registerListener('noQuestionsdisplay', this.handlenoQuestionsdisplay, this);
    } 

    handlenoQuestionsdisplay = (key) => {
        this.NewTemplateDisplay=false ;
        this.ModifyTemplateDisplay=false;
        this.imageDisplay=true;
    }
    handlereloadNewTemplateComponent = (evt) =>{
        this.NewTemplateDisplay=false ;
        this.imageDisplay=true;
        
    }

    handleNewTemplate = (key) => {
        this.ModifyTemplateDisplay=false;
        this.NewTemplateDisplay=true ;
        this.imageDisplay=false;

    }

    handleModifyTemplate = (key) => {
        getFeedbackTemplateInfo({idTemplate : this.idSelectedTemplate}).then(res => {
            // console.log(res.isSent__c);
            this.isSentSelectedTemplate=res.isSent__c ; 
            this.NewTemplateDisplay=false ;
            this.ModifyTemplateDisplay=true;
            this.imageDisplay=false;
        }); 
        
    }

    handleSelectedTemplate = (tempkey) => {
        
        console.log(tempkey);
        this.idSelectedTemplate=tempkey ;
        this.imageDisplay=false;
        
        
    }

}