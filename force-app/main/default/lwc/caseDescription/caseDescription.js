import { LightningElement, wire, api, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, fireEvent } from 'c/pubsub';
import caseLoadDescription from '@salesforce/apex/CaseManagement.caseLoadDescription';
import caseLocationLoad from '@salesforce/apex/CaseManagement.caseLocationLoad';
import EMPTYSPACE from '@salesforce/resourceUrl/emptySpace';
import deleteCase from '@salesforce/apex/CaseManagement.deleteCase';
import transmitCase from '@salesforce/apex/CaseManagement.transmitCase';
import CloseCase from '@salesforce/apex/CaseManagement.CloseCase';
import getCaseStatus from '@salesforce/apex/CaseManagement.getCaseStatus';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCaseDate from '@salesforce/apex/CaseManagement.getCaseDate';



export default class CaseDescription extends LightningElement {
    constructor() {
        super();
    }

    @api caseNumber = '';
    @api informationLoaed = false;
    @api caseLocal = '';
    @api EmptySpace = EMPTYSPACE;
    @api deleteCaseNumber = '';
    @api changeStatusCaseNumber = '';

    ModalDeleteActive = false;
    ModalTransmitActive = false;
    ModalCloseActive = false;
    isClosedCase = false;
    isAssigned = false;
    caseDate = '';
    CDate='';
    CTime='';
 



    @wire(caseLoadDescription, { caseNumber: '$caseNumber' })
    caseInformations;
    @wire(caseLocationLoad, { LocalNumber: '$caseLocal' })
    Adresss;

    //@wire(transmitCase, { caseNumber: '$changeStatusCaseNumber' })
    //okk ;
    //@wire(deleteCase, { caseNumber: '$deleteCaseNumber' })
    //ok;


    handleCloseCase = (event) => {
        console.log(this.caseNumber);
        this.ModalCloseActive = true;

    }

    handleModalCloseCancelButton = (event) => {
        this.ModalCloseActive = false;
    }

    handleModalCloseButton = (event) => {
        CloseCase({ caseNumber: this.caseNumber }).then(res => {
            const closeevt = new ShowToastEvent({
                title: "case Closed successfully",
                //  message: "Record ID: " + event.detail.id,
                variant: "success"
            });
            this.dispatchEvent(closeevt);
            fireEvent(this.pageRef, 'ReloadCasesList', event.target);
            this.ModalCloseActive = false;
            this.informationLoaed = false;

        });


    }


    handleloadCaseInformations = (caseKey) => {

        console.log("sooo ?");
        this.caseNumber = caseKey;
        this.informationLoaed = true;
        console.log("soooo");
        getCaseStatus({ caseNumber: this.caseNumber }).then(res => {
            if (res == 'Closed') {
                this.isClosedCase = true;
            } else {
                this.isClosedCase = false;
            }
            if (res == 'Assigned') {
                this.isAssigned = true;
            } else {
                this.isAssigned = false;
            }

        });
        /* this.caseInformations.data.forEach(element => {
             this.caseLocal=element.Local__c ; 
             console.log(this.caseLocal);
             
         });
         console.log(this.caseLocal);
         console.log("ok");*/
        //console.log(this.caseNumber);
        console.log(this.caseNumber);
        getCaseDate({ CaseNumber: this.caseNumber }).then(res => {
            this.caseDate = res;
            console.log(this.caseDate);
            this.CDate=this.caseDate.substring(0,10);
            this.CTime=this.caseDate.substring(11,19);
        });

    }
    handleloadCaseCordinations = (cordkey) => {
        this.caseLocal = cordkey;
    }
    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        registerListener('loadCaseInformations', this.handleloadCaseInformations, this);
        registerListener('loadCaseCordinations', this.handleloadCaseCordinations, this);
        registerListener('noCaseAccess', this.handlenocaseAccess, this);



    }



    hanleSendLocation = (event) => {
        console.log(this.caseLocal);
        fireEvent(this.pageRef, 'caseLocalisation', event.target.value);
    }
    handlenocaseAccess = (event) => {
        this.informationLoaed = false;

    }

    handleTransmit = (event) => {

        if (this.isClosedCase == false && this.isAssigned == false) {
            this.ModalTransmitActive = true;
        };

        //  console.log(this.changeStatusCaseNumber);
        //  console.log(this.okk.data);
        //  alert("case transmitted");
        //   document.location.reload(true);


    }

    handleModalTransmitCancelButton = (event) => {
        this.ModalTransmitActive = false;

    }

    handleModalTransmitTransmiteButton = (event) => { 
        this.changeStatusCaseNumber = this.caseNumber
        transmitCase({ caseNumber: this.changeStatusCaseNumber }).then(res => {
            console.log(res);
            console.log('hello');
            fireEvent(this.pageRef, 'ReloadCasesList', event.target);
        });
        const evt = new ShowToastEvent({
            title: "case Transmitted successfully",
            //  message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);
        this.ModalTransmitActive = false;
        this.informationLoaed = false;

    }
    @track error;
    handleDelete = (event) => {
        if (this.isClosedCase == false && this.isAssigned == false) {
            this.ModalDeleteActive = true;
        };


    }
    handleModalCancelButton = (event) => {
        this.ModalDeleteActive = false;

    }

    handleModalDeleteButton = (event) => {
        this.deleteCaseNumber = this.caseNumber;
        deleteCase({ caseNumber: this.deleteCaseNumber }).then(res => {
            fireEvent(this.pageRef, 'ReloadCasesList', res);
        })
        // console.log(this.deleteCaseNumber);
        // console.log(JSON.stringify(this.ok));
        //  alert(" case deleted");
        this.informationLoaed = false;
        // document.location.reload(true);


        const evt = new ShowToastEvent({
            title: "case deleted successfully",
            //  message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);
        this.ModalDeleteActive = false;

    }


}