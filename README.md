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
- [ ] App store
  - [ ] Browsing apps
  - [ ] Installing apps
- [ ] OTA updates
  - [ ] Apps
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
  - [ ] Mobile layout
    - [ ] Design layout
    - [ ] Make existing properties more responsive
    - [ ] PWA
- [ ] Improve app logic
  - [ ] Every app will have it's own desktop
- [ ] Make apps
  - [ ] Quick space
    - [ ] Notes
      - [ ] Eventually: clone onenote
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
