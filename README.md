Thoughts
========

MOC

﻿Settings.js -> WebserviceUrl

 Login.html -> AuthURLRef

 Need to setup production OAuth accounts


 Adding a new section type
========

 Create display template Client\Templates\Components

 Create a Component Controller Client\Scripts\Components component controller should extend BaseSectionComponent

     App.PropertyMainComponent = App.BaseSectionComponent.extend({
    
     })

 Add section entry to Client\Templates\card.html
   ```             
    {{#if isProperty}}
      {{property-main title = section.title data=section.attachments section=section store=store}}
    {{/if}}
   ```
 Add entry to Client\Scripts\Controllers\SectionController.js

