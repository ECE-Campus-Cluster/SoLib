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

// http://docs.moodle.org/dev/Page_API
// http://docs.moodle.org/dev/Output_renderers
// http://fr.slideshare.net/samhemelryk/moodle-output-library

require_once("../../config.php");
require_once($CFG->dirroot.'/mod/solib/lib.php');

$idSolibCourse = required_param('id', PARAM_INT);    // Course Module ID

if ($idSolibCourse) {
    if (! $cm = get_coursemodule_from_id('solib', $idSolibCourse)) { // the module of the course Cour 1 By JTF. Can be Solib or any other module (plugin)
        print_error('invalidcoursemodule');
    }
    if (! $course = $DB->get_record("course", array("id"=>$cm->course))) { // CT2
        print_error('coursemisconf');
    }
    if (! $solib = $DB->get_record("solib", array("id"=>$cm->instance))) { // Course 1 By JTF
        print_error('invalidcoursemodule');
    }
    require_login($course, true, $cm);
    // We are connected
    $PAGE->set_url('/mod/solib/view.php', array('id' => $cm->id));
    $PAGE->set_title($solib->name);
    $PAGE->set_heading($course->fullname);

    echo $OUTPUT->header();
    echo $OUTPUT->heading($solib->name);

    echo $OUTPUT->box_start();
        $link = new action_link(new moodle_url($solib->server_addr."/", array('user_id'=>$USER->id, 'firstname'=>$USER->firstname, 'lastname'=>$USER->lastname, "id_lesson" => $solib->solibcoreid ,'access_token' => $solib->access_token)), "Click this link to access the lesson");
        //$link->add_action(new popup_action('click', $link->url));
        echo $OUTPUT->render($link);
        echo '<br />';
        echo '<br />';
        echo 'Creation time: ' . date("D d F Y H:i",$solib->creation_time);

    echo $OUTPUT->box_end();

    echo $OUTPUT->footer();
}
else {
    if (! $course = $DB->get_record("course", array("id"=>$solib->course)) ) {
        print_error('coursemisconf');
    }
    if (! $cm = get_coursemodule_from_instance("solib", $solib->id, $course->id)) {
        print_error('invalidcoursemodule');
    }
}


