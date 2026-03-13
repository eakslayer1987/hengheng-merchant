-- ============================================================
--  Meeprung Reward Platform — MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS meeprung_reward
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE meeprung_reward;

-- ─── users ───────────────────────────────────────────────────
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  phone      VARCHAR(20)  NOT NULL UNIQUE,
  name       VARCHAR(100) NOT NULL DEFAULT '',
  password   VARCHAR(255),
  role       ENUM('customer','merchant','admin') NOT NULL DEFAULT 'customer',
  active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_role  (role)
) ENGINE=InnoDB;

-- ─── merchants ───────────────────────────────────────────────
CREATE TABLE merchants (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  store_name VARCHAR(200) NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  address    TEXT,
  qr_code    VARCHAR(100) NOT NULL UNIQUE,
  approved   TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_qr_code (qr_code)
) ENGINE=InnoDB;

-- ─── merchant_quota ──────────────────────────────────────────
CREATE TABLE merchant_quota (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  merchant_id INT NOT NULL,
  quota_total INT NOT NULL DEFAULT 0,
  quota_used  INT NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
  UNIQUE KEY uq_merchant (merchant_id)
) ENGINE=InnoDB;

-- ─── receipts ────────────────────────────────────────────────
CREATE TABLE receipts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  merchant_id INT          NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  quantity    INT          NOT NULL DEFAULT 1,
  approved    TINYINT(1)   NOT NULL DEFAULT 0,
  approved_at DATETIME,
  approved_by INT,
  note        VARCHAR(500),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
  INDEX idx_merchant (merchant_id),
  INDEX idx_approved (approved)
) ENGINE=InnoDB;

-- ─── rewards ─────────────────────────────────────────────────
CREATE TABLE rewards (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  name_en     VARCHAR(100) NOT NULL,
  type        ENUM('discount','free_meal','points','raffle','none') NOT NULL,
  value       DECIMAL(10,2) NOT NULL DEFAULT 0,
  probability DECIMAL(5,2)  NOT NULL DEFAULT 0,
  color       VARCHAR(20)   NOT NULL DEFAULT '#8B5CF6',
  emoji       VARCHAR(10)   NOT NULL DEFAULT '🎁',
  active      TINYINT(1)    NOT NULL DEFAULT 1,
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── spins ───────────────────────────────────────────────────
CREATE TABLE spins (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT      NOT NULL,
  merchant_id INT      NOT NULL,
  reward_id   INT      NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  FOREIGN KEY (reward_id)   REFERENCES rewards(id),
  INDEX idx_user_merchant_date (user_id, merchant_id, created_at)
) ENGINE=InnoDB;

-- ─── coupons ─────────────────────────────────────────────────
CREATE TABLE coupons (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(20)  NOT NULL UNIQUE,
  user_id     INT          NOT NULL,
  reward_id   INT          NOT NULL,
  merchant_id INT          NOT NULL,
  spin_id     INT,
  status      ENUM('active','used','expired') NOT NULL DEFAULT 'active',
  used_at     DATETIME,
  expires_at  DATETIME     NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id),
  FOREIGN KEY (reward_id)   REFERENCES rewards(id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  INDEX idx_user   (user_id),
  INDEX idx_code   (code),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ─── raffle_tickets ──────────────────────────────────────────
CREATE TABLE raffle_tickets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT         NOT NULL,
  spin_id     INT         NOT NULL,
  ticket_code VARCHAR(20) NOT NULL UNIQUE,
  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (spin_id) REFERENCES spins(id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- ─── Default rewards seed ────────────────────────────────────
INSERT INTO rewards (name, name_en, type, value, probability, color, emoji, sort_order) VALUES
  ('ส่วนลด ฿10',    '฿10 Discount',  'discount',  10,  40, '#7C3AED', '🏷️', 1),
  ('ส่วนลด ฿20',    '฿20 Discount',  'discount',  20,  20, '#6D28D9', '💜', 2),
  ('ส่วนลด ฿50',    '฿50 Discount',  'discount',  50,  10, '#5B21B6', '🎫', 3),
  ('ทานฟรีมื้อนี้',  'Free Meal',     'free_meal',  0,   5, '#10B981', '🍛', 4),
  ('50 คะแนน',      '50 Points',     'points',    50,  15, '#F59E0B', '⭐', 5),
  ('ลุ้นโชคใหญ่',   'Raffle Ticket', 'raffle',     0,  10, '#EC4899', '🎟️', 6),
  ('ไม่ได้รับรางวัล','No Reward',     'none',       0,   0, '#D1D5DB', '😔', 7);

-- ─── Default admin user ──────────────────────────────────────
-- password: admin1234 (bcrypt hash)
INSERT INTO users (phone, name, role, password) VALUES
  ('0800000000', 'Admin', 'admin',
   '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
