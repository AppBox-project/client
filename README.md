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
- [x] App store
  - [x] Browsing apps
  - [x] Installing apps
- [x] OTA updates
  - [x] Apps
    - [x] Improvements
      - [x] Batch update (with one build)
      - [x] Schedulable update (with one build)
  - [x] System
    - [x] Simple git pull update
    - [ ] Better update UI
    - [ ] Changelogs
- [x] Better app context
  - [x] Data interactions
    - [x] Subscribing to data
    - [x] Cancelling listeners before the app closes
    - [x] Updating data
  - [x] More UI elements
    - [x] Pre-made UI lay-outs
      - [x] ListDetail-Layout
- [ ] Layouts
  - [x] Desktop-layout
  - [x] Mobile layout
    - [x] Design layout
    - [x] Make existing properties more responsive
    - [x] PWA
- [ ] Improve app logic
  - [ ] Every app will have it's own desktop
- [ ] Make apps
  - [x] Quick space
    - [x] Notes
      - [ ] Eventually: clone onenote
    - [x] To-do
      - [x] Base version
      - [x] Mobile friendly
      - [x] Drag and drop order
      - [x] Sub to-do's
    - [x] File / dropzone
  - [x] All-purpose CRM app
  - [x] Website builder
- [ ] Data model improvements
  - [x] Object level validations
  - [x] Automations
  - [x] Relationships
  - [x] Formulas
    - [x] Local (within objects)
    - [x] Following the relationship model
  - [ ] Improved permissions system
    - [x] Global controls
    - [ ] Per-field controls
