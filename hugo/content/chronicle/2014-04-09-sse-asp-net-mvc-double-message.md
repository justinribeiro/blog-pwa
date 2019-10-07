---
tags:
- c-sharp
- server-sent-events
- asp-net-mvc
date: 2014-04-09T00:00:00Z
title: Server-Sent Events, ASP.NET MVC, and the double message
url: /chronicle/2014/04/09/sse-asp-net-mvc-double-message/
---

Server-sent events are pretty cool. The API has some really awesome features that make it pretty easy to implement inside existing applications (runs over HTTP, can use gzip, no special ports or fancy dance to do). At the base level, it's just a one way stream of data down to your web app.

My self and [James Duvall](https://plus.google.com/+JamesDuvallIV) were working on a project recently in C#, built using Microsoft's open source ASP.NET MVC and Web API framework. I find the framwork quite easy to work in and when combined with Nuget you can go from zero to a lot of working pieces very quickly. The pieces all fit together nicely.

Said project required some streaming data to handle a couple of offline functions and while IE still doesn't support SSE it wasn't a requirement given the existing internal requirements we had to build to (the mandate was that said would target Google Chrome). I state this only because I've had three people tell me C# = IE...and that's just weird and really, really wrong.

So, over the course of a code sprint, Duvall and I hashed out an ApiController that would do server-sent events. I've stripped everything down to the barebones class:

{{< codeblock lang="csharp" >}}
public class SseListenerController : System.Web.Http.ApiController
{
  [HttpGet]
  public System.Net.Http.HttpResponseMessage SubscribeToListener(HttpRequestMessage request)
  {
    System.Net.Http.HttpResponseMessage response = request.CreateResponse();
    response.Content = new System.Net.Http.PushStreamContent((Action&lt;Stream, HttpContent, TransportContext&gt;)WriteToStream, new MediaTypeHeaderValue("text/event-stream"));
    return response;
  }

  public static void Post(MyThing thing)
  {
    MessageCallback(thing);
  }

  private static readonly ConcurrentDictionary&lt;StreamWriter, StreamWriter&gt; _streammessage = new ConcurrentDictionary&lt;StreamWriter, StreamWriter&gt;();
  public void WriteToStream(Stream outputStream, HttpContent content, TransportContext context)
  {
    StreamWriter streamwriter = new StreamWriter(outputStream);
    _streammessage.TryAdd(streamwriter, streamwriter);
  }

  private static void MessageCallback(MyThing thing)
  {
    foreach (var subscriber in _streammessage.ToArray())
    {
      try
      {
        subscriber.Value.WriteLine(string.Format("id: {0}&bsol;n", thing.MyThingId));
        subscriber.Value.WriteLine("data: " + JsonConvert.SerializeObject(thing) + "&bsol;n&bsol;n");
        subscriber.Value.Flush();

        subscriber.Value.WriteLine(string.Format("id: {0}&bsol;n", thing.MyThingId));
        subscriber.Value.WriteLine("data: " + JsonConvert.SerializeObject(thing) + "&bsol;n&bsol;n");
        subscriber.Value.Flush();
      }
      catch
      {
        StreamWriter streamWriter;
        _streammessage.TryRemove(subscriber.Value, out streamWriter);
      }
    }
  }
}
{{< /codeblock >}}

There are a few things going on here, nothing of which is too obtuse. We create a method that going to handle our sending our stream via System.Net.Http.PushStreamContent (note the header being sent, text/event-stream, very important). We setup a private thread safe collection via ConcurrentDictionary to keep track of our various connected clients and when updates happen in the system to a particular MyThing, you call the public Post() method which then fires a callback and sends some stream data.

This setup works fine. And then you'll read above and say "Hey, what's with the double sending of the data with two flush() calls"? No, it's not a typo. It's the result of a strange bug that left both myself and Duvall stumped for an evening.

The issue is that if you only have one writeout set and flush call, you would sometimes not send data. We debugged it and sure enough the code path is followed and fires, but alas no data is sent. We confirmed this by using Wireshark. Then if you post again to the callback, there was a 1 in 3 chance the next message would arrive. Again, the debugging showed no errors that path was fired without issue...but alas, no data in Wireshark, no data anywhere. It was lost in the ether.

Putting the double lines worked. Further...any variation fails. Further...it only sends one message. Not kidding. We thought we were crazy. We deployed a set of test code to our internal QA. Same issue. We pushed to some EC2 instances. Same issue. We asked around, nada ("why implement SSE?" was the common response, ugh).

We re-wrote the class. We tried different implementations. Nothing quite worked as we expected. This implementation, while strange, does work 100% of the time, with no double message. We've tested it until we're blue in the face and it drives us a little crazy. But such is the life of building software. :-)