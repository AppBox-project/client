# AppBox

## Goals

- Have a salesforce-like abstract datastructure that can be controlled from the UI.
- Have realtime data
- Have support for apps

## In progress

- [x] Datamodel + realtime data
- [x] Interface with pluggable apps
- [ ] Security test
- [x] Make accessible via the web
  - [x] Package as docker container
- [X] App store
  - [X] Browsing apps
  - [X] Installing apps
- [ ] OTA updates
  - [ ] Apps
    - [ ] Improvements
      - [ ] Batch update (with one build)
      - [ ] Schedulable update (with one build)
  - [x] System
    - [x] Simple git pull update
    - [ ] Better update UI
    - [ ] Changelogs
- [ ] Better app context
  - [X] Data interactions
    - [X] Subscribing to data
    - [X] Cancelling listeners before the app closes
    - [X] Updating data
  - [ ] More UI elements
    - [ ] Pre-made UI lay-outs
      - [x] ListDetail-Layout
- [ ] Layouts
  - [x] Desktop-layout
  - [X] Mobile layout
    - [X] Design layout
    - [X] Make existing properties more responsive
    - [X] PWA
- [ ] Improve app logic
  - [ ] Every app will have it's own desktop
- [ ] Make apps
  - [ ] Quick space
    - [X] Notes
      - [X] Eventually: clone onenote
    - [ ] To-do
      - [x] Base version
      - [x] Mobile friendly
      - [ ] Drag and drop order
      - [ ] Sub to-do's
    - [ ] File / dropzone
  - [ ] All-purpose CRM app
  - [ ] Website builder
- [ ] Data model improvements
  - [ ] Object level validations
  - [ ] Automations
  - [x] Relationships
  - [x] Formulas
    - [x] Local (within objects)
    - [x] Following the relationship model
  - [ ] Improved permissions system
    - [ ] Global controls
    - [ ] Per-field controls
