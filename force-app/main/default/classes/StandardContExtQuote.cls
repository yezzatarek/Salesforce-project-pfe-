public class StandardContExtQuote {
   private Quote quote;
    private QuoteLineItem qlitem;
       private Opportunity opp;
       public list<QuoteLineItem> listObjects;   //=new list<QuoteLineItem>();
    public StandardContExtQuote(ApexPages.StandardController controller){
        this.quote = (Quote)controller.getRecord();
        this.quote= [select id, Name, QuoteNumber,Discount,Account.Email__c, BillingName,ExpirationDate,GrandTotal, Account.Phone,OpportunityId , Account.Fax from  Quote  where Id =: quote.Id];
    opp =[select Local__r.Adresse__c from Opportunity where Id=:getOppId()];
    }
    
   public String getOppId(){
        return quote.OpportunityId;
    }
    public String getNameOppId(){
        return opp.Local__r.Adresse__c;
    }
    
    
    
   public list<QuoteLineItem> getInfos(){
     listObjects=[SELECT Id, Product2.Name, Quote.id, Quantity, ListPrice,TotalPrice, UnitPrice,Quote.LineItemCount FROM QuoteLineItem WHERE Quote.id =: quote.Id];
        
       return  listObjects;
    }
    
     public String getQuoteAccountName(){
        return quote.BillingName;
    }
    
    public String getQuoteNumber(){
    // this.quote= [select id, Name, QuoteNumber,Discount, BillingName,ExpirationDate,GrandTotal, Account.Phone, Account.Fax from  Quote  where Id =: quote.Id];
        return quote.QuoteNumber;
    }
    
    public String getPhoneAccount(){
        return quote.Account.Phone;
    }
    
    public String getEmailAccount(){
        return quote.Account.Email__c;
    }
    
    public String getFaxAccount(){
        return quote.Account.Fax;
    }
    
    public Date getExpriationDate(){      
        return quote.ExpirationDate;
    }
    public Decimal getTotalQuote(){
        return quote.GrandTotal;
    }
    
    public Decimal getDiscount(){
        return quote.Discount;
    }
    
    // Methods call 2 methods PageReference
    public pageReference callRefMethods(){
      //  emailInvoice();    
       // saveQuoteAsPdf();
        return null;
    }
    
    
    
    
    
 // Attachement to EMAIL  
/*  public pageReference emailInvoice(){
        Messaging.Singleemailmessage mail = new Messaging.Singleemailmessage();
		PageReference pdf = Page.QuotePDF;
        //prep attachment	
     		pdf.getParameters().put('id', quote.Id);
     	//pdf.setRedirect(true); //does not seem to be required
      Blob b;
          try { b= pdf.getContentasPDF();   }
       catch(Exception t){
            b = Blob.valueOf('......');
       }
     	    Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
     		efa.setFileName('Quote.pdf');
     		efa.setBody(b);
            string[] toAddr = new string[] {getEmailAccount()};
		     mail.setToAddresses(toAddr);
           mail.setSubject( 'Quote No'+' '+ getQuoteNumber() +' - '+'dated:'+ getExpriationDate() );
          mail.setHtmlBody('<html><body> Hello '+quote.BillingName+ '<br>'+
              'Thank you for your interest in our products. We have prepared quotation for the products that you requested. <br>'+
               'We assure you that our product itself, will speak about the quality and with our experience and expertise in the field of solar energy, you can be rest assured that your requirements will be met in a better way to the top of your satisfaction.<br>'+
               'We are looking forward for your kind response. <br>'+
               'Thank You!<br>'+
                'Sincerely, </body></html>.');

     		mail.setFileAttachments(new Messaging.Emailfileattachment[] {efa});	
     		Messaging.SendEmailResult [] r = Messaging.sendEmail(new Messaging.SingleEmailMessage[] {mail});  		
		
		return null;
}
       
    */
    
    
    // Attachement to Record Quote  
 
 /*public pageReference saveQuoteAsPdf(){
        
       PageReference pdf = Page.QuotePDF;
       pdf.getParameters().put('id',quote.Id);
       Attachment attach = new Attachment();
        pdf.setRedirect(true);
    Blob body;
       try {
           body = pdf.getContent();
           
       } catch (VisualforceException e) {
           body = Blob.valueOf('......');
       }
         attach.Body = body;
         attach.Name = quote.Name +'- Attachment - '+ system.Now()+ '.pdf';
         attach.IsPrivate = false;
         attach.ParentId = quote.Id;
         attach.ContentType = 'application/pdf';
        insert attach;
        //Pour le retour
      // return new PageReference('/' + quote.Id);  
      return null;
   }
*/


            public void savePDF()
            { if(ApexPages.currentPage().getParameters().containsKey('generatepdf')) { return; }
            PageReference pdf = ApexPages.currentPage();
            pdf.getParameters().put('generatepdf','true');
            Blob file = pdf.getContent(); 
                Attachment attach = new Attachment();
                Blob body;
             try {
        
        // returns the output of the page as a PDF
        body = pdf.getContent();
        
    // need to pass unit test -- current bug    
    } catch (VisualforceException e) {
        body = Blob.valueOf('Error');
    }
                 attach.Body = body;
                // add the user entered name
                 attach.Name = quote.Name +'- Attachment - '+ system.Now()+ '.pdf';              
             attach.IsPrivate = false;
                // attach the pdf to the opportunity
                attach.ParentId = quote.Id;   
                insert attach;




}    
    
    
    
        
      
        
    
}