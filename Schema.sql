-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 26 فبراير 2025 الساعة 17:33
-- إصدار الخادم: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sedik`
--

-- --------------------------------------------------------

--
-- بنية الجدول `ads`
--

CREATE TABLE `ads` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `ads`
--

INSERT INTO `ads` (`id`, `user_id`, `title`, `description`, `image`, `created_at`) VALUES
(3, 2, '\"كل تصميم يحمل بصمة من شخصيتي.\" ????????', 'الإبداع هو أن ترى الجمال في التفاصيل الصغيرة', '1740334307704-3244d2cd-d2c1-46d6-8c75-715ff6e84266-500x500-dZUY64nejMg60sebZSb4jPS41OLrriEo5NgTjevM.webp', '2025-02-23 18:11:47'),
(4, 1, 'ألواني تعكس مشاعري', 'الفن ليس مجرد عمل، بل أسلوب حياة', '1740334387390-d577491e-7b66-4102-bfcd-9092b3fc9d0c-500x500-bRSwPwBCjOV2IYGzwwrTG6IOZC9QTiEg3VAsYasj.webp', '2025-02-23 18:13:07'),
(5, 1, 'قصة جديدة', 'عندما أصمم، أنسى الوقت وأعيش في عالمي الخاص', '1740334439522-5a3a62ae-5644-47c6-b924-425265ab39e9-500x500-6J11DYNZUQWsxrkm1LEgouHJMZsVa77ZjdxEU2I3.webp', '2025-02-23 18:13:59'),
(6, 4, 'التصميم لغة', 'التصميم لغة يفهمها الجميع دون كلمات.', '1740334509535-88ac9794-b1a6-4ff5-b3c2-ecef33f0df7c-500x500-ZqhyfxAHkkM6kT2C0kyBESQSA0BRiG4uxcTsdUQn.webp', '2025-02-23 18:15:09'),
(7, 4, 'لخيال لا حدود له', 'وكذلك إبداعي', '1740334759548-fc397f3d3a1c9d2aa633d4237c51d8f9.jpg', '2025-02-23 18:19:19'),
(8, 1, 'جميل', 'جديد', '1740414903500-DALLÂ·E 2025-02-24 16.36.19 - A modern, stylized chameleon logo with a gradient color transition, symbolizing creativity and adaptability. The chameleon should have a sleek, minima.webp', '2025-02-24 16:35:03');

-- --------------------------------------------------------

--
-- بنية الجدول `blocked_users`
--

CREATE TABLE `blocked_users` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `blocked_user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `blocked_users`
--

INSERT INTO `blocked_users` (`id`, `user_id`, `blocked_user_id`, `created_at`) VALUES
(14, 5, 4, '2025-02-24 17:03:16');

-- --------------------------------------------------------

--
-- بنية الجدول `block_list`
--

CREATE TABLE `block_list` (
  `blocker_id` int(11) NOT NULL,
  `blocked_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `commentsforum`
--

CREATE TABLE `commentsforum` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `commentsforum`
--

INSERT INTO `commentsforum` (`id`, `post_id`, `user_id`, `content`, `created_at`) VALUES
(5, 5, 4, 'جميل جدآ', '2025-02-23 18:05:19'),
(6, 6, 1, 'هلا', '2025-02-24 16:00:25'),
(7, 5, 1, 'تصميم جيد', '2025-02-25 00:10:55'),
(8, 3, 1, 'جيد', '2025-02-25 16:29:22'),
(9, 3, 1, 'hello', '2025-02-25 17:04:32'),
(10, 3, 1, 'مرحبا', '2025-02-25 17:13:21');

-- --------------------------------------------------------

--
-- بنية الجدول `comment_likes`
--

CREATE TABLE `comment_likes` (
  `id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `created_at`, `is_read`) VALUES
(1, 'ali', 'ali@mail.com', 'help', 'register', '2025-02-24 19:19:29', 1),
(2, 'ali', 'ali@mail.com', 'help', 'register', '2025-02-24 19:21:13', 1),
(3, 'كمال عمر', 'kmal@mail.com', 'لقد تم تقييد حسابي', 'لقد تم حظري لا اعلم لماذا الرجاء الرد في اقرب وقت ', '2025-02-25 00:04:59', 0);

-- --------------------------------------------------------

--
-- بنية الجدول `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `design_gallery`
--

CREATE TABLE `design_gallery` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `title` varchar(100) NOT NULL,
  `subtitle` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `design_gallery`
--

INSERT INTO `design_gallery` (`id`, `user_id`, `image`, `title`, `subtitle`, `created_at`) VALUES
(1, 2, '1740264656034-b65c153139ccc9ea066753c97727cc3a.jpg', 'سولو ليفينغ', 'افضل انمي', '2025-02-22 22:50:56'),
(3, 2, '1740264791322-images.jpg', 'ؤسؤ', '', '2025-02-22 22:53:11'),
(11, 1, '1740269822451-images2.jpg', 'تصميم', 'جميل', '2025-02-23 00:17:02'),
(12, 1, '1740269837847-images1.jpg', 'اول', 'تصميم', '2025-02-23 00:17:17'),
(13, 2, '1740277770026-ÙÙÙØ°Ø¬-ØµÙØ±-Ø¨ÙØ³Øª-Ø§ÙØ³ØªØ§-84.jpg', 'هلا', '', '2025-02-23 02:29:30'),
(14, 2, '1740521406674-img-65a23450220f70-82172462.jpg', 'هاي', '', '2025-02-25 22:10:06'),
(16, 1, '1740568350203-Flux_Dev_A_heroic_Sudanese_anime_character_with_dark_brown_ski_1.jpeg', 'انمي', '', '2025-02-26 11:12:30'),
(17, 1, '1740568402882-Character Visualization.png', 'سوداني', '', '2025-02-26 11:13:22'),
(18, 1, '1740569757909-Character Visualization.png', 'اتت', 'ت', '2025-02-26 11:35:57');

-- --------------------------------------------------------

--
-- بنية الجدول `forum_exceptions`
--

CREATE TABLE `forum_exceptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `daily_post_limit` int(11) DEFAULT NULL,
  `daily_comment_limit` int(11) DEFAULT NULL,
  `daily_ad_limit` int(11) DEFAULT NULL,
  `daily_like_limit` int(11) DEFAULT NULL,
  `daily_job_limit` int(11) DEFAULT NULL,
  `daily_project_limit` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `forum_exceptions`
--

INSERT INTO `forum_exceptions` (`id`, `user_id`, `daily_post_limit`, `daily_comment_limit`, `daily_ad_limit`, `daily_like_limit`, `daily_job_limit`, `daily_project_limit`, `created_at`) VALUES
(1, 3, 3, NULL, 2, NULL, NULL, NULL, '2025-02-25 11:45:38'),
(2, 4, 1, NULL, NULL, NULL, NULL, NULL, '2025-02-25 11:46:39');

-- --------------------------------------------------------

--
-- بنية الجدول `forum_settings`
--

