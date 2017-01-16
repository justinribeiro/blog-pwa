--- 
categories:
- Uncategorized
date: 2004-03-25T06:54:47Z

title: Reaching the limits
url: /chronicle/2004/03/25/reaching-the-limits/
wordpress_id: 391
wordpress_url: http://www.j5studios.com/chronicle/index.php/60
---

Ever wonder what the upper limits of the VX file system is (Sun Solaris 8 accessing in this case)?  That is, how many links can you have in one directory (a link is roughly a file or folder)?  Well, I found out yesturday in very hard fashion on a major work order system we built for a large wireless telecom.


The system has been in use for some three years, and has worked very well, providing much needed process improvements.  For some time we've pushed for an archive feature that fell on deaf ears. Yesturday however, they hit the limit folder inode limit (32767) with a lovely error message that I couldn't figure out (the web app only returned a CFdirectory error and doesn't give you much to go on) which means the system could not create new work orders (I can't explain how the system works, and why a folder is needed, but trust me, it is important and just can't be turned off).  I had never heard of this limit, and it took me some time to figure out that fixing the limit is not really not possible without risking file system corruption.


We did find a solution (requiring cleaver symlinking and clearing out empty folders).  But if you ever see the error message "cannot create directory: too many links" you might find yourself in a bind.

