-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le : Ven 12 Avril 2013 à 16:42
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
  `idslide` int(11) NOT NULL,
  `radius` int(11) NOT NULL DEFAULT '5',
  `color` varchar(10) NOT NULL DEFAULT 'white',
  `points` varchar(10000) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idslide` (`idslide`),
  KEY `idlesson` (`idlesson`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1900 ;

-- --------------------------------------------------------

--
-- Structure de la table `lessons`
--

CREATE TABLE IF NOT EXISTS `lessons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT 'Name of the lesson (from Moodle)',
  `authorid` int(5) NOT NULL COMMENT 'Creator of the lesson (from Moodle)',
  `creation_time` int(10) NOT NULL COMMENT 'Creation time of the lesson (from Moodle)',
  `access_token` varchar(20) NOT NULL COMMENT 'token from moodle to connect to the course.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=51 ;

-- --------------------------------------------------------

--
-- Structure de la table `slides`
--

CREATE TABLE IF NOT EXISTS `slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idlesson` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idlesson` (`idlesson`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=190 ;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `idmoodle` int(11) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  PRIMARY KEY (`idmoodle`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `drawings`
--
ALTER TABLE `drawings`
  ADD CONSTRAINT `drawings_ibfk_2` FOREIGN KEY (`idlesson`) REFERENCES `lessons` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `drawings_ibfk_1` FOREIGN KEY (`idslide`) REFERENCES `slides` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `slides`
--
ALTER TABLE `slides`
  ADD CONSTRAINT `slides_ibfk_1` FOREIGN KEY (`idlesson`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