CREATE TABLE `forum_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(50) NOT NULL,
  `setting_value` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `forum_settings`
--

INSERT INTO `forum_settings` (`id`, `setting_key`, `setting_value`, `description`, `created_at`) VALUES
(1, 'daily_post_limit', '5', 'حد نشر المنشورات في اليوم لكل مستخدم (باستثناء المشرفين)', '2025-02-25 10:59:55'),
(2, 'daily_comment_limit', '20', 'عدد التعليقات المسموح بها في اليوم لكل مستخدم (باستثناء المشرفين)', '2025-02-25 10:59:55'),
(3, 'daily_ad_limit', '1', 'عدد الإعلانات المسموح بها في اليوم لكل مستخدم (باستثناء المشرفين)', '2025-02-25 10:59:55'),
(4, 'max_images_per_post', '4', 'الحد الأقصى للصور في المنشور الواحد', '2025-02-25 10:59:55'),
(5, 'enable_likes', '1', 'تفعيل (1) أو تعطيل (0) الإعجابات في المنتدى', '2025-02-25 10:59:55'),
(6, 'ad_expiry_days', '1', 'مدة صلاحية الإعلانات بالأيام', '2025-02-25 10:59:55'),
(7, 'daily_job_limit', '1', NULL, '2025-02-25 23:28:26'),
(11, 'daily_project_limit', '1', NULL, '2025-02-25 23:30:00');

-- --------------------------------------------------------

--
-- بنية الجدول `friendships`
--

CREATE TABLE `friendships` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `status` enum('pending','accepted','rejected','blocked') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `friendships`
--

INSERT INTO `friendships` (`id`, `user_id`, `friend_id`, `status`, `created_at`, `updated_at`) VALUES
(31, 5, 1, 'accepted', '2025-02-23 13:30:23', '2025-02-23 13:30:23'),
(32, 1, 5, 'accepted', '2025-02-23 13:30:23', '2025-02-23 13:30:23'),
(33, 2, 5, 'accepted', '2025-02-24 17:03:41', '2025-02-24 17:03:41'),
(34, 5, 2, 'accepted', '2025-02-24 17:03:41', '2025-02-24 17:03:41'),
(35, 5, 3, 'accepted', '2025-02-26 13:24:24', '2025-02-26 13:24:24'),
(36, 3, 5, 'accepted', '2025-02-26 13:24:24', '2025-02-26 13:24:24');

-- --------------------------------------------------------

--
-- بنية الجدول `friend_requests`
--

CREATE TABLE `friend_requests` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `friend_requests`
--

INSERT INTO `friend_requests` (`id`, `sender_id`, `receiver_id`, `status`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'accepted', 1, '2025-02-22 16:54:18', '2025-02-22 16:54:34'),
(4, 4, 1, 'accepted', 1, '2025-02-23 00:49:41', '2025-02-23 00:59:42'),
(5, 4, 2, 'accepted', 1, '2025-02-23 00:49:45', '2025-02-23 01:05:04'),
(6, 3, 1, 'accepted', 1, '2025-02-23 01:00:28', '2025-02-23 01:07:44'),
(7, 3, 2, 'accepted', 1, '2025-02-23 01:00:39', '2025-02-23 01:07:11'),
(8, 3, 4, 'accepted', 1, '2025-02-23 01:02:11', '2025-02-23 01:03:04'),
(9, 2, 3, 'accepted', 1, '2025-02-23 01:14:42', '2025-02-23 01:15:09'),
(11, 1, 4, 'accepted', 1, '2025-02-23 01:16:42', '2025-02-23 01:17:03'),
(12, 4, 3, 'accepted', 1, '2025-02-23 01:17:06', '2025-02-23 01:35:27'),
(29, 2, 4, 'accepted', 1, '2025-02-23 01:37:13', '2025-02-23 02:18:34'),
(36, 1, 2, 'accepted', 1, '2025-02-23 01:56:47', '2025-02-23 01:56:59'),
(37, 2, 2, 'accepted', 1, '2025-02-23 01:58:04', '2025-02-23 01:58:26'),
(64, 1, 3, 'accepted', 1, '2025-02-23 02:33:53', '2025-02-23 11:33:51'),
(100, 5, 2, 'accepted', 1, '2025-02-23 12:42:01', '2025-02-23 12:42:40'),
(101, 5, 1, 'accepted', 1, '2025-02-23 12:42:03', '2025-02-23 13:30:23'),
(102, 5, 3, 'accepted', 1, '2025-02-23 12:42:07', '2025-02-26 13:24:24'),
(103, 5, 4, 'accepted', 1, '2025-02-23 12:42:08', '2025-02-23 12:46:38'),
(104, 2, 6, 'pending', 0, '2025-02-23 17:36:50', '2025-02-23 17:36:50'),
(105, 2, 5, 'accepted', 1, '2025-02-23 17:36:53', '2025-02-24 17:03:41'),
(106, 1, 6, 'pending', 0, '2025-02-24 16:33:27', '2025-02-24 16:33:27'),
(107, 4, 6, 'pending', 0, '2025-02-24 21:42:09', '2025-02-24 21:42:09'),
(111, 5, 6, 'pending', 0, '2025-02-25 21:39:39', '2025-02-25 21:39:39');

-- --------------------------------------------------------

--
-- بنية الجدول `hidden_posts`
--

CREATE TABLE `hidden_posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `hidden_posts`
--

INSERT INTO `hidden_posts` (`id`, `user_id`, `post_id`) VALUES
(1, 1, 4);

-- --------------------------------------------------------

--
-- بنية الجدول `jobs`
--

