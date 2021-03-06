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
 * Add solib form
 *
 * @package    mod
 * @subpackage solib
 * @copyright  2013 ECE Paris
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// http://docs.moodle.org/dev/Moodle_forms_library
// http://docs.moodle.org/dev/lib/formslib.php_Form_Definition

defined('MOODLE_INTERNAL') || die('Direct access to this script is forbidden.');

require_once ($CFG->dirroot.'/course/moodleform_mod.php');

class mod_solib_mod_form extends moodleform_mod {

    function definition() {

        $mform = $this->_form;
        // Title
        $mform->addElement('text', 'name', get_string('newcoursename', 'solib'), array('size'=>'64'));
        $mform->setType('name', PARAM_TEXT);
        $mform->addRule('name', null, 'required', null, 'client');
        // Server address
        $mform->addElement('text', 'server_addr', get_string('servaddress', 'solib'), array('size'=>'64', 'value' => 'http://solib.hopto.org:8080')); // TODO select for server addresses.
        $mform->setType('server_addr', PARAM_TEXT);
        $mform->addRule('server_addr', null, 'required', null, 'client');
        $mform->addHelpButton('server_addr', 'servaddress', 'solib');
        // Description
        $this->add_intro_editor(false, get_string('description', 'solib'));

        $this->standard_coursemodule_elements(); // Réglages courants

//-------------------------------------------------------------------------------
// buttons
        $this->add_action_buttons(true, false, null); // Boutons enregistrer / annuler

    }

}
