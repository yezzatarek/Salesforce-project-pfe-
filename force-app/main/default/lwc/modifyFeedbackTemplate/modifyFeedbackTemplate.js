import { LightningElement, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, fireEvent } from 'c/pubsub';
import getFeedbackTemplatesById from "@salesforce/apex/FeedbackManagement.getFeedbackTemplatesById";
//import getQuestionsByTemplateId from "@salesforce/apex/FeedbackManagement.getQuestionsByTemplateId";
import updateFeedbackTemplate from "@salesforce/apex/FeedbackManagement.updateFeedbackTemplate";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getFeedbackTemplateInfo from '@salesforce/apex/FeedbackManagement.getFeedbackTemplateInfo';
import getQuestionsByTemplateId from "@salesforce/apexContinuation/FeedbackManagement.getQuestionsByTemplateId";
import updateFeedbackTemplateDetails from '@salesforce/apex/FeedbackManagement.updateFeedbackTemplateDetails';
import sendTemplateToClients from '@salesforce/apex/FeedbackManagement.sendTemplateToClients';
import updateIsSentTemplate from '@salesforce/apex/FeedbackManagement.updateIsSentTemplate';
import getAccount from '@salesforce/apex/CaseManagement.getAccount';
import sendingTemplateToClients from '@salesforce/apex/FeedbackManagement.sendingTemplateToClients';
export default class ModifyFeedbackTemplate extends LightningElement {
    constructor() {
        super();

    }

    @wire(CurrentPageReference) pageRef;
    @wire(getFeedbackTemplatesById, { Id: "$idTemplate" }) templateObject;
    @wire(getQuestionsByTemplateId, { Id: "$idTemplate" }) Questions;

    @api idTemplate;
    @api modifiedQuestions = [
        {
            "ID__c": "",
            "Name": ""
        }
    ];

    @api Modification = false;
    @api closeModify = false;
    @api QuestionToAdd = '';
    @api ModifyTyped = false;
    @api sending;
    emptyQuestionsAlert = false;
    ModalSentActive = false;
    // details for Template
    @api TemplateName;
    @api TemplateDescription;
    @api TemplateNameModify;
    @api TemplateDescriptionModify;
    @api templateisSent;


    TemplateDescriptionModal = false;

    // section for sending Personalization

    SendTemplatePersoModalActive = false;
    @wire(getAccount)
    accounts;
    listIdAccounts = [];
    AllSelectedAccounts = true;
    CustomizeSelectedAccounts = false;


    setAllSelectedTrue = (event) => {
        this.AllSelectedAccounts = true;
        this.listIdAccounts = [];

    }
    setAllSelectedFalse = (event) => {
        this.AllSelectedAccounts = false;
        this.listIdAccounts = [];
    }
    addcheck = (event) => {
        if (event.target.checked == true) {
            this.listIdAccounts.push(event.target.value);


        } else {

            for (var i = 0; i < this.listIdAccounts.length; i++) {
                console.log(this.listIdAccounts[i]);
                if (this.listIdAccounts[i] == event.target.value) {

                    this.listIdAccounts.splice(i, 1);
                } else {

                }
            }

        }
        console.log(event.target.checked);
        console.log(event.target.value);
        console.log(this.listIdAccounts);

    }
    jsonToSend = [];
    sendingTemplate = (event) => {
        this.jsonToSend = [];
        this.modifiedQuestions = [
            {
                "ID__c": "",
                "Name": ""
            }
        ];
        this.Questions.data.forEach(element => {
            console.log("question");
            console.log(element.Question__c);
            this.modifiedQuestions.push({
                "ID__c": element.ID__c,
                "Name": element.Question__c
            });
            // console.log(element.ID__c);
            // console.log(element.Name);

        });
        console.log(this.modifiedQuestions);
        // END Adding on 5/27/2020
        console.log(this.modifiedQuestions);
        if (this.modifiedQuestions.length == 1) {
            const QuestionsEmptyAlert = new ShowToastEvent({
                title: " Feedback Template cannot be Sent !",
                message: " Feedback template must have at least one question ",
                variant: "error"
            });

            this.dispatchEvent(QuestionsEmptyAlert);
        } else {
            if (this.templateisSent == false) {
                this.AllSelectedAccounts = true;
                this.SendTemplatePersoModalActive = true;
                this.listIdAccounts = [];

                console.log(event.target.value);


            }
        }



    }
    sendingTemplateCancel = (event) => {
        this.SendTemplatePersoModalActive = false;
    }


