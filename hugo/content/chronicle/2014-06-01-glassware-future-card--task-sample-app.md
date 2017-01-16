---
categories:
- google-glass
- glassware
date: 2014-06-01T00:00:00Z
description: "Sample code and write up for Google Glass glassware task queue and future card sending in Mirror API and App Engine."
title: "New sample Glassware: Using a Task Queue to send future cards"
url: /chronicle/2014/06/01/glassware-future-card--task-sample-app/
---

Both [Jason Salas](https://plus.google.com/116113014152499702246) and [Trish Whetzel](https://plus.google.com/115797992002431544380) asked interesting questions in relation to doing things with Glass that wouldn't fit the App Engine Cron use case very well in my last sample.

> What if you needed to schedule something user specific that wasn't like a daily job?

To meet this use case, I wrote a sample app that shows one approach you could take. This example uses the default task queue to schedule random text to be sent to the timeline for a user.

This basic example shows you the barebones needed to use a push queue along with the ability to set either ETA or countdown on said pushed task. This easily lets you schedule cards specific to a user based on either a direct action or some other means. The basic code, pulled from the repo that handles that case is simple enough:

{{< codeblock lang="python" >}}
# We randomly do the same thing two different ways
#   countdown: number of seconds from task insert that we run
#   eta: a datetime in the future (up to 30 days)
#
# In both cases below, we run the task 60 seconds in the future
#
if random.choice([True, False]):
  # we're going to send it along to the task queue
  google.appengine.api.taskqueue.add(
    url='/taskHandler',
    payload=notification,
    countdown=60)
else:
  now = datetime.datetime.now()
  future = now + datetime.timedelta(0,60)
  google.appengine.api.taskqueue.add(
    url='/taskHandler',
    payload=notification,
    eta=future)
{{< /codeblock >}}

In either case, we're setting just setting the task handler, /taskHandler, to take the payload notification from the Mirror API and and run against that payload at some future date (in this case, 60 seconds in the future).

This could be further expanded upon to do all kinds of user or time related things (and you could break it out into modules and different task queues with different performance characteristics...sky's the limit!).

For all the code, visit the sample on Github: [justinribeiro/glass-task-future](https://github.com/justinribeiro/glass-task-future/)

