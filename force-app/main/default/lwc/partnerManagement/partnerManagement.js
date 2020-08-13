import { LightningElement, track, wire, api } from 'lwc';
// importing apex class methods
import getPartners from '@salesforce/apex/PartnerManagement.getPartners';
import delPartner from '@salesforce/apex/PartnerManagement.deletePartners';
import getPartnersList from '@salesforce/apex/PartnerManagement.getPartnersList';
// importing to show toast notifictions
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// importing to refresh the apex if any record changes the datas
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
//Object and Fields
import PARTNER_OBJECT from '@salesforce/schema/Partners__c';
import NAME_FIELD from '@salesforce/schema/Partners__c.Name';
import PHONE_FIELD from '@salesforce/schema/Partners__c.Phone__c';
import EMAIL_FIELD from '@salesforce/schema/Partners__c.Email__c';
import ADRESS_FIELD from '@salesforce/schema/Partners__c.Adress__c';
import SECTOR_FIELD from '@salesforce/schema/Partners__c.Sector__c';
import FAX_FIELD from '@salesforce/schema/Partners__c.Fax__c';


// row actions
const actions = [
    { label: 'Record Details', name: 'record_details' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

// datatable columns with row actions
const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Adress', fieldName: 'Adress__c' },
    { label: 'Sector', fieldName: 'Sector__c' },
    { label: 'Phone', fieldName: 'Phone__c' },
    { label: 'Fax', fieldName: 'Fax__c' },
    { label: 'Email', fieldName: 'Email__c', type: 'Email' },

    {
        type: 'action',
        typeAttributes: {
            rowActions: actions
            // menuAlignment: 'left'
        }
    }
];




export default class PartnerManagement extends NavigationMixin(LightningElement) {
    @track data;
    @track columns = columns;
    @track record = [];
    @track bShowModal = false;
    @track currentRecordId;
    @track isEditForm = false;
    @track isSaveForm = false;
    @track showLoadingSpinner = false;
    totalRecordCount;
    //sVal='';
    searchKey = '';
    myFields = [NAME_FIELD, ADRESS_FIELD, SECTOR_FIELD, PHONE_FIELD, FAX_FIELD, EMAIL_FIELD];
    PartnerObject = PARTNER_OBJECT

    connectedCallback() {


        refreshApex(this.refreshTable);
    }

    //Search
    updateSearchKey(event) {
        this.sVal = event.target.value;
        if (this.sVal !== '') {
            getPartnersList({
                searchKey: this.sVal
            })
                .then(result => {
                    this.data = result;


                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })

                })

        }
        else if (this.sVal == '') {
            getPartners({})
                .then(result => {
                    this.data = result;


                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })

                })
        }

    }




    //creat Partner

    createPartner() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Partner created',
                variant: 'success',
            }),
        );
        this.template.querySelector("section").classList.add("slds-hide");
        this.template.querySelector("div.modalBackdrops").classList.add("slds-hide");
        return refreshApex(this.refreshTable);
    }



    //Pop Up
    handlePopup() {
        this.template.querySelector("section").classList.remove("slds-hide");
        this.template
            .querySelector("div.modalBackdrops")
            .classList.remove("slds-hide");
    }

    handleSkip() {
        this.template.querySelector("section").classList.add("slds-hide");
        this.template
            .querySelector("div.modalBackdrops")
            .classList.add("slds-hide");
    }
    ///////////////////////////////////////

    // non-reactive variables
    selectedRecords = [];
    refreshTable;
    error;




    handleSuccess(event) {
        this.partnerId = event.detail.id;
    }



    // retrieving the data using wire service
    @wire(getPartners)
    partners(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data;
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }

    handleRowActions(event) {
        const recId = event.detail.row.Id;
        let actionName = event.detail.action.name;
        // const actionName = event.detail.action.name;
        window.console.log('actionName ====> ' + actionName);
        let row = event.detail.row;
        window.console.log('row ====> ' + row);
        // eslint-disable-next-line default-case
        switch (actionName) {
            case 'record_details':
                this.viewCurrentRecord(row);
                break;
            case 'edit':
                this.editCurrentRecord(row);
                break;
            case 'delete':
                this.deleteCons(row);
                break;
        }


    }
    // view the current record details
    viewCurrentRecord(currentRow) {
        this.bShowModal = true;
        this.isEditForm = false;
        this.record = currentRow;
    }

    // closing modal box
    closeModal() {
        this.bShowModal = false;
    }

    editCurrentRecord(currentRow) {
        // open modal box
        this.bShowModal = true;
        this.isEditForm = true;



        // assign record id to the record edit form
        this.currentRecordId = currentRow.Id;
    }
    // TAREK EDIT   
    patt = /^\(?[+]\)?([0-9]{3})\)?[- ]?([0-9]{2})[- ]?([0-9]{3})[- ]?([0-9]{3})$/;
    // handleing record edit form submit
    handleSubmit(event) {
        // prevending default type sumbit of record edit form
        event.preventDefault();

        // querying the record edit form and submiting fields to form
        // TITOU EDIT 
        console.log((event.detail.fields.Fax__c));
        console.log((event.detail.fields.Phone__c));
        console.log(this.patt.test(event.detail.fields.Fax__c));
        console.log(this.patt.test(event.detail.fields.Phone__c));


        // closing modal

        //test Phone and Fax
        if (this.patt.test(event.detail.fields.Fax__c) == true && this.patt.test(event.detail.fields.Phone__c) == true) {
            this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: event.detail.fields.Name + ' ' + ' updated Successfully!!.',
                variant: 'success'
            }));
            this.bShowModal = false;
        } else {
            if (this.patt.test(event.detail.fields.Fax__c) == false) {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'error!!',
                    message: 'Please check your Fax Format \n the format must be like +216 52 187 222',
                    variant: 'error'
                }));

            }
            if (this.patt.test(event.detail.fields.Phone__c) == false) {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'error!!',
                    message: 'Please check your Phone Format \n the format must be like +216 52 187 222 ',
                    variant: 'error'
                }));

            }

        }
        // showing success message


    }
    numberFieldValue;
    //Phone number verification
    handleNumberChange(event) {
        /*  this.numberFieldValue = event.target.value;
  
          if (this.numberFieldValue == "aa") {
              const event = new ShowToastEvent({
                  title: 'Application Error',
                  message: 'Something went wrong ',
                  variant: 'error',
                  mode: 'dismissable'
              });
              this.dispatchEvent(event);*/

        var value;
        if (event.target.dataset.id === 'numberField') {
            this.numberFieldValue = value;
        } else {
            const event = new ShowToastEvent({
                title: 'Application Error',
                message: 'Something went wrong ',
                variant: 'error',
                mode: 'dismissable'
            });
        }

    }












    // refreshing the datatable after record edit form success
    handleSuccess() {
        return refreshApex(this.refreshTable);
    }

    // TITOUUUU  MODIFICATION 

    /*
    deleteCons(currentRow) {
        var msg ='Are you sure you want to delete this partner?';
        if (!confirm(msg)) {
            console.log('No');
            return refreshApex(this.refreshTable);
        } else {
            let currentRecord = [];
        currentRecord.push(currentRow.Id);
        this.showLoadingSpinner = true;
            console.log('Yes');
             // calling apex class method to delete the selected contact
             delPartner({lstConIds: currentRecord})
        .then(result => {
            window.console.log('result ====> ' + result);
            this.showLoadingSpinner = false;
    
            // showing success message
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: currentRow.Name + ' ' +' Partner deleted.',
                variant: 'success'
            }),);
    
            // refreshing table data using refresh apex
             return refreshApex(this.refreshTable);
    
        })
        .catch(error => {
            window.console.log('Error ====> '+error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!', 
                message: error.message, 
                variant: 'error'
            }),);
        });
        }
       
    }
    */
    ModalConfirmDelete = false;
    currentRecord = [];
    deleteCons(currentRow) {
        this.ModalConfirmDelete = true;


        //  return refreshApex(this.refreshTable);

        this.currentRecord.push(currentRow.Id);

    }


    ConfirmdeleteCons = (ev) => {
        // this.showLoadingSpinner = true;
        //currentRow.Name + ' ' +
        // calling apex class method to delete the selected contact
        delPartner({ lstConIds: this.currentRecord })
            .then(result => {
                window.console.log('result ====> ' + result);
                //  this.showLoadingSpinner = false;

                // showing success message
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!!',
                    message: ' partner deleted successfully.',
                    variant: 'success'
                }));

                // refreshing table data using refresh apex
                return refreshApex(this.refreshTable);

            })
            .catch(error => {
                window.console.log('Error ====> ' + error);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error'
                }));
            });
        this.ModalConfirmDelete = false;

    }
    canceldeleteCons = (evt) => {
        this.ModalConfirmDelete = false;
    }

    //   END TITOUUUU MODIFICATION 


    //For Spinner Table
    loadMoreData(event) {
        const { target } = event;
        //Display a spinner to signal that data is being loaded
        target.isLoading = true;
        if (this.totalRecordCount > this.queryOffset) {
            this.queryOffset = this.queryOffset + 10;
            this.loadRecords()
                .then(() => {
                    target.isLoading = false;
                });
        } else {
            target.isLoading = false;
        }

    }


    navigateToWebPage() {
        // Navigate to a URL
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://talan-vlocity-pfe--vlocity-cmt.visualforce.com/apex/vlocity_cmt__OmniScriptUniversalPage?id={0}&OmniScriptType=CreatePartner&OmniScriptSubType=createPartner&OmniScriptLang=English&PrefillDataRaptorBundle=&scriptMode=vertical&layout=lightning&ContextId={0}'
            }
        },
            true // Replaces the current page in your browser history with the URL
        );
    }

}