    finalJsonToSend = {
        "idTemplate": this.idTemplate,
        "ids": []
    };
    sendingTemplateConfirm = (event) => {
        if (this.AllSelectedAccounts == true) {
            this.finalJsonToSend.idTemplate = this.idTemplate;
            /* sendingTemplateToClients({ jsonInput: JSON.stringify(this.finalJsonToSend) }).then(res => {
                 console.log(res);
                 this.SendTemplatePersoModalActive = false;
             });
             updateIsSentTemplate({ idTemplate: this.idTemplate }).then((res) => {
                 
                 
                 setTimeout(function () {
                     location.reload();
                 }, 3000);
                 const TempSent = new ShowToastEvent({
                     title: " Feedback Template Sent ",
                     message: " Feedback Template Sent to all Clients ",
                     variant: "success"
                 });
                 this.dispatchEvent(TempSent);
     
     
             }); */

             
             // this notification just for test after we will delete it
            const QuestionsentAllSuccessfully = new ShowToastEvent({
                title: " Feedback Template  Sent ",
                message: " Feedback template sent to all clients ",
                variant: "success"
            });
            this.dispatchEvent(QuestionsentAllSuccessfully);



            console.log("sending to all");
            /*updateIsSentTemplate({ idTemplate: this.idTemplate }).then((res) => {
                

                setTimeout(function () {
                    location.reload();
                }, 3000);
                const TempSent = new ShowToastEvent({
                    title: " Feedback Template Sent ",
                    message: " Feedback Template Sent to  Clients ",
                    variant: "success"
                });
                this.dispatchEvent(TempSent);


            });*/
            this.SendTemplatePersoModalActive = false;

        } else {
            console.log(this.listIdAccounts);
            console.log("sending");

            this.listIdAccounts.forEach(element => {
                this.jsonToSend.push({ "id": element });
            });
            console.log(this.jsonToSend.length);
            // this.finalJsonToSend.ids=this.jsonToSend;
            //console.log(this.jsonToSend);
            //console.log("///");
            //console.log(JSON.stringify(this.jsonToSend));
            if (this.jsonToSend.length == 0) {
                console.log("nothing to send");
                const NOONETOSEND = new ShowToastEvent({
                    title: " No Recipient Selected ",
                    message: " You must choose a recipient before this Survey can be sent !!! ",
                    variant: "error"
                });

                this.dispatchEvent(NOONETOSEND);
                this.SendTemplatePersoModalActive = false;
            } else {
                this.finalJsonToSend.ids = this.jsonToSend;
                this.finalJsonToSend.idTemplate = this.idTemplate;
                console.log(this.finalJsonToSend);
                sendingTemplateToClients({ jsonInput: JSON.stringify(this.finalJsonToSend) }).then(res => {
                    console.log(res);
                    this.SendTemplatePersoModalActive = false;

                });
                updateIsSentTemplate({ idTemplate: this.idTemplate }).then((res) => {
                    /*getFeedbackTemplateInfo({idTemplate : this.idTemplate}).then(res => {
                        this.templateisSent = res.isSent__c ;
                        console.log(this.templateisSent);
        
                    });*/

                    setTimeout(function () {
                        location.reload();
                    }, 3000);
                    const TempSent = new ShowToastEvent({
                        title: " Feedback Template Sent ",
                        message: " Feedback Template Sent to  Clients ",
                        variant: "success"
                    });
                    this.dispatchEvent(TempSent);


                });
            }


        }


    }
    // END section for sending Personalization



















