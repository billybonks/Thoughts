##Test##
- put Card
- get settings
- put settings
- get settings

##Add##
- tags controler
- tags webservice methods
- Complete GetTemplateByID
- Put GetTemplateByID



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