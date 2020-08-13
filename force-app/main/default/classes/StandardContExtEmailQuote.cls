public class StandardContExtEmailQuote {
       private Quote quote;
       public list<QuoteLineItem> listObjects; 
    public StandardContExtEmailQuote(ApexPages.StandardController controller){
        this.quote = (Quote)controller.getRecord();
        this.quote= [select id, Name, QuoteNumber,Discount,Account.Email__c, BillingName,ExpirationDate,GrandTotal, Account.Phone, Account.Fax from  Quote  where Id =: quote.Id];
    }
        public String getQuoteAccountName(){
        return quote.BillingName;
    }
    
    public String getQuoteNumber(){
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
    
    public list<QuoteLineItem> getInfos(){
     listObjects=[SELECT Id, Product2.Name, Quote.id, Quantity, ListPrice,TotalPrice, UnitPrice,Quote.LineItemCount FROM QuoteLineItem WHERE Quote.id =: quote.Id];
        
       return  listObjects;
    }
  
    
    // Attachement to EMAIL  
  public PageReference emailInvoice(){
      
      if(ApexPages.currentPage().getParameters().containsKey('generatepdf')) { return null; }
            PageReference pdf = ApexPages.currentPage();
            pdf.getParameters().put('generatepdf','true');
            Blob file = pdf.getContent(); 
           Messaging.Singleemailmessage mail = new Messaging.Singleemailmessage();
            Blob b;
          try { b= pdf.getContent();   }
       catch(Exception t){
            b = Blob.valueOf('......');
       }
     	    Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
     		efa.setFileName('Quote.pdf');
     		efa.setBody(b);
            string[] toAddr = new string[] {getEmailAccount()};
		     mail.setToAddresses(toAddr);
           mail.setSubject( 'Quote No'+' '+ getQuoteNumber() +' - '+'Valid until:'+' '+ getExpriationDate() );
          mail.setHtmlBody('<html><body> Hello '+quote.BillingName+ ',<br><br>'+
              'Thank you for your interest in our products. We have prepared quotation for the products that you requested. <br>'+
               'We assure you that our product itself, will speak about the quality and with our experience and expertise in the field of solar energy, you can be rest assured that your requirements will be met in a better way to the top of your satisfaction.<br>'+
               'We are looking forward for your kind response. <br><br>'+
               'Thank You!!<br><br>'+
                'Sincerely, </body></html>.');
     		mail.setFileAttachments(new Messaging.Emailfileattachment[] {efa});	
     		Messaging.SendEmailResult [] r = Messaging.sendEmail(new Messaging.SingleEmailMessage[] {mail});  	
					return new PageReference ('/' + quote.id);
		
}
       
   
    
}