    // Section for sending Email to Clients

    SendTemplate = (event) => {
        // Adding on 5/27/20  

        this.modifiedQuestions = [
            {
                "ID__c": "",
                "Name": ""
            }
        ];
        this.Questions.data.forEach(element => {
            console.log("question");
            console.log(element.Question__c);
            this.modifiedQuestions.push({
                "ID__c": element.ID__c,
                "Name": element.Question__c
            });
            // console.log(element.ID__c);
            // console.log(element.Name);

        });
        console.log(this.modifiedQuestions);
        // END Adding on 5/27/2020
        console.log(this.modifiedQuestions);
        if (this.modifiedQuestions.length == 1) {
            const QuestionsEmptyAlert = new ShowToastEvent({
                title: " Feedback Template cannot be Sent !",
                message: " Feedback template must have at least one question ",
                variant: "error"
            });

            this.dispatchEvent(QuestionsEmptyAlert);
        } else {
            if (this.templateisSent == false) {
                this.ModalSentActive = true;
                console.log(event.target.value);


            }
        }

    }

    SendTemplateCancel = (event) => {
        this.ModalSentActive = false;

    }

    SendTemplateConfirm = (event) => {
        sendTemplateToClients({ idTemplate: this.idTemplate }).then(res => {
            console.log(res);
            if (res == 'ok') {

            } else {
                const TempNotSent = new ShowToastEvent({
                    title: " Feedback Template Not Sent ",
                    message: " Feedback Template Not Sent to  Clients ",
                    variant: "error"
                });

                this.dispatchEvent(TempNotSent);
            }


        });
        updateIsSentTemplate({ idTemplate: this.idTemplate }).then((res) => {
            /*getFeedbackTemplateInfo({idTemplate : this.idTemplate}).then(res => {
                this.templateisSent = res.isSent__c ;
                console.log(this.templateisSent);

            });*/
            this.ModalSentActive = false;
            setTimeout(function () {
                location.reload();
            }, 3000);
            const TempSent = new ShowToastEvent({
                title: " Feedback Template Sent ",
                message: " Feedback Template Sent to all Clients ",
                variant: "success"
            });
            this.dispatchEvent(TempSent);


        });

    }




    // END Section for sening Email to Clients


    handleModalEditNameChange = (event) => {
        this.TemplateNameModify = event.target.value;
        console.log('name   ' + this.TemplateNameModify);
    }
    handleModalEditDescChange = (event) => {
        this.TemplateDescriptionModify = event.target.value;
        console.log('desc    ' + this.TemplateDescriptionModify);

    }
    handleModalEditCancel = (event) => {
        this.TemplateNameModify = '';
        this.TemplateDescriptionModify = '';
        console.log('cancel');
        console.log(this.TemplateNameModify);
        console.log(this.TemplateDescriptionModify);
        this.TemplateDescriptionModal = false;

    }
    handleModalEditSave = (event) => {
        if (this.TemplateDescriptionModify == '' || this.TemplateNameModify == '' || this.TemplateNameModify == null) {

            const ENtryError = new ShowToastEvent({
                title: " Fields required ",
                message: " Name or Description Empty !! ",
                variant: "error"
            });

            this.dispatchEvent(ENtryError);
        } else {
            this.TemplateName = this.TemplateNameModify;
            console.log(this.TemplateName);
            this.TemplateDescription = this.TemplateDescriptionModify;
            updateFeedbackTemplateDetails({ idTemplate: this.idTemplate, name: this.TemplateNameModify, descr: this.TemplateDescriptionModify }).then(res => {
                console.log(this.TemplateName);
                const EditSuccess = new ShowToastEvent({
                    title: "Template Modified ",
                    message: "Template Modified successfully ",
                    variant: "success"
                });

                this.dispatchEvent(EditSuccess);

                // refreshApex(this.Questions);
                getFeedbackTemplateInfo({ idTemplate: this.idTemplate }).then(res => {
                    console.log('result');
                    console.log(res.Name);

                    //this.TemplateName = res.Name;
                    //this.TemplateDescription = res.Description__c;
                    //this.TemplateNameModify = this.TemplateName;
                    //this.TemplateDescriptionModify = this.TemplateDescription;
                    console.log(this.TemplateName);
                    console.log(this.TemplateNameModify);
                    fireEvent(this.pageRef, 'refreshLoadTemplateFromModalAction', res);
                    refreshApex(this.templateObject);
                    //console.log(this.TemplateName);
                    //console.log(this.TemplateDescription); 
                });




            });
            this.TemplateDescriptionModal = false;

        }

    }

