---
tags:
- webgl
- three.js
- vtk
- mesa3d
- cmake
date: 2012-11-09T00:00:00Z
description: "Working with large 3D models is something you don't hear about. So why don't we do it on the web with some open source tools?"
title: Remotely rendering high resolution models with VTK, Mesa 3D, Cmake and Three.js
url: /chronicle/2012/11/09/remotely-rendering-high-resolution-models-with-vtk-mesa-3d-cmake-and-three-js/
---

The open source community is a wonderful thing. Punch in the right words into Google and you can find the open source tools and projects that can do amazing things when combined. Sure, it might be a stretch of what those tools do, but that's half the fun.

## The use case
Let's say you have a 3D model. But it's not just any model, let's say it's a HUGE model, something with 100 million polys and more data than you can shake a stick at. WebGL can do some amazing things...but loading a multi-gigabyte model file and then rendering it...it's a bit on the taxing side.

Now Justin you say, people don't make models that big. To that I would say, yes, yes we do. The big industrial 3D scanners do all kinds of crazy things, least of which is a meazly 100 million poly model (rendered and cleaned up from point cloud data likely). What are we to do?

I say let's remotely render a high resolution frame of that big, large 3D model in the cloud as someone manipulates a lower, much more transportable version of in WebGL.

Sounds hard. Not going to lie; not the easiest thing in the world.

## It's all in the secret sauce...except it's not so secret
Cheap cloud servers don't exactly have large amounts of cheap GPU power available, so we can't use fancy OpenCL or Cuda to do our dirty work. What we need is something that'll run on all those relatively cheap CPU cycles.  Welcome to the stage, VTK!

The <a href="http://www.vtk.org/">Visualization Toolkit (VTK)</a> is an open source system that lets you do all kinds of 3D, imaging, and visualization. I can't even begin to scratch the surface of how much you can do with VTK, so I highly suggest that you read the <a href="http://www.vtk.org/Wiki/VTK_FAQ#What_is_the_Visualization_Toolkit.3F">FAQ</a>.

What we're going to use VTK for is its ability to render frames of 3D objects without the use of a graphics card. We can use all the things we've come to love in our 3D world, such as cameras, positioning, and lights, yet not have any graphical interface at all.

But Justin, VTK doesn't do off screen rendering. Ah, but it does! You just have to tie into <a href="http://http://mesa3d.org/">Mesa 3D</a>.

## I need a driver for a video card, but I don't have a video card
Mesa 3D, like VTK, can do a lot of things ranging from emulation to hardware acceleration for modern GPU's. What we want it for is <a href="http://mesa3d.org/osmesa.html">off-screen rendering</a> support, which we can than utilize in VTK.

## I don't see an exe file, how do we do this?
At this point, it _sounds_ like if we start piecing this together, it'll work. But how does one go about doing that? It's time to break out your compilers.

You can do this a number of ways; you can compile and deploy to Amazon, or you can just compile on your AMI of choice. I compiled locally as statically as possible, and then moved over the build to Amazon. Your mileage may vary.

Please also note, that the versions you see below are not the edge version of any of these libs. These are the versions I used that worked (and trust me, some versions matched together simply DO NOT work...you will be left banging your head on the table screaming to the heavens).

So we start the build process. I'd grab a cup of coffee or the drink of your choice, because depending on what you're compiling on, this could take a while.

{{< codeblock lang="bash" >}}
# Go somewhere to play around
$ cd /tmp

# get Mesa
$ wget ftp://ftp.freedesktop.org/pub/mesa/7.11.2/MesaLib-7.11.2.tar.gz

# get VTK and test data
$ wget http://www.vtk.org/files/release/5.8/vtk-5.8.0.tar.gz
$ wget http://www.vtk.org/files/release/5.8/vtkdata-5.8.0.tar.gz

# untar Mesa
$ tar -xjvf MesaLib-7.11.2.tar.bz2

