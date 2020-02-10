

### Dynamic Label 2/9


After trying in vain to find a pure nativescript
solution, I finally decided to switch to the
native layers since these platforms certainly
have text extent code in their arsenal.

Starting with Android:

- Found examples here:
https://chris.banes.dev/2014/03/27/measuring-text/ 
and following the associated android docs.

also, found 'fun' fact about formatting here:
https://nativescripting.com/posts/how-to-vertically-center-label-text-in-nativescript-android
and learned about this format bug and about android Gravity.

For Android (at least, not sure yet on ios) we need
to layout the text in lines and measure it to the clip point
and build the bounding rect ourselves.

The Chris Banes code does this for us pretty nicely.

There's a few tweaks and a couple of 'magic numbers'
in the solution, but they appear to be minor at this point
and have to do with differences in the text wrap boundaries
in the virtual and real locations and the decisions made.  
I'd say because it's different algorithms, but I don't think 
it is. I'm sure the same wrapping code is used.  I am passing
the Paint context from the label, so it should be the same exact
thing, metrics and all.
One thing I did need to futz with is getting the padding
values into account.  
Still seems to have an issue with bottom padding for some reason.

Need to test more, but weirdnesses only seem to be appearing
in unusual cases, like really small or really large strings.

#### Demo todo list

The demo code needs a few changes:

- [ ] Have two (or more) labels with different sizes
that we set the same text into.

- [ ] Make the static list a table with descriptions
of what we are looking at on the right.

- [ ] Make a third page demo that dynamically changes the
text of a DL through binding.
In the end, we may get rid of page2 here, since
2 and 3 would be basically the same demo, but
page 3 is more {N} like. 



#### property change listener

Need to do a new fitText on the change of
key properties.

- [ ] learn about property change listener
- [ ] implement it for the DL
- [ ] debounce a call to FitText as a result.  


### iOS Support

- [ ] Set up ios-side overrides similar to android

- [ ] Implement text extent per this resource: 
https://medium.com/%40Bitomule/getting-text-size-on-ios-bdae7521822f

- [ ] Duplicate fitText functionality

- [ ] should work the same

### Publish to the community

Once this is complete, publish it.  That's the
easiest way to put it out for building, anyway (it's what I 
did for `nativescript-dog-image-recognizer`)

- create decent readme doc

I think it should be well received and it will be
fun to look at the downloads.

Write a blog about it later too. (Medium)



