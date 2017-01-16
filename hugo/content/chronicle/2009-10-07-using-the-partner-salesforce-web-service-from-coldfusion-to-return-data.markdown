---
categories:
- software
- ColdFusion
- Salesforce
date: 2009-10-07T00:00:00Z
description: Getting data from the Partner Salesforce web service via Coldfusion.
title: Using the Partner Salesforce web service from Coldfusion to return data
url: /chronicle/2009/10/07/using-the-partner-salesforce-web-service-from-coldfusion-to-return-data/
---

My last article on the subject of <a href="https://www.justinribeiro.com/chronicle/2009/09/04/connecting-and-using-a-salesforce-web-service-from-coldfusion/">connecting and using Salesforce.com web service from ColdFusion</a> has garnered a fair amount of emails asking for help, so I'd thought I'd write a short follow up.

The following is a very simple script that I compiled using a lot of older partial examples and documentation over at the <a href="http://developer.force.com/">DeveloperForce</a>.  The Coldfusion documentation and examples at DeveloperForce are lacking, but because there are so many Java based examples one can extrapolate them to ColdFusion.

{{< codeblock lang="html" >}}
&lt;CFAPPLICATION NAME=&quot;sdfasdfawe534534534jklsdf&quot;
  APPLICATIONTIMEOUT=&quot;#CreateTimeSpan(0, 2, 0, 0)#&quot;
  CLIENTMANAGEMENT=&quot;NO&quot;
  SESSIONMANAGEMENT=&quot;NO&quot;
  SETCLIENTCOOKIES=&quot;NO&quot;
  SETDOMAINCOOKIES=&quot;NO&quot;&gt;
  
&lt;CFSET Application.isError = &quot;false&quot; /&gt;
    
