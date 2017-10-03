# Timeline concept for a Virtual DOM

*Note: This is a work in progress. Readme under construction, no working examples yet...*

With most applications using a virtual DOM framework, state changes are generally a result of user input, network activity and the like.

There are other situations when you might want to script state changes over time (akin to using a Flash timeline.) A naive approach might look something like this:

```javascript
// A timeline to display 3 components, one after
// the other for one second each.
// (Assume a,b,c are magically hooked up to redraw)
let a = false, b = false, c = false
let timer
function timeline() {
	timer = setTimeout(() => {
		a = true
		timer = setTimeout(() => {
			a = false
			b = true
			timer = setTimeout(() => {
				b = false
				c = true
				timer = setTimeout(() => {
					c = false
					timer = undefined
				}, 1000)
			}, 1000)
		}, 1000)
	}, 1000)
}

function cancel() {
	if (timer) {
		clearTimeout(timer)
		timer = undefined
	}
}

function render() {
	return h('.container',
		a && h(compA),
		b && h(compB),
		c && h(compC)
	)
}
```

Unfortunately, the longer your timeline gets, the larger your pyramid of doom becomes.

We could flatten this out using promises, however (native) promises are not cancelable. We could use a Promise implementation that supports cancellation. But what if we also want to be able to pause & resume playback?

In some cases, animation libraries can solve the issue, usually through direct dom manipulation. However then your DOM will be out of sync with the VDOM. Additionally, animation libraries tend to work with DOM elements, not components, per se.

Alternately you could use an animation/tween library to transition/animate state and translate state that to your VDOM. However scripting logic, loops and branching are going to be limited by the expressivity of what your timeline data allows.

Ideally we'd like to write abitrary logic with branching, loops in regular Javascript (or Typescript) that could be paused, resumed and cancelled at any time - without needing to know anything about its current state, or having to write awkward cleanup code that needs to change whenever the timeline logic chages.
