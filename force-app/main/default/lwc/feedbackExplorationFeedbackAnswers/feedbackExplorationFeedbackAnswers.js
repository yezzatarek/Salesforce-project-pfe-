import { LightningElement, api, wire, track } from 'lwc';
import getQuestionsByFeedbackTemplateId from '@salesforce/apex/ClientFeedbacksManagement.getQuestionsByFeedbackTemplateId';
import getAnswerByFeedbackIdAndQuestionId from '@salesforce/apex/ClientFeedbacksManagement.getAnswerByFeedbackIdAndQuestionId';
import getIdFeembackTemplateByFeedbackId from '@salesforce/apex/ClientFeedbacksManagement.getIdFeembackTemplateByFeedbackId';
import { fireEvent, registerListener } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import EMPTYSPACE from '@salesforce/resourceUrl/emptySpace';
export default class FeedbackExplorationFeedbackAnswers extends LightningElement {


    @api idFeedbackTemplate = '';
    @api idFeedback = '';
    answersLoad = false;
    @wire(CurrentPageReference) pageRef;
    EmptySpace = EMPTYSPACE;
    /* @wire(getQuestionsByFeedbackTemplateId , { idTemplate : '$idFeedbackTemplate' })
     questions; */

    @track AQList = [

    ];

    connectedCallback() {

        registerListener('getFeedbackAnswers', this.handleanswers, this);

    }

    handleanswers = (key) => {
        console.log('feedback');
        console.log(key);

        getIdFeembackTemplateByFeedbackId({idFeedback : key}).then(res => {
            this.AQList = [];
            this.idFeedbackTemplate = res;
            this.idFeedback = key;
            console.log('idtemplate');
            console.log(this.idFeedbackTemplate);
            //console.log(this.idFeedback);

            // update AQList 
            getQuestionsByFeedbackTemplateId({ idTemplate: this.idFeedbackTemplate }).then(result => {
                result.forEach(element => {
                   // console.log(element.Name);
                   // console.log(element.Id);
                    //console.log(element.Name);
                    
                    getAnswerByFeedbackIdAndQuestionId({ idFeedback: this.idFeedback, idQuestion: element.Id }).then(r => {
                        console.log('hello');
                        console.log(r.Name);
                        console.log('hello');
                        this.AQList.push({
                            "question": element.Question__c,
                            "answer": r.response__c
                        });


                    });
                    
                 //  var r=getAnswerByFeedbackIdAndQuestionId({ idFeedback: this.idFeedback, idQuestion: element.Id });
                  // console.log('hello'); 
                  // console.log(r.Name);
                  //  console.log('hello');
                });

            }).then(t => {

            });

            //END update AQList

        });
        this.answersLoad = true;


    }



}