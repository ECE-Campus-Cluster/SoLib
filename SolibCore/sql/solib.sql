-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le : Sam 30 Mars 2013 à 19:08
-- Version du serveur: 5.5.29
-- Version de PHP: 5.3.10-1ubuntu3.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `solib`
--

-- --------------------------------------------------------

--
-- Structure de la table `drawings`
--

CREATE TABLE IF NOT EXISTS `drawings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idlesson` int(11) NOT NULL,
  `points` varchar(10000) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idlesson` (`idlesson`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `lessons`
--

CREATE TABLE IF NOT EXISTS `lessons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT 'Name of the lesson (from Moodle)',
  `author` varchar(50) NOT NULL COMMENT 'Creator of the lesson (from Moodle)',
  `creation_time` int(10) NOT NULL COMMENT 'Creation time of the lesson (from Moodle)',
  `access_token` varchar(20) NOT NULL COMMENT 'token from moodle to connect to the course.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Contenu de la table `lessons`
--

INSERT INTO `lessons` (`id`, `name`, `author`, `creation_time`, `access_token`) VALUES
(2, 'Solib login', 'JTF', 1364229855, '51507edf83de2'),
(3, 'Test rdv', 'JTF', 1364563609, '515596991a6d0'),
(4, 'Test rdv', 'JTF', 1364563726, '5155970e42e43'),
(5, 'Lesson rdv', 'JTF', 1364563743, '5155971fddcad'),
(6, 'Description test', 'JTF', 1364664464, '51572090e7a62'),
(7, 'Description test', 'JTF', 1364664702, '5157217e7b592');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `drawings`
--
ALTER TABLE `drawings`
  ADD CONSTRAINT `drawings_ibfk_1` FOREIGN KEY (`idlesson`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