# Configure and build mesa
$ cd Mesa-7.11.2/
./configure \
  --with-driver=osmesa \
  --with-gallium-drivers="" \
  --disable-egl

$ make -j4

# Untar VTK and VTKData
$ tar -xzvf vtk-5.8.0.tar.gz
$ tar -xzvf vtkdata-5.8.0.tar.gz

# Configure and build VTK
$ mkdir VTK_Build
$ cd VTK_Build/
$ cmake \
  -D"VTK_DATA_ROOT:PATH=/tmp/VTKData" \
  -D"OPENGL_INCLUDE_DIR:PATH=/tmp/Mesa-7.11.2/include" \
  -D"OPENGL_gl_LIBRARY:FILEPATH=" \
  -D"OPENGL_glu_LIBRARY:FILEPATH=/tmp/Mesa-7.11.2/lib/libGLU.so" \
  -D"VTK_OPENGL_HAS_OSMESA:BOOL=ON" \
  -D"OSMESA_INCLUDE_DIR:PATH=/tmp/Mesa-7.11.2/include" \
  -D"OSMESA_LIBRARY:FILEPATH=/tmp/Mesa-7.11.2/lib/libOSMesa.so" \
  -D"VTK_USE_OFFSCREEN:BOOL=ON" \
  -D"VTK_USE_X:BOOL=OFF" \
  /tmp/VTK

$ make -j4
$ make test
{{< /codeblock >}}

## We made it! Now what?
So the build finished, hopefully error free. Now what?  We need to test to see if things are working. Just so happens, on the Cmake wiki, there is a <a href="http://www.cmake.org/Wiki/VTK/Examples/Cxx/Utilities/OffScreenRendering">example script</a> that does this very thing. Drop that into a file, build it, and then run from the command line.

What you should end up with is something like this:
<img src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2012/11/screenshot.png" alt="A sphere on white background, off screen rendered" title="screenshot" width="300" height="300" class="alignnone size-full wp-image-1177" />

That little sphere on the white background...that's success!

## I'm going to need more than a sphere
So what Justin, I don't need some low poly sphere. I need some high resolution action. So let's do that.

The following is a basic example engine that takes command line parameters, loads a model file, and then renders a particular view. Now, before you start screaming "that won't scale!" and "you have C++ issues" I'm well aware (anyone who's written even a little C++ would be quick to note this). It's a pretty crappy example for reasons I'm not at liberaty to explain (read my memoirs after I die...the story is both sad and funny all at once).

{{< codeblock lang="cpp" >}}
#include &lt;vtkXMLPolyDataReader.h&gt;
#include &lt;vtkPolyDataMapper.h&gt;
#include &lt;vtkPolyData.h&gt;
#include &lt;vtkProperty.h&gt;
#include &lt;vtkActor.h&gt;
#include &lt;vtkRenderWindow.h&gt;
#include &lt;vtkRenderer.h&gt;
#include &lt;vtkSmartPointer.h&gt;
#include &lt;vtkWindowToImageFilter.h&gt;
#include &lt;vtkGraphicsFactory.h&gt;
#include &lt;vtkImagingFactory.h&gt;
#include &lt;vtkCamera.h&gt;
#include &lt;vtkJPEGWriter.h&gt;
#include &lt;string&gt;

