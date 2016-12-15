# slideshow

A JavaScript slideshow/carousel library.

## How It Works

1 - Add markup to your html file. The outer container should have a class name of "slideshow" and the element that contains the actual slides should have a class name of "slideshow-slide-list". Give each slide a class name of "slideshow-slide" and any captions a class name of "slideshow-caption".

Markup example using `div` and `figure` tags:

```html
<div class="slideshow">
  <div class="slideshow-slide-list">
    <figure class="slideshow-slide">
      <img src="1.jpg" alt="image 1">
      <figcaption class="slideshow-caption">Slide 1 caption</figcaption>
    </figure>
    <figure class="slideshow-slide">
      <img src="2.jpg" alt="image 2">
      <figcaption class="slideshow-caption">Slide 2 caption</figcaption>
    </figure>
    <figure class="slideshow-slide">
      <p>Slide with text</p>
    </figure>
    <figure class="slideshow-slide">
      <img src="4.jpg" alt="image 4">
    </figure>
  </div>
</div>
```

Markup example using an unordered list:

```html
<div class="slideshow">
  <ul class="slideshow-slide-list">
    <li class="slideshow-slide">
      <img src="1.jpg" alt="image 1">
      <p class="slideshow-caption">Slide 1 caption</p>
    </li>
    <li class="slideshow-slide">
      <img src="2.jpg" alt="image 2">
      <p class="slideshow-caption">Slide 2 caption</p>
    </li>
    <li class="slideshow-slide">
      <img src="3.jpg" alt="image 3">
    </li>
    <li class="slideshow-slide">
      <img src="4.jpg" alt="image 4">
    </li>
  </ul>
</div>
```

2 - Include slideshow.css and slideshow.js on your page:

```html
<link href="path/slideshow.min.css" rel="stylesheet" type="text/css">
<script src="path/slideshow.min.js"></script>
```

3 - Call Slideshow, passing the parent element (element with `.slideshow` class) as the first argument and a settings object (optional) as the second argument:

```js
var el = document.getElementById('slideshow-elements-id');
Slideshow(el);

// Or if you want to specify custom settings:
var settings = {
  controlsBelow: true,
  showIndicators: true,
  transitionEffect: 'slide'
  // etc...
};

Slideshow(el, settings);
```

## Default settings
| Setting                  | Description                                                                                                       | Default Value  |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- | -------------- |
| allowSwipe               | allow swipe for mobile and desktop (click and drag using mouse)                                                   | true           |
| autoplay                 | autoplay slides                                                                                                   | false          |
| controlsBelow            | place controls below slides                                                                                       | false          |
| delay                    | delay, in milliseconds, between transitions during autoplay                                                       | 5000           |
| loopSlides               | for transition 'slide', transition from last slide to first will go one slide to the right instead of 'rewinding' | true           |
| navArrows                | show nav arrows to allow users to manually navigate through slides                                                | true           |
| navNextClass             | class name for next slide button                                                                                  | *none*         |
| navPrevClass             | class name for previous slide button                                                                              | *none*         |
| playButton               | show Play/Pause button                                                                                            | false          |
| playButtonClass          | class name for Play/Pause button                                                                                  | *none*         |
| playLoop                 | number of times for autoplay to loop over slides, -1 for infinite                                                 | -1             |
| pauseOnUserNav           | pause autoplay when user uses navigation arrows                                                                   | false          |
| showIndicators           | show dot indicators so users can see which slide is being shown                                                   | false          |
| startOnSlide             | slide to start on                                                                                                 | 1              |
| transitionTime           | transition time in milliseconds                                                                                   | 500            |
| transitionTimingFunction | transition timing function                                                                                        | 'ease-out'     |
| transitionEffect         | 'fade', 'slide' or null for no transition effect                                                                  | 'fade'         |


## Live Demo
[Slideshow](http://s-richards.github.io/slideshow)


## Browser support:
* Google Chrome
* Mozilla Firefox
* IE 10+