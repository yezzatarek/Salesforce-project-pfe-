import { LightningElement, api, track, wire } from 'lwc';
import getAccount from '@salesforce/apex/CaseManagement.getAccount';
import getFilterAccount from '@salesforce/apex/CaseManagement.getFilterAccount';
import modifyCaseProperties from '@salesforce/apex/CaseManagement.modifyCaseProperties';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class FeedbackExplorationAccountList extends LightningElement {
    constructor() {
        super();
    }
    @wire(getAccount)
    accounts;
    @wire(getFilterAccount, { accountName: '$FilterAccountName' })
    filteredAccounts;
    @wire(modifyCaseProperties, { accountId: '$FilterAccountId' })
    result;
    @wire(CurrentPageReference) pageRef;
    @api accountFilter = false;
    @api caseFilter = 'false';
    @api accountName;
    @api FilterAccountName = '';
    @api FilterAccountId = '';
    @api activateFilter = false;
    // get filtere accounts 
    getfilteredAccount = (event) => {
        this.FilterAccountName = '%' + event.target.value + '%';
        this.accountFilter = true;
        this.caseFilter = false;
    }
    /// related to the search ///
    @track queryTerm;
    handleKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            this.queryTerm = evt.target.value;
        }
    }
    // funtion to load accouts filter after clicking search button 
    loadAccounts = (event) => {
    }
    /*
    setfilteredCase = (event) => {
        fireEvent(this.pageRef, 'searchCase', event.target.value);
        fireEvent(this.pageRef, 'loadAccountInfo', event.target.value);
    }
    */

    setFFilteredFeedbacks = (event) => {
        fireEvent(this.pageRef, 'searchFeedback', event.target.value); 
        fireEvent(this.pageRef, 'getAccountInfo', event.target.value);

    }
}