int main(int argc, char *argv[]) {

  // call the model
  std::string filename = argv[1];

  // Canvas Size
  double canvas_width = atof(argv[12]);
  double canvas_height = atof(argv[13]);

  // Model Scale

  // Camera Positions
  double camera_pos_x = atof(argv[2]);
  double camera_pos_y = atof(argv[3]);
  double camera_pos_z = atof(argv[4]);

  // Camera Rotations
  double camera_yaw_y = atof(argv[5]);
  double camera_pitch_x = atof(argv[6]);
  double camera_roll_z = atof(argv[7]);

  // Focal Point
  double camera_focal_x = atof(argv[8]);
  double camera_focal_y = atof(argv[9]);
  double camera_focal_z = atof(argv[10]);

  // SetViewAngle
  double camera_view_angle = atof(argv[11]);

  // UseTexture
  std::string model_texture = argv[14];
  std::string model_texture_file = argv[15];

  // Setup offscreen rendering
  vtkSmartPointer&lt;vtkGraphicsFactory&gt; graphics_factory = vtkSmartPointer&lt;vtkGraphicsFactory&gt;::New();
  graphics_factory-&gt;SetOffScreenOnlyMode(1);
  graphics_factory-&gt;SetUseMesaClasses(1);
  vtkSmartPointer&lt;vtkImagingFactory&gt; imaging_factory = vtkSmartPointer&lt;vtkImagingFactory&gt;::New();
  imaging_factory-&gt;SetUseMesaClasses(1);

  // Set my poly mapper
  vtkSmartPointer&lt;vtkXMLPolyDataReader&gt; reader = vtkSmartPointer&lt;vtkXMLPolyDataReader&gt;::New();
    reader-&gt;SetFileName(filename.c_str());
    reader-&gt;Update();
    vtkPolyData* polydata = reader-&gt;GetOutput();

    vtkSmartPointer&lt;vtkPolyDataMapper&gt; mapper = vtkSmartPointer&lt;vtkPolyDataMapper&gt;::New();
    mapper-&gt;SetInput(polydata);

  // Define the camera in scene
  vtkSmartPointer&lt;vtkCamera&gt; camera = vtkSmartPointer&lt;vtkCamera&gt;::New();
  camera-&gt;SetPosition(camera_pos_x, camera_pos_y, camera_pos_z);
  camera-&gt;SetFocalPoint(camera_focal_x, camera_focal_y, camera_focal_z);
  camera-&gt;Yaw(camera_yaw_y);
  camera-&gt;Pitch(camera_pitch_x);
  camera-&gt;Roll(camera_roll_z);
  camera-&gt;SetViewAngle(camera_view_angle);
  camera-&gt;SetClippingRange(1, 1000);

  // Put my model into the scene, kill the backface
  vtkSmartPointer&lt;vtkActor&gt; actor = vtkSmartPointer&lt;vtkActor&gt;::New();
  actor-&gt;SetMapper(mapper);
  actor-&gt;SetScale(1);
  actor-&gt;GetProperty()-&gt;BackfaceCullingOn();

  // Create a renderer, give it the camera
  vtkSmartPointer&lt;vtkRenderer&gt; renderer = vtkSmartPointer&lt;vtkRenderer&gt;::New();
  renderer-&gt;SetActiveCamera(camera);

  // Our render &quot;window&quot; (it&#039;s not really a window)
  vtkSmartPointer&lt;vtkRenderWindow&gt; renderWindow = vtkSmartPointer&lt;vtkRenderWindow&gt;::New();
  renderWindow-&gt;SetOffScreenRendering(1);
  renderWindow-&gt;SetSize(canvas_width, canvas_height);
  renderWindow-&gt;AddRenderer(renderer);

  // Add the actors to the scene
  renderer-&gt;AddActor(actor);
  renderer-&gt;SetBackground(0, 0, 0); // Background color black

  // Get me a frame!
  renderWindow-&gt;Render();

  // Dump that frame from the window
  vtkSmartPointer&lt;vtkWindowToImageFilter&gt; windowToImageFilter = vtkSmartPointer&lt;vtkWindowToImageFilter&gt;::New();
  windowToImageFilter-&gt;SetInput(renderWindow);
  windowToImageFilter-&gt;Update();

  // Damn it, there be something wrong with WriteToMemoryOn, do something to fill the gap
  std::string fn = &quot;/tmp/&quot;;
  fn += randomString(24, true, true, false);
  fn += &quot;.jpg&quot;;
  vtkSmartPointer&lt;vtkJPEGWriter&gt; writer = vtkSmartPointer&lt;vtkJPEGWriter&gt;::New();
  //writer-&gt;WriteToMemoryOn();
  writer-&gt;SetFileName(fn.c_str());
  writer-&gt;SetQuality(65);
  writer-&gt;SetInputConnection(windowToImageFilter-&gt;GetOutputPort());
  writer-&gt;Write();

  std::string command64 = &quot;base64 &quot;;
  command64 += fn;
  char fc[100];
  strcpy(fc, command64.c_str());

  std::string datauri = &quot;data:image/jpeg;base64,&quot;;
  std::string encoded = exec(fc);
  datauri += encoded;

  // return my data:uri
  std::cout &lt;&lt; &quot;&quot; &lt;&lt; datauri &lt;&lt; std::endl;

  // remove the temp file
  remove(fn.c_str());

  //return encoded;
  return EXIT_SUCCESS;
}
/*
 * A method to generate a random string in C++
 * Author: Danny Battison
 * Contact: gabehabe@googlemail.com
 */