    connectedCallback() {
        console.log(this.templateisSent);
        registerListener('NewModyQuestions', this.handleNewMoyQuestions, this);


        //   registerListener('ChangeQuestionsList', this.handleChangeQuestionsList, this);

    }

    handleEditInfor = (event) => {
        if (this.templateisSent == false) {
            console.log(this.templateisSent);
            console.log(this.idTemplate);
            this.TemplateNameModify = this.TemplateName;
            this.TemplateDescriptionModify = this.TemplateDescription;
            getFeedbackTemplateInfo({ idTemplate: this.idTemplate }).then(res => {
                console.log(res.Name);
                this.TemplateDescriptionModal = true;
                if (this.TemplateName == null) {

                    this.TemplateName = res.Name;
                    this.TemplateDescription = res.Description__c;
                    this.TemplateNameModify = this.TemplateName;
                    this.TemplateDescriptionModify = this.TemplateDescription;
                }
                console.log(this.TemplateNameModify);
                console.log(this.TemplateName);

                console.log(this.TemplateDescription);
                console.log(this.TemplateDescriptionModify);
                //console.log(this.TemplateName);
                //console.log(this.TemplateDescription); 
            });
        }
    }

    handleEditDescription = (event) => {
        /*  getFeedbackTemplateInfo({ idTemplate: this.idTemplate }).then(res => {
              this.TemplateDescriptionModal = true;
              this.TemplateName = res.Name;
              this.TemplateDescription = res.Description__c;
              this.TemplateNameModify = this.TemplateName;
              this.TemplateDescriptionModify = this.TemplateDescription;
  
              //console.log(this.TemplateName);
              //console.log(this.TemplateDescription);
          });
          */
    }



    /*   handleChangeQuestionsList = (keys) =>{
           
          this.Questions=getQuestionsByTemplateId({ Id: this.idTemplate });
          refreshApex(this.Questions);
           
       } */

    handleReloadTemplate = (keys) => {
        this.modifiedQuestions = [
            {
                "ID__c": "",
                "Name": ""
            }
        ];
        this.Modification = false;
        this.ModifyTyped = false;

    }

    handleNewMoyQuestions = (kkey) => {
        this.modifiedQuestions = [
            {
                "ID__c": "",
                "Name": ""
            }
        ];

        this.Modification = false;
        this.ModifyTyped = false;
        this.TemplateNameModify = null;
        this.TemplateDescriptionModify = null;
        this.TemplateName = null;
        this.TemplateDescription = null;

    }

    handleDelete = (event) => {
        this.Modification = false;
        for (var i = 0; i < this.modifiedQuestions.length; i++) {
            console.log("heeey");
            if (this.modifiedQuestions[i].Name == event.target.name) {
                console.log(this.modifiedQuestions[i].Name);
                this.modifiedQuestions.splice(i, 1);
            }
        }
        this.Modification = true;

    }


    handleKeyUp = (event) => {

    }

