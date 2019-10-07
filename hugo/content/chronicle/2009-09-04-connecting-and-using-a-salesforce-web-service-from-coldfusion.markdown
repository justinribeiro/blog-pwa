---
tags:
- development
- software
- Web Apps
- ColdFusion
date: 2009-09-04T00:00:00Z
description: "You need to use Coldfusion and Salesforce together via web services? That is crazy...but it works."
title: "Connecting and using a Salesforce web service from Coldfusion"
url: /chronicle/2009/09/04/connecting-and-using-a-salesforce-web-service-from-coldfusion/
---

Salesforce.com and Coldfusion.  It's an interesting pairing, but one nonetheless that probably happens more often then you would think.  But how does one connect to a Force.com web service?

Connecting to Salesforce from Coldfusion isn't terribly hard.  What you need is the Partner WSDL file from your particular instance of Salesforce.  Since I'm not one for duplicating work, the Force.com web services API developers guide
[covers the topic](http://www.salesforce.com/us/developer/docs/api/index_Left.htm#StartTopic=Content%2Fsforce_api_partner.htm|SkinName=webhelp) and the steps needed to retrieve the WSDL.

Needless to say, lets look at an example. You can't take this and run wild; you would need to make the struct work with your own target, as well as point it to proper WSDL's and offer login details.  Some things to note:

1. The struct that you sent to your Force.com call needs to be perfect, otherwise you'll be left shaking your head at a completely unhelpful "Web service operation could not be found" error.
2. If you ever see "Unable to create web service argument class" this is generally because the struct is also wrong.  Check your data and check the target types you should be sending.
3. Coldfusion MX 7 tends to fight more then Coldfusion 8.

{{< codeblock lang="html" >}}
&lt;!--- A pretend struct to send to our web service ---&gt;
&lt;cfscript&gt;
  mySentStruct = structNew();
  mySentStruct.somethingF1 = &quot;StringTest-01&quot;;
  mySentStruct.somethingF2 = &quot;StringTest-02&quot;;
  mySentStruct.ohcomplex[1] = structNew();
  mySentStruct.ohcomplex[1].somethingagain = &quot;herewego&quot;;
  mySentStruct.ohcomplex[1].ohcomplex02 = arrayNew(1);
  mySentStruct.ohcomplex[1].ohcomplex02[1] = &quot;something,something&quot;;
&lt;/cfscript&gt;

&lt;CFSET Application.isError = &quot;false&quot; /&gt;

&lt;!--- Only one session should login at a time. ---&gt;
&lt;CFLOCK timeout=&quot;10&quot; scope=&quot;Application&quot; throwOnTimeout=&quot;no&quot; type=&quot;exclusive&quot;&gt;

  &lt;!--- The SFDC login session should remain active for 30 minutes ---&gt;
  &lt;CFIF NOT IsDefined(&quot;Application.sfdc&quot;) OR Application.sfdc EQ &quot;&quot; OR NOT IsDefined(&quot;Application.lastLogin&quot;) OR (IsDefined(&quot;Application.lastLogin&quot;) AND Abs(DateDiff(&quot;n&quot;, Application.lastLogin, Now())) GT 30)&gt;

    &lt;!--- Create web service objects ---&gt;
    &lt;CFSET Application.sfdc = createObject(&quot;webservice&quot;,&quot;https://someurl.to.partner.wsdl/&quot;) /&gt;
    &lt;CFSET Application.sfdcyourservice = createObject(&quot;webservice&quot;,&quot;https://someurl.to.yourservice.wsdl&quot;) /&gt;
    &lt;CFSET loginResult = Application.sfdc.login(&quot;username&quot;,&quot;password&quot;) /&gt;

    &lt;!--- Create the SOAP Header that will contain the Session ID ---&gt;
    &lt;CFSET authHeader = createObject(&quot;java&quot;,&quot;org.apache.axis.message.SOAPHeaderElement&quot;).init(&quot;YourServicesService&quot;, &quot;SessionHeader&quot;) /&gt;

    &lt;CFSET Application.sfdcyourservice.setHeader(authHeader) /&gt;

    &lt;!--- Add (and populate) a text node called sessionId: ---&gt;
    &lt;CFSET authHeader.addChildElement(&quot;sessionId&quot;).addTextNode(loginResult.getSessionId()) /&gt;

    &lt;!--- Change the endpoint URL to what was returned by the login method: ---&gt;
    &lt;CFSET Application.lastLogin = Now() /&gt;
  &lt;/CFIF&gt;
&lt;/CFLOCK&gt;

&lt;CFTRY&gt;
  &lt;!--- Only one session at a time should call this method ---&gt;
  &lt;CFLOCK timeout=&quot;10&quot; scope=&quot;Application&quot; throwOnTimeout=&quot;no&quot; type=&quot;readOnly&quot;&gt;

    &lt;CFSET sfdcResponse = Application.sfdcyourservice.createSomething(mySentStruct) /&gt;
  &lt;/CFLOCK&gt;

  &lt;cfoutput&gt;My SF Response: #sfdcResponse#&lt;/cfoutput&gt;

  &lt;!--- Catch any errors ---&gt;
  &lt;CFCATCH type=&quot;ANY&quot;&gt;

    &lt;!--- Reset the sfdc session ---&gt;
    &lt;CFSET Application.sfdc = &quot;&quot; /&gt;
    &lt;CFIF NOT IsDefined(&quot;Application.isError&quot;) OR Application.isError NEQ &quot;true&quot;&gt;
      &lt;h1&gt;An error occurred&lt;/h1&gt;
      &lt;h2&gt;Error Details&lt;/h2&gt;
      &lt;CFDUMP VAR=&quot;#mySentStruct#&quot; /&gt;
      &lt;CFDUMP VAR=&quot;#CFCATCH#&quot; /&gt;

      &lt;CFSET Application.isError = &quot;true&quot; /&gt;
    &lt;/CFIF&gt;
  &lt;/CFCATCH&gt;
&lt;/CFTRY&gt;
{{< /codeblock >}}

But just you say, what about "Cannot generate stubs errors"?  Truly a pain in the neck.  What I found that works the best in this situation is to use the CF admin API and reload the web service, which in turn usually regenerates the stubs without issue:

{{< codeblock lang="html" >}}
&lt;cfset createObject(&quot;component&quot;,&quot;cfide.adminapi.administrator&quot;).login(&quot;yourCFadminpassword&quot;)&gt;

&lt;cfset ws = createobject(&quot;component&quot;,&quot;CFIDE.adminapi.extensions&quot;)&gt;
&lt;cfset ws.reloadWebService(name=&quot;https://someurl.to.yourservice.wsdl&quot;,path=&quot;https://someurl.to.yourservice.wsdl&quot;)&gt;

&lt;cfdump var=&quot;#ws.getwebservices(&quot;https://someurl.to.yourservice.wsdl&quot;)#&quot;&gt;
{{< /codeblock >}}

See, now that wasn't so bad was it?  Coldfusion may not be your first choice, but when it's there and you can wrangle it, you can get it to connect to pretty much anything.
