# EXTRA CREDIT

There are no tests for the extra credit!! We will look over your code manually to grade it.

First, STOP AND COMMIT YOUR WORK. It is possible depending on your extra credit implementation that some of your other specs will break. Please commit right before starting with a message that clearly states that you've finished the other specs. Then, when you are ready to move on to the extra credit, create an `extra-credit` branch. This will help us grade more easily. Submit a help ticket if you need help creating this branch.

To get a total of 6 extra points, you may hook up the <CampusList /> component and <CampusInput /> component to the store.

To avoid breaking previously passing specs, please don't change any `export` statements already provided. You may add additional `export` statements for your `connect`ed components.

You may use vanilla redux OR react-redux bindings to do this. More details found below!

YOU MUST HAVE FINISHED TIER 01, 02, and 03 BEFORE ATTEMPTING THE EXTRA CREDIT.

## CampusList - 2.5 pts

Defined in `../client/components/CampusList.js`

Use the `fetchCampuses` thunk creator to fetch all the campuses and update your store, and then render those campuses from your store into the list of campuses

## CampusInput - 3.5 pts

`../client/components/CampusInput.js`

Add a submit button with click handler. Write a handleSubmit function that will invoke your thunk creator `postCampus` with the data from your form. `handleSubmit` should be invoked when the button is clicked.

## Throttle - 5 pts

When we go to generate groups of students, the processing is very slow. Therefore, an end user may not realize the time it takes, and click the 'Generate Pairs' button time and time again, thinking it's not working. To counter this, we essentially want to LIMIT how often a function can run per unit time. Write a `throttle` method that will wrap a function and a throttle time (t). This wrapped function will only run the original function once for every unit t. Subsequent function calls within this period will be ignored until the period (t) expires.

Have fun!
