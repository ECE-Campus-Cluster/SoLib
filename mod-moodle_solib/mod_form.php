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

defined('MOODLE_INTERNAL') || die('Direct access to this script is forbidden.');

require_once ($CFG->dirroot.'/course/moodleform_mod.php');

class mod_solib_mod_form extends moodleform_mod {

    function definition() {

        $mform = $this->_form;
        $mform->addElement('text', 'name', get_string('solibnewcoursename', 'solib'), array('size'=>'64'));
        $mform->setType('name', PARAM_TEXT);
        $mform->addRule('name', null, 'required', null, 'client');
        
        $mform->addElement('text', 'server_addr', get_string('solibservaddress', 'solib'), array('size'=>'64'));
        $mform->setType('server_addr', PARAM_TEXT);
        $mform->addRule('server_addr', null, 'required', null, 'client');
        
        $this->standard_coursemodule_elements(); // Réglages courants

//-------------------------------------------------------------------------------
// buttons
        $this->add_action_buttons(true, false, null); // Boutons enregistrer / annuler

    }

}