CREATE TABLE `jobs` (
  `job_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `job_type` varchar(50) NOT NULL,
  `education` varchar(255) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `salary_min` decimal(10,2) DEFAULT NULL,
  `salary_max` decimal(10,2) DEFAULT NULL,
  `salary_after_interview` decimal(10,2) DEFAULT 0.00,
  `location` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `expires_at` date DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `jobs`
--

INSERT INTO `jobs` (`job_id`, `title`, `description`, `job_type`, `education`, `currency`, `salary_min`, `salary_max`, `salary_after_interview`, `location`, `experience`, `duration`, `logo`, `expires_at`, `user_id`, `owner_id`, `created_at`) VALUES
(7, 'مهندس برمجيات', 'تصميم وتطوير تطبيقات الويب', 'full-time', 'جامعة', 'SAR', 8000.00, 12000.00, 0.00, 'الرياض', '3', '3', NULL, '2025-02-26', 2, NULL, '2025-02-23 17:43:28'),
(10, 'مدير مشروع', ' إدارة وتنفيذ المشاريع البرمجية', 'full-time', 'جامعة', 'AED', 9000.00, 15000.00, 0.00, 'دبي', '5', '8', NULL, '2025-03-03', 2, NULL, '2025-02-23 17:45:59'),
(11, 'مصمم جرافيك', 'تصميم شعارات وهويات بصرية', 'full-time', 'جامعة', 'EGP', 5000.00, 9000.00, 0.00, 'مصر', '1', '20', NULL, '2025-03-15', 2, NULL, '2025-02-23 17:47:16'),
(12, 'كتابة مقالات وتسويق بالمحتوى', 'تصميم شعارات وهويات بصرية', 'part-time', 'جامعة', 'USD', 10000.00, 20000.00, 0.00, 'عمان', '1', '6', NULL, '2025-03-01', 2, NULL, '2025-02-23 17:48:17'),
(13, 'فني دعم فني', 'مساعدة العملاء في حل المشكلات التقنية', 'full-time', 'جامعة', 'OMR', 10000.00, 20000.00, 0.00, 'مسقط', '4', '4', NULL, '2025-02-27', 2, NULL, '2025-02-23 17:49:50'),
(24, 'aaaaaaaaa', 'aaaaaaaaaa', 'full-time', 'إعدادي', 'aaaa', 55555555.00, 99999999.99, 0.00, 'aaaaaaaa', '2', '2', NULL, '2025-02-27', 2, NULL, '2025-02-25 23:26:22');

-- --------------------------------------------------------

--
-- بنية الجدول `job_applications`
--

CREATE TABLE `job_applications` (
  `application_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `cover_letter` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `job_applications`
--

INSERT INTO `job_applications` (`application_id`, `job_id`, `applicant_id`, `cover_letter`, `created_at`) VALUES
(15, 24, 2, 'aaaaaaaa', '2025-02-25 23:26:33');

-- --------------------------------------------------------

--
-- بنية الجدول `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `friend_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `likes`
--

INSERT INTO `likes` (`id`, `post_id`, `friend_id`, `user_id`, `created_at`) VALUES
(2, NULL, NULL, 2, '2025-02-22 17:03:26'),
(3, NULL, NULL, 1, '2025-02-22 17:06:18'),
(5, NULL, NULL, 1, '2025-02-22 17:09:58'),
(102, NULL, 1, 2, '2025-02-23 00:25:28'),
(105, NULL, 1, 4, '2025-02-23 01:17:15'),
(109, NULL, 1, 3, '2025-02-23 02:04:01'),
(111, NULL, 2, 1, '2025-02-23 02:49:01'),
(115, NULL, 2, 4, '2025-02-23 12:25:24'),
(116, 5, NULL, 4, '2025-02-23 18:05:11'),
(117, NULL, 4, 1, '2025-02-24 16:33:06'),
(118, 5, NULL, 1, '2025-02-25 00:10:58'),
(121, 3, NULL, 1, '2025-02-25 17:13:13'),
(137, 6, NULL, 1, '2025-02-26 12:06:34'),
(139, NULL, 5, 2, '2025-02-26 13:12:59'),
(140, NULL, 5, 3, '2025-02-26 13:24:30'),
(143, NULL, 1, 5, '2025-02-26 15:21:43'),
(146, NULL, 5, 1, '2025-02-26 15:44:49');

-- --------------------------------------------------------

--
-- بنية الجدول `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `image_path`, `created_at`, `is_read`) VALUES
(1, 1, 2, 'hi', NULL, '2025-02-22 16:55:07', 1),
(2, 2, 1, 'hi', NULL, '2025-02-22 16:55:53', 1),
(3, 2, 1, 'مرحبا', NULL, '2025-02-22 23:16:31', 1),
(4, 1, 2, 'ثعلوب', NULL, '2025-02-22 23:16:50', 1),
(5, 2, 1, 'صديق', NULL, '2025-02-22 23:16:58', 1),
(6, 2, 1, 'ىة', NULL, '2025-02-23 02:33:02', 1),
(7, 1, 2, 'ىىى', NULL, '2025-02-23 02:33:39', 1),
(8, 1, 2, 'ةى', NULL, '2025-02-23 02:43:29', 1),
(9, 1, 2, 'ةى', NULL, '2025-02-23 12:03:01', 1),
(10, 1, 2, 'هلا', NULL, '2025-02-23 12:03:05', 1),
(11, 4, 5, 'هلا', NULL, '2025-02-23 12:46:51', 1),
(23, 5, 4, 'مرحبا\r\n', NULL, '2025-02-24 17:04:22', 1),
(29, 2, 1, 'هلا', NULL, '2025-02-25 22:45:40', 1),
(30, 2, 5, 'hi', NULL, '2025-02-26 00:05:56', 1),
(31, 5, 2, 'هاي', NULL, '2025-02-26 00:06:31', 1),
(32, 2, 5, 'هاي', NULL, '2025-02-26 00:12:19', 1),
(33, 2, 5, 'تنتنت', NULL, '2025-02-26 00:12:59', 1),
(34, 1, 2, 'هلا', NULL, '2025-02-26 00:14:16', 1),
(35, 2, 1, 'هلا', NULL, '2025-02-26 00:24:40', 1),
(36, 1, 2, 'hn', NULL, '2025-02-26 00:43:01', 1),
(37, 2, 1, 'nxz', NULL, '2025-02-26 00:47:04', 1),
(38, 2, 5, 'jkbkj', NULL, '2025-02-26 00:48:03', 1),
(39, 2, 5, 'bkb', NULL, '2025-02-26 00:48:09', 1),
(40, 2, 5, 'y8787yh', NULL, '2025-02-26 00:48:18', 1),
(41, 2, 5, 'ىوىوىوى', NULL, '2025-02-26 00:49:17', 1),
(42, 5, 2, 'ىتىتى', NULL, '2025-02-26 00:51:14', 1),
(43, 5, 1, 'هلا', NULL, '2025-02-26 00:51:55', 1),
(44, 1, 5, 'هلا', NULL, '2025-02-26 00:52:29', 1),
(45, 1, 5, ' m, ', NULL, '2025-02-26 00:57:43', 1),
(46, 1, 5, 'mklm', NULL, '2025-02-26 00:57:50', 1),
(47, 1, 5, 'nm', NULL, '2025-02-26 00:59:23', 1),
(48, 5, 1, 'ihjks', NULL, '2025-02-26 01:01:44', 1),
(49, 1, 5, 'hi', NULL, '2025-02-26 15:45:04', 0);

-- --------------------------------------------------------

--
-- بنية الجدول `messages_project`
--

CREATE TABLE `messages_project` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `conversation_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `messages_project`
--

INSERT INTO `messages_project` (`id`, `project_id`, `sender_id`, `receiver_id`, `message`, `status`, `conversation_id`, `created_at`) VALUES
(1, 3, 2, 1, 'تم قبول طلبك للانضمام إلى المشروع. يمكنك البدء في المحادثة الآن.', 'accepted', 6, '2025-02-22 18:53:48'),
(2, 3, 1, 1, 'هلا', 'accepted', 6, '2025-02-22 18:54:24'),
(3, 1, 1, 1, 'تم قبول طلبك للانضمام إلى المشروع. يمكنك البدء في المحادثة الآن.', 'accepted', 1, '2025-02-22 18:55:06'),
(4, 2, 1, 2, 'تم قبول طلبك للانضمام إلى المشروع. يمكنك البدء في المحادثة الآن.', 'accepted', 4, '2025-02-22 18:55:13'),
(5, 2, 1, 1, 'تم قبول طلبك للانضمام إلى المشروع. يمكنك البدء في المحادثة الآن.', 'accepted', 5, '2025-02-22 19:22:56'),
(6, 4, 1, 2, 'تم قبول طلبك للانضمام إلى المشروع. يمكنك البدء في المحادثة الآن.', 'accepted', 8, '2025-02-22 19:27:52'),
(7, 5, 1, 2, 'تم قبول طلبك للانضمام إلى المشروع. يمكنك البدء في المحادثة الآن.', 'accepted', 9, '2025-02-22 19:34:13'),
(8, 5, 1, 1, 'تم قبول طلبك للانضمام إلى المشروع. يمكنك البدء في المحادثة الآن.', 'accepted', 10, '2025-02-22 19:35:09'),
(9, 4, 2, 2, 'لتابتب', 'accepted', 8, '2025-02-22 23:12:57'),
(10, 4, 1, 3, 'تم قبول طلبك للانضمام إلى المشروع. يمكنك البدء في المحادثة الآن.', 'accepted', 11, '2025-02-23 02:59:51'),
(11, 5, 1, 1, 'هلا', 'accepted', 10, '2025-02-23 03:00:00'),
(12, 4, 3, 3, 'نعم', 'accepted', 11, '2025-02-23 03:00:35'),
(13, 4, 3, 3, 'تنن', 'accepted', 11, '2025-02-23 03:00:41'),
(14, 4, 1, 3, 'نعم', 'accepted', 11, '2025-02-23 03:01:16'),
(15, 5, 1, 2, 'هلا', 'accepted', 9, '2025-02-25 00:10:02'),
(16, 4, 2, 2, 'هلا', 'accepted', 8, '2025-02-25 14:35:23'),
(17, 5, 1, 2, 'dd', 'accepted', 9, '2025-02-25 14:47:58'),
(20, 4, 1, 3, 'هلا', 'accepted', 11, '2025-02-25 15:44:49'),
(21, 5, 2, 2, 'aaaaa', 'accepted', 9, '2025-02-25 23:27:20');

-- --------------------------------------------------------

--
-- بنية الجدول `message_threads`
--

CREATE TABLE `message_threads` (
  `id` int(11) NOT NULL,
  `user1_id` int(11) NOT NULL,
  `user2_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `sender_id` int(11) NOT NULL,
  `type` enum('friend_request','accepted','rejected','admin','canceled','canceled_received','blocked','blocked_by','unblocked','unblocked_by','removed','removed_by','liked') DEFAULT 'friend_request',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `message` text DEFAULT NULL,
  `is_admin_notification` tinyint(1) DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `viewed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `sender_id`, `type`, `created_at`, `message`, `is_admin_notification`, `image_url`, `viewed`) VALUES
(3, 2, 1, '', '2025-02-23 12:06:07', 'قمت بحظر sedik ', 0, NULL, 1),
(4, 2, 1, '', '2025-02-23 12:06:10', 'قمت بإلغاء حظر sedik ', 0, NULL, 1),
(5, 2, 5, 'friend_request', '2025-02-23 12:42:01', 'kmal أرسل لك طلب صداقة. يمكنك قبوله أو رفضه من صفحة الأصدقاء', 0, NULL, 1),
(7, 3, 5, 'friend_request', '2025-02-23 12:42:07', 'kmal أرسل لك طلب صداقة. يمكنك قبوله أو رفضه من صفحة الأصدقاء', 0, NULL, 1),
(8, 4, 5, 'friend_request', '2025-02-23 12:42:08', 'kmal أرسل لك طلب صداقة. يمكنك قبوله أو رفضه من صفحة الأصدقاء', 0, NULL, 1),
(10, 2, 5, 'accepted', '2025-02-23 12:42:40', 'أصبحت صديقًا مع kmal. استمتع بالتواصل!', 0, NULL, 1),
(11, 2, 5, 'blocked', '2025-02-23 12:43:12', 'قمت بحظر kmal. لن يتمكن من التفاعل معك حتى تلغي الحظر', 0, NULL, 1),
(12, 5, 2, 'blocked_by', '2025-02-23 12:43:12', 'ali قام بحظرك. لن تتمكن من التفاعل معه حتى يلغي الحظر', 0, NULL, 1),
(13, 2, 5, 'unblocked', '2025-02-23 12:43:20', 'قمت بإلغاء حظر kmal. يمكنك الآن إرسال طلب صداقة إذا أردت', 0, NULL, 1),
(14, 5, 2, 'unblocked_by', '2025-02-23 12:43:20', 'ali قام بإلغاء حظرك. يمكنك الآن التفاعل معه', 0, NULL, 1),
(15, 5, 4, 'accepted', '2025-02-23 12:46:38', 'soha قبل طلب صداقتك. يمكنك الآن التواصل معه', 0, NULL, 1),
(16, 4, 5, 'accepted', '2025-02-23 12:46:38', 'أصبحت صديقًا مع kmal. استمتع بالتواصل!', 0, NULL, 1),
(19, 6, 2, 'friend_request', '2025-02-23 17:36:50', 'ali أرسل لك طلب صداقة. يمكنك قبوله أو رفضه من صفحة الأصدقاء', 0, NULL, 0),
(22, 3, 2, 'admin', '2025-02-23 17:43:28', 'وظيفة جديدة: مهندس برمجيات أُضيفت بواسطة ali.', 0, NULL, 1),
(23, 4, 2, 'admin', '2025-02-23 17:43:28', 'وظيفة جديدة: مهندس برمجيات أُضيفت بواسطة ali.', 0, NULL, 1),
(25, 6, 2, 'admin', '2025-02-23 17:43:28', 'وظيفة جديدة: مهندس برمجيات أُضيفت بواسطة ali.', 0, NULL, 0),
(29, 3, 2, 'admin', '2025-02-23 17:43:53', 'وظيفة جديدة: مهندس برمجيات أُضيفت بواسطة ali.', 0, NULL, 1),
(30, 4, 2, 'admin', '2025-02-23 17:43:53', 'وظيفة جديدة: مهندس برمجيات أُضيفت بواسطة ali.', 0, NULL, 1),
(32, 6, 2, 'admin', '2025-02-23 17:43:53', 'وظيفة جديدة: مهندس برمجيات أُضيفت بواسطة ali.', 0, NULL, 0),
(36, 3, 2, 'admin', '2025-02-23 17:44:04', 'وظيفة جديدة: مهندس برمجيات أُضيفت بواسطة ali.', 0, NULL, 1),
(37, 4, 2, 'admin', '2025-02-23 17:44:04', 'وظيفة جديدة: مهندس برمجيات أُضيفت بواسطة ali.', 0, NULL, 1),
(39, 6, 2, 'admin', '2025-02-23 17:44:04', 'وظيفة جديدة: مهندس برمجيات أُضيفت بواسطة ali.', 0, NULL, 0),
(43, 3, 2, 'admin', '2025-02-23 17:45:59', 'وظيفة جديدة: مدير مشروع أُضيفت بواسطة ali.', 0, NULL, 1),
(44, 4, 2, 'admin', '2025-02-23 17:45:59', 'وظيفة جديدة: مدير مشروع أُضيفت بواسطة ali.', 0, NULL, 1),
(46, 6, 2, 'admin', '2025-02-23 17:45:59', 'وظيفة جديدة: مدير مشروع أُضيفت بواسطة ali.', 0, NULL, 0),
(50, 3, 2, 'admin', '2025-02-23 17:47:16', 'وظيفة جديدة: مصمم جرافيك أُضيفت بواسطة ali.', 0, NULL, 1),
(51, 4, 2, 'admin', '2025-02-23 17:47:16', 'وظيفة جديدة: مصمم جرافيك أُضيفت بواسطة ali.', 0, NULL, 1),
(53, 6, 2, 'admin', '2025-02-23 17:47:16', 'وظيفة جديدة: مصمم جرافيك أُضيفت بواسطة ali.', 0, NULL, 0),
(57, 3, 2, 'admin', '2025-02-23 17:48:17', 'وظيفة جديدة: كتابة مقالات وتسويق بالمحتوى أُضيفت بواسطة ali.', 0, NULL, 1),
(58, 4, 2, 'admin', '2025-02-23 17:48:17', 'وظيفة جديدة: كتابة مقالات وتسويق بالمحتوى أُضيفت بواسطة ali.', 0, NULL, 1),
(60, 6, 2, 'admin', '2025-02-23 17:48:17', 'وظيفة جديدة: كتابة مقالات وتسويق بالمحتوى أُضيفت بواسطة ali.', 0, NULL, 0),
(64, 3, 2, 'admin', '2025-02-23 17:49:50', 'وظيفة جديدة: فني دعم فني أُضيفت بواسطة ali.', 0, NULL, 1),
(65, 4, 2, 'admin', '2025-02-23 17:49:50', 'وظيفة جديدة: فني دعم فني أُضيفت بواسطة ali.', 0, NULL, 1),
(67, 6, 2, 'admin', '2025-02-23 17:49:50', 'وظيفة جديدة: فني دعم فني أُضيفت بواسطة ali.', 0, NULL, 0),
(68, 2, 1, '', '2025-02-24 16:19:10', 'sedik  تقدم بطلب للوظيفة: فني دعم فني', 0, NULL, 1),
(69, 6, 1, 'friend_request', '2025-02-24 16:33:27', 'sedik  أرسل لك طلب صداقة. يمكنك قبوله أو رفضه من صفحة الأصدقاء', 0, NULL, 0),
(71, 4, 5, 'blocked_by', '2025-02-24 17:03:16', 'kmal قام بحظرك. لن تتمكن من التفاعل معه حتى يلغي الحظر', 0, NULL, 1),
(72, 2, 5, 'accepted', '2025-02-24 17:03:41', 'kmal قبل طلب صداقتك. يمكنك الآن التواصل معه', 0, NULL, 1),
(74, 2, 1, 'admin', '2025-02-24 21:41:11', 'الادمن', 0, '/uploads/notifications/1740433271305-fc397f3d3a1c9d2aa633d4237c51d8f9.jpg', 1),
(75, 3, 1, 'admin', '2025-02-24 21:41:11', 'الادمن', 0, '/uploads/notifications/1740433271305-fc397f3d3a1c9d2aa633d4237c51d8f9.jpg', 1),
(76, 4, 1, 'admin', '2025-02-24 21:41:11', 'الادمن', 0, '/uploads/notifications/1740433271305-fc397f3d3a1c9d2aa633d4237c51d8f9.jpg', 1),
(77, 5, 1, 'admin', '2025-02-24 21:41:11', 'الادمن', 0, '/uploads/notifications/1740433271305-fc397f3d3a1c9d2aa633d4237c51d8f9.jpg', 1),
(78, 6, 1, 'admin', '2025-02-24 21:41:11', 'الادمن', 0, '/uploads/notifications/1740433271305-fc397f3d3a1c9d2aa633d4237c51d8f9.jpg', 0),
(81, 6, 4, 'friend_request', '2025-02-24 21:42:09', 'soha أرسل لك طلب صداقة. يمكنك قبوله أو رفضه من صفحة الأصدقاء', 0, NULL, 0),
(84, 3, 5, 'admin', '2025-02-24 22:26:33', 'هلا', 0, NULL, 1),
(85, 4, 5, 'admin', '2025-02-24 22:26:33', 'هلا', 0, NULL, 1),
(86, 6, 5, 'admin', '2025-02-24 22:26:33', 'هلا', 0, NULL, 0),
(90, 1, 2, 'admin', '2025-02-25 13:02:47', 'وظيفة جديدة: ali أُضيفت بواسطة ali.', 0, NULL, 1),
(91, 3, 2, 'admin', '2025-02-25 13:02:47', 'وظيفة جديدة: ali أُضيفت بواسطة ali.', 0, NULL, 1),
(92, 4, 2, 'admin', '2025-02-25 13:02:47', 'وظيفة جديدة: ali أُضيفت بواسطة ali.', 0, NULL, 1),
(94, 6, 2, 'admin', '2025-02-25 13:02:47', 'وظيفة جديدة: ali أُضيفت بواسطة ali.', 0, NULL, 0),
(97, 1, 2, 'admin', '2025-02-25 13:03:11', 'وظيفة جديدة: ali أُضيفت بواسطة ali.', 0, NULL, 1),
(98, 3, 2, 'admin', '2025-02-25 13:03:11', 'وظيفة جديدة: ali أُضيفت بواسطة ali.', 0, NULL, 1),
(99, 4, 2, 'admin', '2025-02-25 13:03:11', 'وظيفة جديدة: ali أُضيفت بواسطة ali.', 0, NULL, 1),
(101, 6, 2, 'admin', '2025-02-25 13:03:11', 'وظيفة جديدة: ali أُضيفت بواسطة ali.', 0, NULL, 0),
(105, 3, 2, 'admin', '2025-02-25 13:03:22', 'وظيفة جديدة: ali أُضيفت بواسطة ali.', 0, NULL, 1),
(106, 4, 2, 'admin', '2025-02-25 13:03:22', 'وظيفة جديدة: ali أُضيفت بواسطة ali.', 0, NULL, 1),
(108, 6, 2, 'admin', '2025-02-25 13:03:22', 'وظيفة جديدة: ali أُضيفت بواسطة ali.', 0, NULL, 0),
(113, 3, 4, 'admin', '2025-02-25 13:46:07', 'وظيفة جديدة: ءتساء أُضيفت بواسطة soha.', 0, NULL, 1),
(115, 6, 4, 'admin', '2025-02-25 13:46:07', 'وظيفة جديدة: ءتساء أُضيفت بواسطة soha.', 0, NULL, 0),
(120, 3, 4, 'admin', '2025-02-25 13:46:45', 'وظيفة جديدة: ءتساء أُضيفت بواسطة soha.', 0, NULL, 1),
(122, 6, 4, 'admin', '2025-02-25 13:46:45', 'وظيفة جديدة: ءتساء أُضيفت بواسطة soha.', 0, NULL, 0),
(125, 4, 2, '', '2025-02-25 14:37:20', 'ali تقدم بطلب للوظيفة: ءتساء', 0, NULL, 1),
(127, 4, 1, '', '2025-02-25 15:53:42', 'sedik  تقدم بطلب للوظيفة: ءتساء', 0, NULL, 1),
(130, 3, 5, 'admin', '2025-02-25 21:32:37', 'وظيفة جديدة: طبيب أُضيفت بواسطة kmal.', 0, NULL, 1),
(131, 4, 5, 'admin', '2025-02-25 21:32:37', 'وظيفة جديدة: طبيب أُضيفت بواسطة kmal.', 0, NULL, 1),
(132, 6, 5, 'admin', '2025-02-25 21:32:37', 'وظيفة جديدة: طبيب أُضيفت بواسطة kmal.', 0, NULL, 0),
(137, 3, 5, 'admin', '2025-02-25 21:33:24', 'وظيفة جديدة: طبيب أُضيفت بواسطة kmal.', 0, NULL, 1),
(138, 4, 5, 'admin', '2025-02-25 21:33:24', 'وظيفة جديدة: طبيب أُضيفت بواسطة kmal.', 0, NULL, 1),
(139, 6, 5, 'admin', '2025-02-25 21:33:24', 'وظيفة جديدة: طبيب أُضيفت بواسطة kmal.', 0, NULL, 0),
(144, 3, 5, 'admin', '2025-02-25 21:33:32', 'وظيفة جديدة: طبيب أُضيفت بواسطة kmal.', 0, NULL, 1),
(145, 4, 5, 'admin', '2025-02-25 21:33:32', 'وظيفة جديدة: طبيب أُضيفت بواسطة kmal.', 0, NULL, 1),
(146, 6, 5, 'admin', '2025-02-25 21:33:32', 'وظيفة جديدة: طبيب أُضيفت بواسطة kmal.', 0, NULL, 0),
(149, 6, 5, 'friend_request', '2025-02-25 21:39:39', 'kmal أرسل لك طلب صداقة. يمكنك قبوله أو رفضه من صفحة الأصدقاء', 0, NULL, 0),
(152, 3, 5, 'admin', '2025-02-25 21:44:44', 'وظيفة جديدة: xnsjkaxn أُضيفت بواسطة kmal.', 0, NULL, 1),
(153, 4, 5, 'admin', '2025-02-25 21:44:44', 'وظيفة جديدة: xnsjkaxn أُضيفت بواسطة kmal.', 0, NULL, 1),
(154, 6, 5, 'admin', '2025-02-25 21:44:44', 'وظيفة جديدة: xnsjkaxn أُضيفت بواسطة kmal.', 0, NULL, 0),
(159, 3, 5, 'admin', '2025-02-25 21:47:25', 'وظيفة جديدة: xnsjkaxn أُضيفت بواسطة kmal.', 0, NULL, 1),
(160, 4, 5, 'admin', '2025-02-25 21:47:25', 'وظيفة جديدة: xnsjkaxn أُضيفت بواسطة kmal.', 0, NULL, 1),
(161, 6, 5, 'admin', '2025-02-25 21:47:25', 'وظيفة جديدة: xnsjkaxn أُضيفت بواسطة kmal.', 0, NULL, 0),
(165, 3, 2, 'admin', '2025-02-25 23:26:22', 'وظيفة جديدة: aaaaaaaaa أُضيفت بواسطة ali.', 0, NULL, 1),
(166, 4, 2, 'admin', '2025-02-25 23:26:22', 'وظيفة جديدة: aaaaaaaaa أُضيفت بواسطة ali.', 0, NULL, 1),
(168, 6, 2, 'admin', '2025-02-25 23:26:22', 'وظيفة جديدة: aaaaaaaaa أُضيفت بواسطة ali.', 0, NULL, 0),
(172, 5, 3, 'accepted', '2025-02-26 13:24:25', 'mona قبل طلب صداقتك. يمكنك الآن التواصل معه', 0, NULL, 1),
(173, 3, 5, 'accepted', '2025-02-26 13:24:25', 'أصبحت صديقًا مع kmal. استمتع بالتواصل!', 0, NULL, 1),
(175, 3, 1, 'admin', '2025-02-26 15:53:22', 'مرحبا جميعآ', 0, NULL, 0),
(176, 4, 1, 'admin', '2025-02-26 15:53:22', 'مرحبا جميعآ', 0, NULL, 0),
(177, 5, 1, 'admin', '2025-02-26 15:53:22', 'مرحبا جميعآ', 0, NULL, 0),
(178, 6, 1, 'admin', '2025-02-26 15:53:22', 'مرحبا جميعآ', 0, NULL, 0);

-- --------------------------------------------------------

--
-- بنية الجدول `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission` varchar(100) NOT NULL,
  `can_edit_users` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `permissions`
--

INSERT INTO `permissions` (`id`, `role_id`, `permission`, `can_edit_users`, `created_at`) VALUES
(1, 1, 'manage_notifications', 1, '2025-02-25 10:30:19'),
(2, 1, 'view_statistics', 0, '2025-02-25 10:30:19'),
(3, 2, 'edit_posts', 1, '2025-02-25 10:30:19'),
(4, 3, 'manage_users', 1, '2025-02-25 10:30:19'),
(5, 2, 'محرر', 0, '2025-02-25 13:22:54');

-- --------------------------------------------------------

--
-- بنية الجدول `postsforum`
--

CREATE TABLE `postsforum` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `image1` varchar(255) DEFAULT NULL,
  `image2` varchar(255) DEFAULT NULL,
  `image3` varchar(255) DEFAULT NULL,
  `image4` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `postsforum`
--

INSERT INTO `postsforum` (`id`, `user_id`, `content`, `image1`, `image2`, `image3`, `image4`, `created_at`) VALUES
(3, 2, '???? للمصممين المبدعين! ???? هل أنت مصمم جرافيك تبحث عن فرص جديدة لإبراز إبداعك؟ ????✨ نحن نبحث عن مصممين محترفين لتنفيذ مشاريع مميزة في التصميم الإعلاني والهويات البصرية. ????  ???? متطلبات العمل: ✅ خبرة في استخدام Photoshop و Illustrator ✅ مهارات في تصميم الهويات البصرية، الشعارات، البوسترات ✅ الإبداع والقدرة على تحويل الأفكار إلى تصاميم رائعة  ???? المكافآت: رواتب مجزية وفرص للعمل الحر عن بُعد! ????  ???? مهتم؟ أرسل لنا نماذج من أعمالك الآن! ????  #تصميم_جرافيك #فرصة_عمل #مصممين #ابداع #وظائف_للمبدعين ????????', '1740333615119-images1.jpg', NULL, NULL, NULL, '2025-02-23 17:58:12'),
(4, 2, '???? مطلوب مصمم جرافيك مبدع! ????  ???? إذا كنت تمتلك حسًا إبداعيًا وخبرة في تصميم الشعارات والهويات البصرية، فهذه فرصتك للانضمام إلى فريق مميز! ????  ???? المهارات المطلوبة: ✅ إجادة Photoshop و Illustrator ✅ خبرة في تصميم الشعارات، البوسترات، وسائل التواصل الاجتماعي ✅ الإبداع والقدرة على تنفيذ أفكار جديدة  ???? المميزات: ???? بيئة عمل احترافية ???? رواتب مجزية مع فرص للعمل عن بُعد  ???? أرسل لنا أعمالك الآن وكن جزءًا من النجاح!  #تصميم_جرافيك #فرصة_عمل #مصممين #ابداع #وظائف_للمبدعين ????????', '1740333601000-images2.jpg', NULL, NULL, NULL, '2025-02-23 17:59:42'),
(5, 1, '???? أنا مصمم، وهذه آخر أعمالي! ????????  ???? التصميم هو شغفي، والإبداع هو هدفي! ???? أشارككم اليوم بعضًا من أحدث أعمالي في تصميم الجرافيك والهويات البصرية.  ???? مهاراتي: ✅ تصميم الشعارات والهويات البصرية ✅ تعديل الصور وتصميم الإعلانات الاحترافية ✅ إبداع مستمر في تصميم واجهات المستخدم  ???? هل تبحث عن تصميم احترافي؟ لا تتردد في التواصل معي! ????  #أنا_مصمم #تصميم_جرافيك #إبداع #أعمالي #مصمم_جرافيك ????????', '1740333804847-43695_63cf1ad6cbe7d_1674517206.webp', NULL, NULL, NULL, '2025-02-23 18:02:13'),
(6, 4, '✨ أنا مصممة، وهذه آخر أعمالي! ????  ???? التصميم هو شغفي والإبداع هو أسلوبي! ???? أشارككم اليوم بعضًا من أعمالي في تصميم الجرافيك والهويات البصرية، حيث أضع لمساتي الفنية في كل تصميم.  ???? مهاراتي: ✅ تصميم الشعارات والهويات البصرية بأسلوب مميز ✅ تصميم إعلانات وواجهات مستخدم عصرية ✅ الإبداع في تصاميم السوشيال ميديا والمطبوعات  ???? هل تبحثين عن تصميم يعكس هويتك؟ تواصلي معي الآن! ????  #أنا_مصممة #تصميم_جرافيك #إبداع_بأنوثة #أعمالي #مصممة_جرافيك ????????✨', '1740333898461-ØªØµÙÙÙ-Ø¹Ø·Ø±1.jpg', NULL, NULL, NULL, '2025-02-23 18:04:58');

-- --------------------------------------------------------

--
-- بنية الجدول `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `budget`, `duration`, `created_at`, `user_id`) VALUES
(1, 'تطبيق إدارة المهام', 'الوصف: تطوير تطبيق ويب لإدارة المهام والمشاريع بين الفرق.', 5000.00, '2', '2025-02-23 17:53:04', 2),
(2, 'منصة تعليم إلكتروني', 'الوصف: إنشاء منصة تعليمية لمشاركة الدورات التدريبية عبر الإنترنت.', 40000.00, '30', '2025-02-23 17:53:40', 2),
(3, 'نظام إدارة موارد بشرية', 'الوصف: تصميم نظام شامل لإدارة شؤون الموظفين والرواتب والإجازات.', 90000.00, '30', '2025-02-23 17:54:15', 2),
(4, 'موقع إخباري متكامل', 'الوصف: تطوير بوابة إخبارية ديناميكية تنشر الأخبار اليومية مع نظام إدارة محتوى.', 90000.00, '30', '2025-02-23 17:54:45', 2),
(5, 'تطبيق توجيه سياحي', 'الوصف: تطبيق محمول يساعد السياح في العثور على أماكن سياحية وتقديم توصيات.', 75000.00, '30', '2025-02-23 17:55:17', 2),
(19, 'aa', 'aa', 55.00, '2', '2025-02-25 23:27:37', 2);

-- --------------------------------------------------------

--
-- بنية الجدول `project_applications`
--

CREATE TABLE `project_applications` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `applicant_name` varchar(255) NOT NULL,
  `applicant_email` varchar(255) NOT NULL,
  `motivation` text NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `project_applications`
--

INSERT INTO `project_applications` (`id`, `project_id`, `applicant_name`, `applicant_email`, `motivation`, `applicant_id`, `status`, `created_at`) VALUES
(1, 1, 'موري', 'sedik@mail.com', 'yes', 1, 'accepted', '2025-02-22 16:50:56'),
(2, 1, 'sedikabdo', 'aa@mail.com', 'ىوئةءى', 2, 'accepted', '2025-02-22 17:37:57'),
(4, 2, 'nm,n', 'ali@mail.com', 'nm,n ', 2, 'accepted', '2025-02-22 17:53:05'),
(5, 2, 'سديك', 'sedik@mail.com', 'nj,sa', 1, 'accepted', '2025-02-22 18:39:51'),
(6, 3, 'صديق', 'sedik@mail.com', 'ساي', 1, 'accepted', '2025-02-22 18:41:30'),
(8, 4, 'علي عمر', 'ali@mail.com', 'مهتم بمشروعك', 2, '', '2025-02-22 19:26:00'),
(9, 5, 'nm', 'aa@mail.com', 'xxx', 2, 'accepted', '2025-02-22 19:30:48'),
(10, 5, 'n,mn', 'aa@mail.com', 'nn', 1, 'accepted', '2025-02-22 19:34:53'),
(11, 4, 'مونا', 'mona@mail.com', 'ساي', 3, 'accepted', '2025-02-23 02:58:56'),
(12, 4, 'سها', 'soha@mail.com', 'اعجبني', 4, 'rejected', '2025-02-23 12:48:17');

-- --------------------------------------------------------

--
-- بنية الجدول `project_requests`
--

CREATE TABLE `project_requests` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `status` enum('معلق','مقبول','مرفوض') DEFAULT 'معلق'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `roles`
--

INSERT INTO `roles` (`id`, `name`, `title`, `description`, `created_at`) VALUES
(1, 'moderator', 'مشرف', NULL, '2025-02-25 10:30:19'),
(2, 'editor', 'محرر', 'يمكنه تعديل المحتوى فقط', '2025-02-25 10:30:19'),
(3, 'supervisor', NULL, NULL, '2025-02-25 10:30:19');

-- --------------------------------------------------------

--
-- بنية الجدول `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `country` varchar(100) NOT NULL,
  `language` varchar(100) NOT NULL,
  `occupation` varchar(255) NOT NULL,
  `quote` text DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `portfolio` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `likes` int(11) DEFAULT 0,
  `ranking` int(11) DEFAULT 0,
  `liked` tinyint(1) DEFAULT 0,
  `last_active` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `reset_otp` varchar(4) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `users`
--

INSERT INTO `users` (`id`, `name`, `avatar`, `age`, `gender`, `country`, `language`, `occupation`, `quote`, `phone`, `email`, `portfolio`, `password`, `likes`, `ranking`, `liked`, `last_active`, `created_at`, `is_active`, `reset_otp`, `role`, `role_id`) VALUES
(1, 'sedik ', '1740517078678.jpg', 29, 'male', 'sudanes', 'arabic/english', 'devlober', '\"الإبداع هو القدرة على رؤية ما لا يراه الآخرون وتحويل الأفكار إلى واقع.\"', '0902707192', 'sedik@mail.com', 'http://localhost:3000/signup', '$2b$10$nOlkBh8uO46sqlwOgkpAeeod4QmCsFrWUqcBzBD.y4H6W/d1H79Ue', 4, 1, 0, '2025-02-26 16:04:01', '2025-02-22 16:48:27', 1, NULL, 'admin', NULL),
(2, 'ali', '1740334095748.jpg', 29, 'male', 'sudan', 'arabic', 'doctor', 'تبترىرىت', '999', 'ali@mail.com', 'http://localhost:3000/signup', '$2b$10$mxl0O5zgXo8bIJuQzkJ3keW8zWg6jkaBTn63pbZH/rgvV/Mx3QG5e', 2, 1, 0, '2025-02-26 16:12:58', '2025-02-22 16:53:54', 1, '2055', 'user', NULL),
(3, 'mona', '/uploads/avatars/6b5f92b0cde3ac521b0ea5d64689f255', 26, 'female', 'jordan', 'arabic', 'مصممة', NULL, '0127310071', 'mona@mail.com', 'http://localhost:3000/signup', '$2b$10$dnGarQT4sfNbFBgXZDqwT.tEcL0jnY9u4bl.T/fHpAvS72dWCLnoi', 0, 0, 0, '2025-02-26 13:26:46', '2025-02-23 00:43:18', 1, NULL, 'user', NULL),
(4, 'soha', '1740334000459.jpg', 26, 'female', 'jordan', 'arabic', 'مصممة', NULL, '0127310071', 'soha@mail.com', 'http://localhost:3000/signup', '$2b$10$te3Wf4dzJtG/tU6KU4lvLOTALxk0ktEt9w8NTaTPV8D4inYx2om.S', 1, 0, 0, '2025-02-26 15:21:57', '2025-02-23 00:49:13', 1, NULL, 'user', NULL),
(5, 'kmal', '/uploads/avatars/700bc718f335b1f43edd54ba1b6a1d54', 33, 'male', 'sudan', 'arabic/english', 'devlober', NULL, '9999999999999', 'kmal@mail.com', 'http://localhost:3000/signup', '$2b$10$SwHxmyIBHQoS25dHrEcCoO2dgMGi52jmEKg2M.OduOFgwG78vdNXO', 3, 1, 0, '2025-02-26 15:21:37', '2025-02-23 12:41:55', 1, NULL, 'admin', 2),
(6, 'admin', '/uploads/avatars/bb881e93b1ff571a84f40705b8fca81a', 28, 'male', 'sudanes', 'arabic/english', 'devlober', NULL, '0902707192', 'sedikdev@gmail.com', 'http://localhost:3000/signup', '$2b$10$KiSNOwASaJcP3m5DjBP6ie.EwPjQRK1iNkoztV4qVdFD47CDCR/kO', 0, 0, 0, '2025-02-23 14:07:01', '2025-02-23 14:06:53', 1, '3890', 'user', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ads`
--
ALTER TABLE `ads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `blocked_users`
--
ALTER TABLE `blocked_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_block` (`user_id`,`blocked_user_id`),
  ADD KEY `blocked_user_id` (`blocked_user_id`);

--
-- Indexes for table `block_list`
--
ALTER TABLE `block_list`
  ADD PRIMARY KEY (`blocker_id`,`blocked_id`),
  ADD KEY `blocked_id` (`blocked_id`);

--
-- Indexes for table `commentsforum`
--
ALTER TABLE `commentsforum`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_comment_like` (`comment_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indexes for table `design_gallery`
--
ALTER TABLE `design_gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `forum_exceptions`
--
ALTER TABLE `forum_exceptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `forum_settings`
--
ALTER TABLE `forum_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `friendships`
--
ALTER TABLE `friendships`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_friendship` (`user_id`,`friend_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- Indexes for table `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_request` (`sender_id`,`receiver_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `hidden_posts`
--
ALTER TABLE `hidden_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_hidden_post` (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indexes for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD PRIMARY KEY (`application_id`),
  ADD UNIQUE KEY `unique_application` (`job_id`,`applicant_id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_post_like` (`user_id`,`post_id`),
  ADD UNIQUE KEY `unique_friend_like` (`user_id`,`friend_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `messages_project`
--
ALTER TABLE `messages_project`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `message_threads`
--
ALTER TABLE `message_threads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_thread` (`user1_id`,`user2_id`),
  ADD KEY `user2_id` (`user2_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `postsforum`
--
ALTER TABLE `postsforum`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `project_applications`
--
ALTER TABLE `project_applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_application` (`project_id`,`applicant_id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `project_requests`
--
ALTER TABLE `project_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_request` (`project_id`,`applicant_id`),
  ADD KEY `applicant_id` (`applicant_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ads`
--
ALTER TABLE `ads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `blocked_users`
--
ALTER TABLE `blocked_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `commentsforum`
--
ALTER TABLE `commentsforum`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `comment_likes`
--
ALTER TABLE `comment_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `design_gallery`
--
ALTER TABLE `design_gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `forum_exceptions`
--
ALTER TABLE `forum_exceptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `forum_settings`
--
ALTER TABLE `forum_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `friendships`
--
ALTER TABLE `friendships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `friend_requests`
--
ALTER TABLE `friend_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `hidden_posts`
--
ALTER TABLE `hidden_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `job_applications`
--
ALTER TABLE `job_applications`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `messages_project`
--
ALTER TABLE `messages_project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `message_threads`
--
ALTER TABLE `message_threads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `postsforum`
--
ALTER TABLE `postsforum`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `project_applications`
--
ALTER TABLE `project_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `project_requests`
--
ALTER TABLE `project_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- قيود الجداول المُلقاة.
--

--
-- قيود الجداول `ads`
--
ALTER TABLE `ads`
  ADD CONSTRAINT `ads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `blocked_users`
--
ALTER TABLE `blocked_users`
  ADD CONSTRAINT `blocked_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blocked_users_ibfk_2` FOREIGN KEY (`blocked_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `block_list`
--
ALTER TABLE `block_list`
  ADD CONSTRAINT `block_list_ibfk_1` FOREIGN KEY (`blocker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `block_list_ibfk_2` FOREIGN KEY (`blocked_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `commentsforum`
--
ALTER TABLE `commentsforum`
  ADD CONSTRAINT `commentsforum_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `postsforum` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `commentsforum_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD CONSTRAINT `comment_likes_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `commentsforum` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_3` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `design_gallery`
--
ALTER TABLE `design_gallery`
  ADD CONSTRAINT `design_gallery_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `forum_exceptions`
--
ALTER TABLE `forum_exceptions`
  ADD CONSTRAINT `forum_exceptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD CONSTRAINT `friend_requests_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friend_requests_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `hidden_posts`
--
ALTER TABLE `hidden_posts`
  ADD CONSTRAINT `hidden_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hidden_posts_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `postsforum` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `jobs_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- قيود الجداول `job_applications`
--
ALTER TABLE `job_applications`
  ADD CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_applications_ibfk_2` FOREIGN KEY (`applicant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `postsforum` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `messages_project`
--
ALTER TABLE `messages_project`
  ADD CONSTRAINT `messages_project_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_project_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_project_ibfk_3` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `message_threads`
--
ALTER TABLE `message_threads`
  ADD CONSTRAINT `message_threads_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_threads_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `postsforum`
--
ALTER TABLE `postsforum`
  ADD CONSTRAINT `postsforum_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `project_applications`
--
ALTER TABLE `project_applications`
  ADD CONSTRAINT `project_applications_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_applications_ibfk_2` FOREIGN KEY (`applicant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `project_requests`
--
ALTER TABLE `project_requests`
  ADD CONSTRAINT `project_requests_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_requests_ibfk_2` FOREIGN KEY (`applicant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