std::string randomString(int length, bool letters, bool numbers, bool symbols) {
  // the shortest way to do this is to create a string, containing
  // all possible values. Then, simply add a random value from that string
  // to our return value
  srand(time(NULL));
  std::string allPossible; // this will contain all necessary characters
  std::string str; // the random string
  if (letters == true) { // if you passed true for letters, we&#039;ll add letters to the possibilities
    for (int i = 65; i &lt;= 90; i++) {
      allPossible += static_cast&lt;char&gt;(i);
      allPossible += static_cast&lt;char&gt;(i + 32); // add a lower case letter, too!
    }
  }
  if (numbers == true) { // if you wanted numbers, we&#039;ll add numbers
    for (int i = 48; i &lt;= 57; i++) {
      allPossible += static_cast&lt;char&gt;(i);
    }
  }
  if (symbols == true) { // if you want symbols, we&#039;ll add symbols (note, their ASCII values are scattered)
    for (int i = 33; i &lt;= 47; i++) {
      allPossible += static_cast&lt;char&gt;(i);
    }
    for (int i = 58; i &lt;= 64; i++) {
      allPossible += static_cast&lt;char&gt;(i);
    }
    for (int i = 91; i &lt;= 96; i++) {
      allPossible += static_cast&lt;char&gt;(i);
    }
    for (int i = 123; i &lt;= 126; i++) {
      allPossible += static_cast&lt;char&gt;(i);
    }
  }
  // get the number of characters to use (used for rand())
  int numberOfPossibilities = allPossible.length();
  for (int i = 0; i &lt; length; i++) {
    str += allPossible[rand() % numberOfPossibilities];
  }

  return str;
}

std::string exec(char* cmd) {
  FILE* pipe = popen(cmd, &quot;r&quot;);
  if (!pipe)
    return &quot;ERROR&quot;;
  char buffer[128];
  std::string result = &quot;&quot;;
  while (!feof(pipe)) {
    if (fgets(buffer, 128, pipe) != NULL)
      result += buffer;
  }
  pclose(pipe);
  return result;
}
{{< /codeblock >}}

So let's render something with it:

{{< codeblock lang="bash" >}}

# let's render a model
$ ./RenderObj somemodel.ply -3 21 39 0 0 0 0 0 0 30 600 600 true somemodel_texture.jpg

# ...
# lot's of base64 data
# ...
{{< /codeblock >}}

