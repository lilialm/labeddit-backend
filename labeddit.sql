-- Active: 1689119139555@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

INSERT INTO
    users (id, name, email, password, role)
VALUES (
        "u001",
        "Uriel",
        "uriel@email.com",
        "123456",
        "NORMAL"
    ), (
        "u002",
        "Lucas",
        "lucas@email.com",
        "123456",
        "NORMAL"
    ), (
        "u003",
        "Pepe",
        "pepe@email.com",
        "123456",
        "ADMIN"
    );

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT UNIQUE NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

INSERT INTO
    posts (id, creator_id, content, likes)
VALUES (
        "p001",
        "u001",
        "O que vocês acham de His Dark Materials?",
        2
    ), (
        "p002",
        "u002",
        "Alguém curte Bjork?",
        1
    ), (
        "p003",
        "u003",
        "Charli XCX vai lançar um novo album!",
        1
    );

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

INSERT INTO
    likes_dislikes (user_id, post_id, like)
VALUES ("u001", "p002", 1), ("u002", "p001", 1), ("u001", "p003", 1), ("u003", "p001", 1);

CREATE TABLE
    comments (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT UNIQUE NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        post_id TEXT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    likes_dislikes_comments (
        user_id TEXT NOT NULL,
        comment_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

INSERT INTO
    likes_dislikes_comments (user_id, comment_id, like)
VALUES ("u001", "c002", 1), ("u002", "c001", 1), ("u001", "c003", 1), ("u003", "c001", 1);