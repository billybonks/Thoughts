Thoughts
========
pwnt by Aidan its all irrelevent anyways so pwn away


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

 Add array entry to  Client\Scripts\Components\SectionFormComponent


 ###SERVER INSTALL###
 #install node npm and grunt-cli#
sudo apt-get install -y python-software-properties
sudo apt-add-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs
node -v
sudo npm install -g grunt-cli

#install Git#
sudo apt-get install -y git

#intsall neo4j#
sudo wget http://dist.neo4j.org/neo4j-community-2.0.1-unix.tar.gz
sudo tar -zxf neo4j-community-2.0.1-unix.tar.gz
sudo rm neo4j-community-2.0.1-unix.tar.gz

#Install apache#
sudo apt-get install -y apache2

#Install java if missing
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java7-installer


#clone repo#
sudo git clone https://github.com/billybonks/Thoughts.git





#sudo /etc/init.d/apache2 start   #start apache
#sudo /etc/init.d/apache2 stop   #stop apache
#sudo /etc/init.d/apache2 restart   #restart apache

#build Thoughts\Client
#Configure apache to point to correct location Thoughts\Client

#vim /etc/apache2/sites-enabled/000-default.conf
#Change document root to point to /home/ubuntu/Thoughts/Client

#add org.neo4j.server.webserver.address=0.0.0.0
#to conf/neo4j-server.properties

<Directory /home/ubuntu/Thoughts/Client/ >
        AllowOverride None
        Require all granted
</Directory>


##Site Configuration##

Create APIV2/controllers/Routes/secrets.js

insert the following information

exports.facebook =
  {
    authorization_url: "https://www.facebook.com/dialog/oauth",
    client_id: "",
    client_secret: "",
    callback_url: "http://ec2-54-186-162-177.us-west-2.compute.amazonaws.com:4730/auth/facebook/callback",
    token_url: "https://graph.facebook.com/oauth/access_token"
  }

Set the database config string in APIV2/config/app.js
Set the webservice url in Client/Scripts/Settings.js
Set Return clientHostName  APIV2/config/app.js
Run npm install in apiv2 and client

grunt client

npm start server

test :D!


