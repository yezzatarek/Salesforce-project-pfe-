import { LightningElement, wire, api } from 'lwc';
import getAllEscalatedCases from '@salesforce/apex/CaseManagement.getAllEscalatedCases';
import CloseCase from '@salesforce/apex/CaseManagement.CloseCase';
import getFiltereddEscalatedCases from '@salesforce/apex/CaseManagement.getFiltereddEscalatedCases';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getTechnicianName from '@salesforce/apex/CaseManagement.getTechnicianName';




export default class CaseAssign extends NavigationMixin(LightningElement) {

    @wire(getAllEscalatedCases)
    AllCases;
    @wire(getFiltereddEscalatedCases, { inputtedValue: "$FilteredCasesInput" })
    filteredCases;
    @wire(CurrentPageReference) pageRef;
    idCaseToAssign = '';
    @api assignTechUrl;
    closeCaseModalActive = false;
    caseNumberToClose = '';
    SearchON = false;
    FilteredCasesInput = '';

    //  about Modal description 
    DescriptionModalActive = false;
    DescriptionModalDetails = {
        "Subject": "Subject 123",
        "Description": "Description 123",
        "Number": "123",
        "Technician": ""
    };

    connectedCallback() {
        refreshApex(this.AllCases);
        refreshApex(this.filteredCases);
    }

    activateDescModal = (event) => {
        console.log('hello');
        console.log(event.target.value);
        console.log(event.target.title);
        console.log(event.target.name);
        getTechnicianName({ caseNumberInput: event.target.value }).then(res => {
            this.DescriptionModalDetails.Technician = res;
            this.DescriptionModalActive = true;

        });
        this.DescriptionModalDetails.Subject = event.target.title;
        this.DescriptionModalDetails.Description = event.target.name;
        this.DescriptionModalDetails.Number = event.target.value;




    };
    handleCancelDescrModal = (event) => {
        this.DescriptionModalActive = false;
    }

    // END  about Modal description 
    handleAssign = (event) => {
        console.log(event.target.value);
        if ( event.target.name !== 'Assigned') {
            this.assignTechnicienPageref = {
                type: 'standard__webPage',
                attributes: {
                    url: 'https://talan-vlocity-pfe--vlocity-cmt.visualforce.com/apex/vlocity_cmt__OmniScriptUniversalPage?id={0}&OmniScriptType=Add&OmniScriptSubType=AddTechnician&OmniScriptLang=English&PrefillDataRaptorBundle=&scriptMode=vertical&layout=lightning&ContextId=' + event.target.value,

                }

            };
            this[NavigationMixin.GenerateUrl](this.assignTechnicienPageref)
                .then(url => this.assignTechUrl = url);

            // event.preventDefault();
            // eventt.stopPropagation();
            this[NavigationMixin.Navigate](this.assignTechnicienPageref);
            console.log('done');
        }


    }



    handleSearch = (event) => {
        this.FilteredCasesInput = '%' + event.target.value + '%';
        this.SearchON = true;

    }

    handleCloseCase = (event) => {
        this.caseNumberToClose = event.target.value;
        this.closeCaseModalActive = true;


    }

    handleModalCloseCancelButton = (event) => {
        this.closeCaseModalActive = false;


    }

    handleModalCloseButton = (event) => {
        this.closeCaseModalActive = true;
        CloseCase({ caseNumber: this.caseNumberToClose }).then(res => {
            const closeevent = new ShowToastEvent({
                title: "case Closed successfully",
                //  message: "Record ID: " + event.detail.id,
                variant: "success"
            });
            this.dispatchEvent(closeevent);
            refreshApex(this.AllCases);
            this.closeCaseModalActive = false;
        });


    }

}