&lt;!--- Only one session should login at a time. ---&gt;
&lt;CFLOCK timeout=&quot;10&quot; scope=&quot;Application&quot; throwOnTimeout=&quot;no&quot; type=&quot;exclusive&quot;&gt;
  &lt;!--- The SFDC login session should remain active for 30 minutes ---&gt;
  &lt;CFIF NOT IsDefined(&quot;Application.sfdc&quot;) OR Application.sfdc EQ &quot;&quot; OR NOT IsDefined(&quot;Application.lastLogin&quot;) OR (IsDefined(&quot;Application.lastLogin&quot;) AND Abs(DateDiff(&quot;n&quot;, Application.lastLogin, Now())) GT 30)&gt;
    &lt;CFSET Application.sfdc = createObject(&quot;webservice&quot;,&quot;http://some.url/your-partner-file.wsdl&quot;) /&gt;
    &lt;CFSET loginResult = Application.sfdc.login(&quot;username&quot;,&quot;password&quot;) /&gt;
    
    &lt;!--- Create the SOAP Header that will contain the Session ID ---&gt;
    &lt;CFSET authHeader=createObject(&quot;java&quot;,&quot;org.apache.axis.message.SOAPHeaderElement&quot;).init(&quot;SforceService&quot;, &quot;SessionHeader&quot;) /&gt;
    
    &lt;CFSET Application.sfdc.setHeader(authHeader) /&gt;

    &lt;!--- Add (and populate) a text node called sessionId: ---&gt;
    &lt;CFSET authHeader.addChildElement(&quot;sessionId&quot;).addTextNode(loginResult.getSessionId()) /&gt;
    
    &lt;!--- Change the endpoint URL to what was returned by the login method: ---&gt;
    &lt;cfset Application.sfdc._setProperty(&quot;javax.xml.rpc.service.endpoint.address&quot;,loginResult.getServerURL()) /&gt;
    
    &lt;CFSET Application.lastLogin=Now() /&gt;
  &lt;/CFIF&gt;
&lt;/CFLOCK&gt;
    
&lt;CFTRY&gt;
  &lt;!--- Only one session at a time should call this method ---&gt;
  &lt;CFLOCK timeout=&quot;10&quot; scope=&quot;Application&quot; throwOnTimeout=&quot;no&quot; type=&quot;readOnly&quot;&gt;
    
    &lt;!--- JDR: this gets the current user you used to login to the webservice ---&gt;
    &lt;cfset rssfResponse1 = Application.sfdc.getUserInfo() /&gt;
    
    &lt;!--- JDR: this gets some contacts from Salesforce ---&gt;
    &lt;cfset rssfResponse2 = Application.sfdc.query(&quot;SELECT FirstName, LastName FROM Contact LIMIT 11&quot;) /&gt;
    
  &lt;/CFLOCK&gt;
   
  &lt;cfoutput&gt;
   &lt;## &gt;Current User Information&lt;/## &gt;
   &lt;div&gt;getOrganizationName() | &lt;strong&gt;#rssfResponse1.getOrganizationName()#&lt;/strong&gt;&lt;/div&gt;
   &lt;div&gt;getUserEmail() | &lt;strong&gt;#rssfResponse1.getUserEmail()#&lt;/strong&gt;&lt;/div&gt;
   &lt;div&gt;getUserId() | &lt;strong&gt;#rssfResponse1.getUserId()#&lt;/strong&gt;&lt;/div&gt;
   &lt;div&gt;getUserFullName() | &lt;strong&gt;#rssfResponse1.getUserFullName()#&lt;/strong&gt;&lt;/div&gt;
     
  &lt;## &gt;Get 10 Contact records:&lt;/## &gt;
  &lt;ol&gt;
  &lt;!--- JDR: get the array length ---&gt;
  &lt;cfset getLenReturn = arraylen(rssfResponse2.getRecords()) - 1&gt;
  &lt;!--- JDR: loop over the returned reston ---&gt;
  &lt;cfloop from=&quot;1&quot; to=&quot;#getLenReturn#&quot; index=&quot;i&quot;&gt;
    &lt;li&gt;#rssfResponse2.getRecords(i).get_any()[1].getValue()# #rssfResponse2.getRecords(i).get_any()[2].getValue()#&lt;/li&gt;
  &lt;/cfloop&gt;
  &lt;/ol&gt;
  &lt;/cfoutput&gt;

  &lt;!--- Catch any errors ---&gt;
  &lt;CFCATCH type=&quot;ANY&quot;&gt;
    &lt;!--- Reset the sfdc session ---&gt;
    &lt;CFSET Application.sfdc = &quot;&quot; /&gt;
    &lt;CFIF NOT IsDefined(&quot;Application.isError&quot;) OR Application.isError NEQ &quot;true&quot;&gt;
      &lt;h1&gt;An error occurred&lt;/h1&gt;
      &lt;h2&gt;Error Details&lt;/h2&gt;
      &lt;CFDUMP VAR=&quot;#CFCATCH#&quot; /&gt;
      &lt;CFSET Application.isError = &quot;true&quot; /&gt;
    &lt;/CFIF&gt;
  &lt;/CFCATCH&gt;
&lt;/CFTRY&gt;
{{< /codeblock >}}

Let's break this down a bit.

1. The first cflock block setups up the initial session and connection to Salesforce.  Key things to take away from this block include that you'll need to generate your Partner WSDL from Salesforce (<a href="http://www.salesforce.com/us/developer/docs/api/index_Left.htm#StartTopic=Content%2Fsforce_api_partner.htm|SkinName=webhelp">see documentation</a>) and put it somewhere you'll have access to it (you'll need to host it at the very least on your local web server for this to work).  Once you change the username and password, the rest is done for you.  You won't need to edit anything else in this block.
2. Once we have our connection ready, we can call the services the Partner WSDL offers.  In this example, setup two calls, rssfResponse1 and rssfResponse2. 

	* rssfResponse1 calls getUserInfo(), which returns information about the user you used to create the login to the webservice
	*rssfResponse2 calls query(), which using SOQL queries our contacts, limiting the result to 11 rows.
3.After we've made our web service calls, we can output the results.  To get a full view of what is returned in those responses, I recommend using cfdump for a quick look. 
  * rssfResponse1 only has a single result, so the output is relativity simple (you're only running one current user when logging into the web service)
  * rssfResponse2 returns multiple records, so we need to get the total array length of the return, and loop over the result.  As you can see in the sample above, getting the first and last name is not as simple as you might be used to, but the above sample works well (a lot of the older examples that are out there I was not able to get working).  If the code looks vaguely familiar, it's because I based it on <a href="http://wiki.developerforce.com/index.php/Accessing_Query_Results_from_a_Relationship_Query_from_the_Partner_WSDL_with_Axis_for_Java">Accessing Query Results from a Relationship Query from the Partner WSDL with Axis for Java</a> article available 

Using Salesforce.com web services with Coldfusion can be a somewhat frustrating experience (a lot of emails I've gotten in the past month prove that), so hopefully this article helps make just a little more sense of returning data with the Partner WSDL that Salesforce.com makes available.