That above command will result in a big dump of base64 data (which we'll use in a bit to send to a browser), but you'll note I kept the temp file so we can look at it now:

<img src="https://storage.googleapis.com/jdr-public-imgs/blog-archive/2012/11/HJS6QlsM9h7Eqn4ULsH7hKx9.jpg" alt="Our off screen render...success!" />

We're cookin'. Let's prep for the browser.

## Captain, I don't have the RAM
So now we've got this huge model on our backend, sitting on some instance, waiting to be rendered and return frames. We need to load a smaller version of the model into the browser. These days, Three will support VTK ascii data, so that could be one way to go, or you could use some other object type. But before you get there you need a smaller version of the model and that requires decimation.

Now, decimating models is as much art as science. Crush it too hard, and you end up with that horrible creature at the end of The Fly. You can do this a number of ways, with a number of programs (example: <a href="http://meshlab.sourceforge.net/">MeshLab</a>). When you deal with the big models that require decimation, you will run into a problem no matter which program you use: RAM.

You think that little 16GB workstation is going to be enough? Unlikely. The reality is, big models take up lots of RAM, and when you're doing decimation, it's going to hurt. We have machines that do this sort of thing in our animation department, but let's say to nah, I have Amazon, show me some other way. Just so happens, VTK can do that too:

{{< codeblock lang="cpp" >}}
#include &lt;vtkPolyData.h&gt;
#include &lt;vtkQuadricDecimation.h&gt;
#include &lt;vtkPLYWriter.h&gt;
#include &lt;vtkPLYReader.h&gt;
#include &lt;vtkSmartPointer.h&gt;
#include &lt;vtkPolyDataMapper.h&gt;
#include &lt;vtkProperty.h&gt;
#include &lt;string&gt;

bool hasEnding (std::string const &amp;fullString, std::string const &amp;ending)
{
    if (fullString.length() &gt;= ending.length()) {
        return (0 == fullString.compare (fullString.length() - ending.length(), ending.length(), ending));
    } else {
        return false;
    }
}

int main(int argc, char *argv[])
{
  std::string filename = argv[1];
  char* fnoutput = argv[2];
  double percReduce = atof(argv[3]);

  vtkSmartPointer&lt;vtkPLYReader&gt; reader = vtkSmartPointer&lt;vtkPLYReader&gt;::New();
  reader-&gt;SetFileName(filename.c_str());
  reader-&gt;Update();

  vtkSmartPointer&lt;vtkPolyData&gt; inputPolyData = vtkSmartPointer&lt;vtkPolyData&gt;::New();
  inputPolyData-&gt;ShallowCopy(reader-&gt;GetOutput());

  std::cout &lt;&lt; &quot;Before decimation&quot; &lt;&lt; std::endl &lt;&lt; &quot;------------&quot; &lt;&lt; std::endl;
  std::cout &lt;&lt; &quot;There are &quot;
            &lt;&lt; inputPolyData-&gt;GetNumberOfPoints() &lt;&lt; &quot; points.&quot; &lt;&lt; std::endl;
  std::cout &lt;&lt; &quot;There are &quot;
            &lt;&lt; inputPolyData-&gt;GetNumberOfPolys() &lt;&lt; &quot; polygons.&quot; &lt;&lt; std::endl;

  vtkSmartPointer&lt;vtkQuadricDecimation&gt; decimate =  vtkSmartPointer&lt;vtkQuadricDecimation&gt;::New();
  decimate-&gt;SetTargetReduction(percReduce);

  decimate-&gt;SetInputConnection(inputPolyData-&gt;GetProducerPort());
  double test = decimate-&gt;GetTargetReduction();
  decimate-&gt;Update();

  vtkSmartPointer&lt;vtkPolyData&gt; decimated = vtkSmartPointer&lt;vtkPolyData&gt;::New();
  decimated-&gt;ShallowCopy(decimate-&gt;GetOutput());

  std::cout &lt;&lt; &quot;After decimation&quot; &lt;&lt; std::endl &lt;&lt; &quot;------------&quot; &lt;&lt; std::endl;

  std::cout &lt;&lt; &quot;Entered % target: &quot;
            &lt;&lt; argv[3] &lt;&lt; &quot; .&quot; &lt;&lt; std::endl;

  std::cout &lt;&lt; &quot;Decimate % target: &quot;
            &lt;&lt; test &lt;&lt; &quot; .&quot; &lt;&lt; std::endl;

  std::cout &lt;&lt; &quot;There are &quot;
            &lt;&lt; decimated-&gt;GetNumberOfPoints() &lt;&lt; &quot; points.&quot; &lt;&lt; std::endl;
  std::cout &lt;&lt; &quot;There are &quot;
            &lt;&lt; decimated-&gt;GetNumberOfPolys() &lt;&lt; &quot; polygons.&quot; &lt;&lt; std::endl;

  vtkSmartPointer&lt;vtkPLYWriter&gt; plyWriter = vtkSmartPointer&lt;vtkPLYWriter&gt;::New();
  plyWriter-&gt;SetFileName(fnoutput);
  plyWriter-&gt;SetInputConnection(decimate-&gt;GetOutputPort());
  plyWriter-&gt;Write();

  return EXIT_SUCCESS;
}
{{< /codeblock >}}

You'll be quick to note, this is very similar to their <a href="http://www.cmake.org/Wiki/VTK/Examples/Cxx/Meshes/QuadricDecimation">example</a>. Didn't I tell you VTK was great?

How much RAM this consumes is based on how big your model is. I've run it against a 2GB model with 95M poly's, and it just about maxes out 64GB of RAM when it's working.

What I've found works best is actually creating a series of lower poly count models. Let's say 1M, 3M, 10M...and so on. This allows us to get higher resolution frames but much faster render times on the server (which I will explain later). I then drop a lower res model into MeshLab (say the 1M), and then I hand decimate it to 100K polys and then convert that to Three's json format for easy loading.

Could you automate all of that? Of course.

## Three.js and a little AJAX for good rendering
So you've got a remote renderer, you've decimated your huge model into smaller models, and you've converted to your choice for loading in Three.js.  Now what?  Let's do hook to our web model in WebGL and then load that remote rendered frame!

I'm not going to go into the basics of Three.js, there are already tutorials and lots of examples about the in's and out's of loading a model. Let's jump to where the good stuff:

{{< codeblock lang="javascript" >}}
// other classy things

this.ajaxOut = function (camera, control, auto, polycount) {
  console.group(&quot;Prepping to get RemoteFrame&quot;);
  if (camera != null){
    var viewportCamera = camera;
  } else {
    var viewportCamera = this._viewport.getCamera();
  }

  if (control != null) {
    var viewportControl = control;
  } else {
    var viewportControl = this._controls;
  }

  // let&#039;s initially be sane and only autorender 1M frames
  if (auto){
    clp = _loadModelPath + &quot;1&quot;;
  } else {
    // burn those CPU cycles!
    clp = _loadModelPath + polycount;
  }

  var data = {
      cameraPositionX : viewportCamera.position.x,
      cameraPositionY : viewportCamera.position.y,
      cameraPositionZ : viewportCamera.position.z,
      cameraRotationX : viewportCamera.rotation.x,
      cameraRotationY : viewportCamera.rotation.y,
      cameraRotationZ : viewportCamera.rotation.z,
      cameraFOV : viewportCamera.fov,
      controlsX : viewportControl.target.x,
      controlsY : viewportControl.target.y,
      controlsZ : viewportControl.target.z,
      canvasW : document.getElementById(&quot;canvas_viewport&quot;).width,
      canvasH : document.getElementById(&quot;canvas_viewport&quot;).height
  };
  console.info(&quot;Set up data array for POST&quot;, data);

  var postData = JSON.stringify(data);
  console.info(&quot;Stringify JSON object&quot;, postData);

  var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
            console.info(&quot;Looking good, AJAX returned 200!&quot;);

            var newDiv = document.createElement(&quot;div&quot;);
            newDiv.setAttribute(&quot;data-img&quot;, httpRequest.responseText);

        // meh
            var content = &quot;Rendered Frame &lt;button class=remoterender-view&gt;View&lt;/button&gt; | &lt;button class=remoterender-save&gt;Save&lt;/button&gt;&quot;;
            newDiv.innerHTML = content;
            _renderResponseBlock.appendChild(newDiv);
            _renderResponseText.innerHTML = &quot;&quot;;

            if (auto) {
                var myCanvas = document.getElementById(&#039;canvas_viewport_renderoutput&#039;);

                var ctx = myCanvas.getContext(&#039;2d&#039;);
                ctx.canvas.width  = window.innerWidth;
                ctx.canvas.height = window.innerHeight;

                var img = new Image;
                img.onload = function() {
                  ctx.drawImage(img,0,0); // Or at whatever offset you like
                };

                img.src = httpRequest.responseText;

                $(&quot;#canvas_viewport&quot;).hide();
            $(&quot;#canvas_viewport_renderoutput&quot;).show();
                console.debug(&quot;rendering automagically!&quot;);
            }

        } else {
          _renderResponseText.innerHTML = &quot;Could not get a remote frame at this time. Please try again later.&quot;;
        }
      }
    };

    httpRequest.open(&#039;POST&#039;, clp);
    httpRequest.setRequestHeader(&#039;Content-Type&#039;, &#039;application/x-www-form-urlencoded&#039;);
    httpRequest.send(&#039;data=&#039; + encodeURIComponent(postData) );
    console.info(&quot;Fire in the hole&quot;);

  console.groupEnd();
};

// other classy things
{{< /codeblock >}}

Pretty staightforward right? We're polling the current viewport camera, controls, and field of view so that we can send that to our remote renderer. The remote renderer throws back some base64 data that we then use to draw on a secondary canvas that we then bring to the front (note, we don't draw on our WebGL context canvas, that will not do what you want it to).

## The example, in action
The following video shows the concept in action. Nifty.

<iframe width="560" height="315" src="https://www.youtube.com/embed/TKZOJNA_ToI" frameborder="0" allowfullscreen></iframe>

And yes, that's a shorter clip from a video I authored for a conference.

## Where can I play with it?
At the moment, the demo is not online. Remote renderering large models on Amazon or your cloud provider of choice can be expensive.

If you were to write use a proper C++ service that can be autoscaled on Amazon (which is what *cough* I would do), you have a number of things to handle beyond that. How do you get fast access to the files? Do you mount them off of S3? Do you shuffle them off of RAIDed EBS volumes? How do decrease latency across regions?

Once you go down this road, things get complicated and performance can get pricey.

In real life, with a lot of testing, I've found that rendering 1M to 3M poly's using binary data and RAIDed EBS volumes will get you renders in the 0.3 to 1.1 second range. Taking into latency, you're looking at a 1.2 to 4 second round trip from request to response. This is why you'll note that the autorender flag in the JavaScript above was set to 1M; it's about as high as you can go for onCameraMovementStop based renderering. Beyond that, there is a noticable delay on frame return.

When you start rendering the big files, anything above 10M polys really, you're going to get vastly different render times. 95M polys can run anywhere from 50-90 seconds (which if you start to think about it, is not terrible given its size...but for a user that is not used to big 3D assets, it's slower than dirt).  In these sorts of cases, you've got to job queue.

## Conclusion
In a perfect world this would be a rather turn key process, but it really depends on the type of models and data you're dealing with. Open source tools such as <a href="http://www.paraview.org/">ParaView</a> have a similar set of functionality, including something more generally useful such as point cloud library support (see <a href="http://pointclouds.org/news/pcl-and-paraview-connecting-the-dots.html">PCL and ParaView -- Connecting the Dots</a>), but maybe you're only dealing with polys. If that's the case, then you can translate that to something workable on the web, using little more than the tools I've described above.

_Note: I will make every effort to box up the entire tool set in some manner that makes it runnable, either locally or on your hosting of choice._

