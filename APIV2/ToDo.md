##Test##


##Add##
- tags controler
- tags webservice methods
- Complete GetTemplateByID
- Put GetTemplateByID
- put settings


##Errors to fix##
Create template of a card that has 0sections throws error
  im thinking add a message saying sorry you cant create a template with 0 sections unless we add some sort of savable config

Add success message after template created

Fix popup
  needs to be click twice once open to open
  doesnt fade away when done
  errors are linked :)

Application model, needs to foward a guest access token if user isnt logged in, as they may want to view the public cards

##Extensions##

Add a tempaltes viewing and editng section, prob a good idea to base it of the cards work, but the model templates and the the model card are imcompatible so will see how we work witht this

Build Guest view

Add sideloading of attachments since data loaded /sections

Add i18n support discourse did this well http://eviltrout.com/2013/11/24/i18n-in-ember.html
##Build Extensions##

move templates to relative plugins folder and add build task

port is still hardcoded, maybe add this stuff to grunt build