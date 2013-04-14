# Solib ![](mod-moodle_solib/pix/icon.png)
Solib is a social learning application for Moodle developed by 5 students from ECE Paris as a "PPE" (Multidisciplinary Project in Team).

[Video link](http://youtu.be/Sq9urtnwvYs)

* More details for each part of the application can be found in their related README files.

## SolibCore
This is the Solib server: the core of Solib. It consists into a [Node.js](http://nodejs.org/) application. The population of this application must come from an external service. Moodle for the moment, since ECE is using it.

## moodle-mod_solib
The required plugin to use Solib with Moodle. This plugin will allow you to create a Solib activity in one of your Moodle courses, and this activity will contains a link with authentication information to connect to the Solib server.

## Licence
Coming.
