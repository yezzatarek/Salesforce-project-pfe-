import { LightningElement, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, fireEvent } from 'c/pubsub';
import caseLocationLoad from '@salesforce/apex/CaseManagement.caseLocationLoad';
import { refreshApex } from '@salesforce/apex';
export default class LightningExampleMapSingleMarker extends LightningElement {

    locationLoaded = false;
 
    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        registerListener('caseLocalisation', this.handlelocalisation, this);
    }

    handlelocalisation = (lockey) => {
        //console.log('localisation');
        //console.log(lockey);
        this.locationLoaded=false;
        caseLocationLoad({ LocalNumber: lockey }).then(res => {
           /* console.log(res[0]);
            console.log(res[0].Street__c);
            console.log(res[0].City__c);
            console.log(res[0].PostalCode__c);
            console.log(res[0].State__c);
            console.log(res[0].Country__c); */
            this.mapMarkers[0].location = {
                Street: res[0].Street__c,
                City: res[0].City__c,
                State: res[0].State__c,
                
            };
            this.mapMarkers[0].title=res[0].Name;
            this.mapMarkers[0].description=res[0].Street__c + ' , ' + res[0].City__c + ' , ' + res[0].State__c ;

            console.log(this.mapMarkers[0]);
            
            this.locationLoaded=true;

        });
        
    }

    @api mapMarkers = [
        {
            location: {
                Street: '1600 Pennsylvania Ave NW',
                City: 'Washington',
                State: 'DC',
            },
            
            title: 'The White House',
            description:
                'Landmark, historic home & office of the United States president, with tours for visitors.',
        },
    ]; 

    zoomLevel = 15 ;


    
}



/*
     {
            location: {
                Street: '1 Market St',
                City: 'San Francisco',
                PostalCode: '94105',
                State: 'CA',
                Country: 'USA',
            },

            icon: 'utility:salesforce1',
            title: 'Worldwide Corporate Headquarters',
            description: 'Sales: 1800-NO-SOFTWARE',
        },

    
    center = {
        location: {
            City: 'Denver',
        },
    };

    zoomLevel = 4;
    markersTitle = 'Salesforce locations in United States';
    showFooter = true;
    listView = 'invisible';
*/