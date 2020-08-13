import { LightningElement, api, wire } from 'lwc';
import accountLoadDescription from '@salesforce/apex/CaseManagement.accountLoadDescription';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, fireEvent } from 'c/pubsub';
import EMPTYSPACE from '@salesforce/resourceUrl/emptyspace';
import { NavigationMixin } from 'lightning/navigation';
import getAccountRecordType from '@salesforce/apex/CaseManagement.getAccountRecordType';


export default class AccountInformations extends NavigationMixin(LightningElement) {

    @api EmptySpace = EMPTYSPACE;
    @api accountLoad = false;
    @api accountId = '0013z00002PCIi9AAH';
    @wire(accountLoadDescription, { account: '$accountId' })
    accountInformations;
    @api url;
    @api createCaseUrl;
    personalRecordType=false;
    BusinessRecordType=false;
    industryAccount = '' ;
    

    @wire(CurrentPageReference) pageRef; 

    connectedCallback() {


        registerListener('loadAccountInfo', this.handleloadAccountInformations, this);
        registerListener('noAccountAccess', this.handlenoAccountAccess, this);
    }
    handleClick(evt) {
        if (evt.target.name == "accountDetail") {
            evt.preventDefault();
            evt.stopPropagation();
            this[NavigationMixin.Navigate](this.accountHomePageRef);
        }
        if (evt.target.name == "createCase") {
            evt.preventDefault();
            evt.stopPropagation();
            this[NavigationMixin.Navigate](this.createCaseUrl);
        }

    }

    handleloadAccountInformations = (accountKey) => {
        this.accountId = accountKey;
        this.accountLoad = true;
        // creating page url adress to account record page
        this.accountHomePageRef = {
            type: 'standard__recordPage',
            attributes: {
                recordId: this.accountId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        };
        this[NavigationMixin.GenerateUrl](this.accountHomePageRef)
            .then(url => this.url = url);

        // creating page url adress to omniscript (create case)
        this.createCasePageRef = {
            type: 'standard__webPage',
            attributes: {
                url: 'https://talan-vlocity-pfe--vlocity-cmt.visualforce.com/apex/vlocity_cmt__OmniScriptUniversalPage?id={0}&OmniScriptType=createCase&OmniScriptSubType=createCase&OmniScriptLang=English&PrefillDataRaptorBundle=&scriptMode=vertical&layout=lightning&ContextId='+this.accountId,

            }
        };
        this[NavigationMixin.GenerateUrl](this.createCasePageRef)
            .then(url => this.createCaseUrl = url);
        this.personalRecordType=false;
        this.BusinessRecordType=false;

        getAccountRecordType({accountId : this.accountId }).then(res => {
            if(res=='Personal'){
                this.personalRecordType=true ;
            }else{
                this.BusinessRecordType=true;
                this.industryAccount=res;
            }
            console.log(this.personalRecordType);
            console.log(this.BusinessRecordType);
            console.log(res);
        });
        
    }

    handlenoAccountAccess = (keyy) => {
        this.accountLoad = false;
    }



}