Welcome to your final checkpoint at Fullstack Academy!

## Resources

* [FSA Checkpoint Academic Integrity Policy](https://gist.github.com/short-matthew-f/2ef877e84d6624626ec4fcc5d899936b)


## Specs

Please make sure you complete specs located in the following files:

`tests/tier-01.js`

`tests/tier-02.js`

`tests/tier-03.js`

If you complete and pass all the specs in these three files, you may attempt the extra-credit in `tests/tier-04-extra-credit.md`

#### Special Notes

**This checkpoint is organized in tiers. Each tier will require you to work across the stack, setting up functionality for the tests in the next tier. You should work on the tiers in order (tier-1 => tier-2 => tier-3), but if you get stuck on a spec, you may skip it and come back to it later. The tests MAY depend on each other.**

- Any files with `/* DO NOT EDIT */` at the top do not need to be edited to get the tests to pass
- You don't need to install any npm packages to pass any specs (and you probably shouldn't).
- Every file that you need has been created. Don't bother creating new files.

## Getting started

**Fork** and clone this repository. Then execute the following to run all tests:

```bash
npm install
```

To run all the tests, run `npm test`. To run only _specific_ test suites, you can optionally run the following:

```bash
npm run tier-1
npm run tier-2
npm run tier-3
```

To only run a specific `describe` or `it`, you can also chain `.only`:

```js
it.only('does something', testFunc);
```

## Submitting

1. `git add -A`
2. `git commit -m 'submission for deadline'`
3. `git push origin master`