    updateQuestions = (event) => {
        this.QuestionToAdd = event.target.value;
        console.log(this.QuestionToAdd);


    }
    handleModify = (event) => {
        if (this.templateisSent == false) {
            if (this.ModifyTyped == false) {
                this.modifiedQuestions = [
                    {
                        "ID__c": "",
                        "Name": ""
                    }
                ];

                this.Questions.data.forEach(element => {
                    console.log("question");
                    console.log(element.Question__c);
                    this.modifiedQuestions.push({
                        "ID__c": element.ID__c,
                        "Name": element.Question__c
                    });
                    // console.log(element.ID__c);
                    // console.log(element.Name);

                });
                this.modifiedQuestions.shift();
                // use this code to check Question moified list
                this.modifiedQuestions.forEach(element => {
                    console.log(element.ID__c);
                    console.log(element.Name);
                });
                // use this code to check Question moified list

                this.Modification = true;
                console.log(event.target.value);
                this.ModifyTyped = true;

            }
        }
    }

    handleNewQuestion = (event) => {
        console.log("titou");

        console.log(this.QuestionToAdd);
        if (this.QuestionToAdd == '') {
            const e = new ShowToastEvent({
                title: "Empty Question !",
                message: "No Question Entered ",
                variant: "error"
            });

            this.dispatchEvent(e);

        } else {
            this.Modification = false;
            this.modifiedQuestions.push({

                "ID__c": null,
                "Name": this.QuestionToAdd
            });
            this.Modification = true;

        }



    }

    handleConfirmUpdate = (event) => {
        /*  this.modifiedQuestions = [
              {
                  "ID__c": "",
                  "Name": ""
              }
          ];
          */

        // console.log(JSON.stringify(this.modifiedQuestions));
        if (this.Modification == true) {

            if (this.modifiedQuestions.length == 0) {
                console.log("questions empty");
                const ev = new ShowToastEvent({
                    title: "No Question Entered",
                    message: "You didn't add any Question ! ",
                    variant: "error"
                });

                this.dispatchEvent(ev);

            } else {
                this.sending = {
                    "IdTemplate": this.idTemplate,
                    "Questions": this.modifiedQuestions
                };
                console.log(JSON.stringify(this.sending));
                updateFeedbackTemplate({ jsonInput: JSON.stringify(this.sending) }).then(res => {
                    refreshApex(this.Questions);
                    console.log(res);

                });
                // fireEvent(this.pageRef , 'ChangeQuestionsList' , event.target.value);

                this.Modification = false;
                this.ModifyTyped = false;

                const evt = new ShowToastEvent({
                    title: "Feedback Template Updated",
                    message: "Feedback Template Updated Successfully ",
                    variant: "success"
                });

                this.dispatchEvent(evt);


            }
            // alert("Feedback Template :  is Updated");
            //   document.location.reload(true);

        }





    }




    handleCancelUpdate = (event) => {
        this.ModifyTyped = false;
        this.Modification = false;
        this.modifiedQuestions = [
            {
                "ID__c": "",
                "Name": ""
            }
        ];


    }

    handleChangeInputQuestion = (event) => {
        // console.log(event.target.name);
        // console.log(event.target.value);
        for (var i = 0; i < this.modifiedQuestions.length; i++) {

            if (this.modifiedQuestions[i].Name == event.target.placeholder) {

                //  console.log(event.target.name);
                //  console.log(event.target.value);

                this.modifiedQuestions.splice(i, 1, {

                    "ID__c": event.target.name,
                    "Name": event.target.value
                });
                event.target.placeholder = this.modifiedQuestions[i].Name;
                /*  this.modifiedQuestions.push({
  
                      "ID__c": event.target.name ,
                      "Name": event.target.value
                  }); */

                console.log(this.modifiedQuestions[i].Name);
                console.log(this.modifiedQuestions[i].ID__c);



            }
        }

    }





}