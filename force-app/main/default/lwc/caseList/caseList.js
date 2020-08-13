import { LightningElement, api, track, wire } from 'lwc';
import getAccount from '@salesforce/apex/CaseManagement.getAccount';
import getCase from '@salesforce/apex/CaseManagement.getCase';
import getLocal from '@salesforce/apex/CaseManagement.getLocal';
import getFilterAccount from '@salesforce/apex/CaseManagement.getFilterAccount';
import getFFilterCase from '@salesforce/apex/CaseManagement.getFFilterCase';
import searchCaseLoad from '@salesforce/apex/CaseManagement.searchCaseLoad';
//import getCaseByProperties from '@salesforce/apex/CaseManagement.getCaseByProperties';
//import getCaseByProperties from '@salesforce/apex/CaseManagement.getCaseByProperties';
import { activateFiltering } from 'c/accountList';
import { giveAccountId } from 'c/accountList';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, fireEvent } from 'c/pubsub';
import { refreshApex } from '@salesforce/apex';
export default class CaseList extends LightningElement {
    constructor() {
        super();
    }

    /*  @wire(getCaseByProperties , {activateStatus : })
      casesByProperties; */

    @wire(getLocal)
    locals;
    @wire(getAccount)
    accounts;
    @wire(getCase)
    cases;
    /*  @wire(getFilterAccount, { accountName: '$FilterAccountName' })
      filteredAccounts; */
    @wire(getFFilterCase, { accountId: "$filterAccountId" }) 
    filteredCases;
    @wire(searchCaseLoad , {caseNumber : "$caseNumberSearch"})
    searchedCases;

    // @api accountFilter = false;

    @api filterCaseStatus;
    @api filterAccountId = '';
    @api searchEnable = false ;
    @api caseNumberSearch = '' ;
    /// / // @api filterCaseStatus = localStorage.getItem("activateFilterCase");
    //  filterCaseStatus = localStorage.getItem("filStatus") ; 
    //  filterAccountId = localStorage.getItem("accId") ;


    //  @api accountName;
    //  @api casess;
    // @api FilterAccountName = '';
    // @api FilterAccountId = '';

    //  @api accountList

    // function to load cases from apex with account id or name
    /*  getfilteredCase = (event) => {
          this.FilterAccountId = event.target.value;
          this.caseFilter=true ;
      }
      */













    /*

    // Mouved to accountList.js
    /// related to the search ///
    @track queryTerm;

    handleKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            this.queryTerm = evt.target.value;
        }
    }

    // get filtere accounts 
    getfilteredAccount = (event) => {
        this.FilterAccountName = '%'+event.target.value + '%';
        this.accountFilter = true;
        this.caseFilter = false ;

    }
     // funtion to load accouts filter after clicking search button 
     loadAccounts = (event) => {

    }
*/

    // other solution 

    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        registerListener('searchCase', this.handleCaseChange, this);
        registerListener('ReloadCasesList', this.handleReloadCasesList, this);
    }
    handleReloadCasesList = (keyy) => {
        
        refreshApex(this.filteredCases);
        refreshApex(this.searchedCases);
        refreshApex(this.cases);
    }

    handleCaseChange = (acckey) => {
        this.filterAccountId = acckey;
    }
    // function to send case number to caseDescription.js after clinking on tr 
    hanleClick = (event) => {
        fireEvent(this.pageRef, 'loadCaseInformations', event.target.value);
        fireEvent(this.pageRef, 'loadCaseCordinations', event.target.name);


    }
    handleAllCases = (event) => {
        this.searchEnable=false;
        this.filterAccountId = '';
        fireEvent(this.pageRef, 'noAccountAccess', event.target.value);
        fireEvent(this.pageRef, 'noCaseAccess', event.target.value);
    }
    handleSearch = (event) =>{
        this.searchEnable=true ;
        this.caseNumberSearch='%'+event.target.value+'%' ;

    }


}


