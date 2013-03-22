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
 * Library of functions and constants for module Solib
 *
 * @package    mod
 * @subpackage solib
 * @copyright  2013 ECE Paris
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// http://docs.moodle.org/dev/Text_formats_2.0

defined('MOODLE_INTERNAL') || die('Direct access to this script is forbidden.');

/**
 * Given an object containing all the necessary data,
 * (defined by the form in mod_form.php) this function
 * will create a new instance and return the id number
 * of the new instance.
 *
 * @global object
 * @param object $solib
 * @return bool|int
 */
function solib_add_instance($solib) {
    global $DB;
    
    $solib->timemodified = time();
    $solib->creation_time = $solib->timemodified;
    $solib->access_token = uniqid();

    $solib->id = $DB->insert_record("solib", $solib); // returns the id

    $result = solib_send_to_server($solib);

    // insert id_solib (from SolibCore) in moodle db

    return $solib->id;
}

/**
*
*
*/
function solib_send_to_server($solib) {
    // curl stuff for post request to solib server
    $url = $solib->server_addr.'/newlesson';
    $fields = array(
        'name'          => urlencode($solib->name),
        'author'        => urlencode('JTF'),
        'access_token'  => urlencode($solib->access_token),
        'creation_time' => urlencode($solib->creation_time)
    );

    // url-ify the data for the POST
    $fields_string = '';
    foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
    rtrim($fields_string, '&');

    // open connection
    $ch = curl_init();

    // set the url, number of POST vars, POST data
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, count($fields));
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);

    // execute post
    $result = curl_exec($ch);

    // close connection
    curl_close($ch);

    return $result;
}

/**
 * Given an object containing all the necessary data,
 * (defined by the form in mod_form.php) this function
 * will update an existing instance with new data.
 *
 * @global object
 * @param object $solib
 * @return bool
 */
function solib_update_instance($solib) {
    global $DB;

    $solib->timemodified = time();

    return $DB->update_record("solib", $solib);
}

/**
 * Given an ID of an instance of this module,
 * this function will permanently delete the instance
 * and any data that depends on it.
 *
 * @global object
 * @param int $id
 * @return bool
 */
function solib_delete_instance($id) {
    global $DB;

    if (! $solib = $DB->get_record("solib", array("id"=>$id))) {
        return false;
    }

    $result = true;

    if (! $DB->delete_records("solib", array("id"=>$solib->id))) {
        $result = false;
    }

    return $result;
}