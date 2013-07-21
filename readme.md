#Didgeridoo developer's handbook

##Getting started

###Introduction

Didgeridoo is based on a stack of edge technologies, NodeJS ([CompoundJS](compoundjs.com)) and [MongoDB](mongodb.org).

###Installation

* [Install NodeJS](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
* Install CompoundJS:

		sudo npm install compound -g

* Clone the Didgeridoo repo and install dependencies:

		cd ~
		git clone git@github.com:fmvilas/Didgeridoo-IDE.git
		mv Didgeridoo-IDE didgeridoo
		cd didgeridoo
		npm install
		

* [Install MongoDB](http://docs.mongodb.org/manual/installation/)
* Configure MongoDB and add some data:

		# Open a new terminal window (let's call it Window 2) and write:
		mongod

		# Back to the initial terminal window (let's call it Window 1):
		mongo
		# Now in mongo…
		> db.addUser({user: "admin", pwd: "1234", roles: []})
		> use didgeridoo
		> db.User.save({ "_id" : ObjectId("5196534c9c253bdbb1d00fb6"), "name" : "Test Project", "owner" : ObjectId("51964caa9c253bdbb1d00fb4") })
		> db.Project.save({ "_id" : ObjectId("5196534c9c253bdbb1d00fb6"), "name" : "Test Project", "owner" : ObjectId("51964caa9c253bdbb1d00fb4") })
		> exit
		
		# IMPORTANT: Note that db.addUser and db.User.save are not referring to the same kind of user. First adds a new user to the MongoDB system while second adds a new user to the Didgeridoo's User collection (User table in SQL). So, first is used to access MongoDB and second is used to log on Didgeridoo IDE.

		# Go back to Window 2 and press Ctrl+C to stop the mongod process and write:
		sudo mongod --auth
		# If mongod process terminate inmediately try closing all terminal windows and type it again.
		
		# Now go to Window 1 and try connection:
		mongo -u admin -p 1234 didgeridoo

		# At this point you should be able to connect to mongo this way. If not contact me at fmvilas@gmail.com.

		# Now let's create some content for the project created above:
		mkdir ~/didgeridoo-content
		mkdir ~/didgeridoo-content/5196534c9c253bdbb1d00fb6
		
		# Change to the project dir and put some content inside
		cd ~/didgeridoo-content/5196534c9c253bdbb1d00fb6
		echo "This is a test file" > test.txt
		
* If you've reached this point without problems (then you're my hero) you should have the Window 2 with the *sudo mongod --auth* command. Don't close it. It's the MongoDB daemon. Just go to Window 1 and type:

		cd ~/didgeridoo
		compound s

* You should have Didgeridoo listening on port 3000, so go to your web browser and navigate to **localhost:3000/ide**

##Server side

###CompoundJS

Didgeridoo is using CompoundJS, which is a framework that works on top of [Express](http://www.expressjs.com).

CompoundJS creates a server instance listening at port 3000 by default. If you want Didgeridoo running on another port you can specify it as follows:

	# Listen on port 80 (you might need to sudo)
	sudo compound s 80

###MongoDB

Didgeridoo is using MongoDB, which is a NoSQL Document-oriented database.

For those with a relational databases background:

Compared to relational databases, for example, collections could be considered as tables as well as documents could be considered as records. But they are different: every record in a table has the same sequence of fields, while documents in a collection may have fields that are completely different. For example, we can have 2 users with different sets of information, like this:

	{
		users: [
			{
				name: "Fran",
				age: 29
			},
			{
				email: "john@didgeridoo.io",
				eyeColor: "blue"
			}
		]
	}

##Client side

###App structure

Didgeridoo is divided in four main parts or concepts. These are:

* Core
* Libraries
* Modules
* Actions

![image](modules-facade-core-libraries-diagram.jpg)


The **core** is a single file and it contains the main program, controlling the initialization of the app, the API and so on.

**Libraries** are script files that provide a better and simple experience while coding, such as jQuery, jQuery UI, Bootstrap, etc.

**Modules** differs from libraries that these are programs that do specific tasks or provide visual elements to the interface, usually based on the use of libraries (i.e. the Project Files explorer, the Designer, the CodeView).

For the purpose of loading modules and libraries you should use RequireJS ([requirejs.org]()), which is included by default.

	//Example: Loading the Underscore library at libraries/underscore

	require(['libraries/underscore/underscore-min'], function() {
		//Now you can use Underscore
	});

	//Example: Loading a Underscore library by its name, previously declared at
	// 		   /public/app/didgeridoo.js

	require(['underscore'], function() {
		//Now you can use Underscore
	});

An **action** is a kind of module that defines a common task. You should define an action when a common task can be done in various ways and you can't control all these ways. For example, a common task that fits the definition is the *FileSave* action, which can be performed via keyboard (Ctrl/Cmd+S), via top menu option File > Save, or even an automated script that eventually save all files.