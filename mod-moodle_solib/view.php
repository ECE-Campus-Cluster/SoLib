<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Solib module
 *
 * @package    mod
 * @subpackage solib
 * @copyright  2013 ECE Paris
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once("../../config.php");
//require_once( __DIR__ . "/lib/curl.php");

$id = optional_param('id',0,PARAM_INT);    // Course Module ID, or
$l = optional_param('l',0,PARAM_INT);     // solib ID

if ($id) {
    if (! $cm = get_coursemodule_from_id('solib', $id)) {
        print_error('invalidcoursemodule');
    }

    if (! $course = $DB->get_record("course", array("id"=>$cm->course))) {
        print_error('coursemisconf');
    }

    if (! $solib = $DB->get_record("solib", array("id"=>$cm->instance))) {
        print_error('invalidcoursemodule');
    }

    $url = "http://solib.hopto.org:8080/log?id=".$USER->id."&firstname=".$USER->firstname."&lastname=".$USER->lastname;
?>
    <html>
        <head></head>
        <body>
            <a href="<?php echo $url ?>" target="_blank">Connect to Solib</a>
            <br />
            <a href="http://solib.hopto.org:8080/log?id=67&firstname=Jean&lastname=Luc" target="_blank">Connect to Solib with fake account (for tests)</a>
        </body>
    </html>
<?
    
} else {
    if (! $solib = $DB->get_record("solib", array("id"=>$l))) {
        print_error('invalidcoursemodule');
    }
    if (! $course = $DB->get_record("course", array("id"=>$solib->course)) ){
        print_error('coursemisconf');
    }
    if (! $cm = get_coursemodule_from_instance("solib", $solib->id, $course->id)) {
        print_error('invalidcoursemodule');
    }
}

require_login($course, true, $cm);

//$PAGE->set_url("/solib/view.php");

//redirect("$CFG->wwwroot/course/view.php?id=$course->id"); // Redirect to moodle core


