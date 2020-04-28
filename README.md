# Todo App
Written as an exercise in learning Typescript as well as practicing Vue CLI and SASS. It is functional, but not actively supported.

### Guiding principles
##### Constraint is freedom
I am a person who craves constraint in my record keeping. Left to my own devices and my own personal time, I will feel overwhelm with the possible tagging/categorizing and tree-structuring available in an app for listing tasks. This app seeks to eliminate that overwhelm, and in so doing prevent "tag creep" or a "squirrel's nest" of notes.

##### Everything besides the words you write is going to eventually piss you off
Even if it might hurt in terms of usability in the short term if there is a feature or UI element that you usually look for in an app like this, in the long term the goal is to be as close to a piece of paper as possible. Where the app can be useful is by retaining the power of certain features within the text itself, a la markdown.

### Planned features/fixes
- **feature**: tagging for notes
  - limit of 2 tags
- **feature**: linking of notes via mention
  - visual cue for linked notes in list/note UI
- **feature**: *optional* versioning
  - This is more about choosing to save a version of a note such that it is tied to the original
  - If desired, the previous note can be re-named and promoted to its own note (though the relation should remain)
  - new note type for "previous version" that lives in the domain of the original note
    - UI for "versions" should be read-only
    - new "previous version" data type w/ many-to-one relationship to `INote`

### Notes on packages used:
- `sass` (otherwise known as Dart Sass) must be used instead of `node-sass` to enable at-rule **`@use`** 
  - @see https://carterbancroft.com/sass-and-webpack/