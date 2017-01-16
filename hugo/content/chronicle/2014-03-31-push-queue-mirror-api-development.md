---
categories:
- push-queue
- mirror-api
- google-glass
date: 2014-03-31T00:00:00Z
title: 'Stop slowness: Use a push queue on App Engine for Mirror API'
url: /chronicle/2014/03/31/push-queue-mirror-api-development/
---

I've gotten this question a few times lately so let's talk it out.

You've got your Glassware and it's listening for pings because you've got a subscription you want to work with. You get one of said pings and you need to do some work. But maybe your work is taking a long time because your Glassware is super popular or you have some very long running calculation. And this is making the Mirror API angry and you're getting multiple requests from the same ping.

What's going on?

Mirror has a specific requirement that you must respond to the ping with a 200 status as quickly as possible, such that if you wait too long (ala 10 seconds), it presumes the request failed and it will retry.

10 seconds sounds like a long time, but maybe not if you're app is getting hammered.

What to do? You need to offload that task and respond with a 200 status.

## The App Engine way: Task Queue
Presuming you're on Google App Engine, you have something readily at your fingertips to help you: the task queue. In this case we're using a [push queue](https://developers.google.com/appengine/docs/python/taskqueue/overview-push).

The task queue can take a task and run for as long as 10 minutes. You still need to send a 200-ish response (200-299 is considered "all good" by task queue standards).

You can make task queues as complicated as you like, but let's keep it simple and use the default task queue and hand off a ping from Mirror to said task queue. The example python below takes the whole ping request, sets it as the payload and sends it along to be worked.

{{< codeblock lang="python" >}}

@mymagicalapp.route('/glassCallback', methods=['POST'])
def glassCallback():
    notification = flask.request.data

    # we're going to send it along
    google.appengine.api.taskqueue.add(
      url='/taskHandler',
      payload=notification)

    # It's cool Glass
    return('OK')

@mymagicalapp.route('/taskHandler', methods=['POST'])
def taskHandler():

    # Get the request payload
    notification = json.loads(flask.request.data)

    # Get some things
    userid = notification['userToken']
    timelineitemid = notification['itemId']
    verifyToken = notification['verifyToken']

    # Did I get spoofed?
    # If I did, then screw it, let's send 299 and remove from queue
    if mySecretToken != verifyToken:
        response = flask.make_response(json.dumps('Invalid state parameter.'),
                                       299)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Do More Crazy Stuff
    # Let's do something...let's store an attachment to Google Cloud Storage

    # Mirror things
    mirrorservice = authorizedmirrorservice(credentialsforuser(userid).get())
    attachmentItem = mirrorservice.timeline().get(id=timelineitemid).execute()
    
    # Get attachment
    attachment = mirrorservice.timeline().attachments().get(
        itemId=timelineitemid, attachmentId=attachmentid).execute()

    # Get where the attachment lives
    attachmenturl = attachment['contentUrl']

    # Pull the actual image data
    responseCode, attachmentcontent = mirrorservice._http.request(attachmenturl)

    # good news, we got the
    if responseCode.status == 200:

        filename = ('/mymagicalapp-or-some-bucket/ugi-' + userid + '-' +
                    timelineitemid + '.jpg')
        
        # Write out to Google Cloud Storage
        picture = cloudstorage.open(filename, 'w', content_type='image/jpeg')
        picture.write(attachmentcontent)
        picture.close()

        # Maybe log into the datastore
        # or do other things...

    else:
        return None

    return('OK')
{{< /codeblock >}}

This example isn't terribly taxing; it just pulls an attachment and sends it to Google Cloud Storage. The point being is that we won't run into that 10 second time limit from Mirror and we can do lots of [cool scaling things](https://developers.google.com/appengine/docs/python/taskqueue/)

## Other ways for such things
App Engine isn't the only game in town when it comes to task queues.

Want the same thing on Amazon? You'd use [Amazon Simple Workflow (Amazon SWF)](http://aws.amazon.com/swf/). You could reasonably do the same thing with SQS, but SWF is a closer fit. I'll have to write an example up for it, and it requires a little more than just defining a yaml file and a target path.

You could also use the trusted [Beanstalkd](http://kr.github.io/beanstalkd/). I've used Beanstalk for a lot of projects and it works flippin' fantastic. Again however, you have to roll your own implementation.

In either case, be wary of the long running process and understand how to offload work as needed, no matter your choice of queue engine.