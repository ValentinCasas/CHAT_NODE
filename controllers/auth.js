const { User } = require("../models");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const fs = require('fs');

const jwt = require("jsonwebtoken");
const secretKey = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTg3OTYzMCwiaWF0IjoxNjg5ODc5NjMwfQ.EW7Yk6kbmR5s3L1MeyVNoV8x4_T3FZOLPBYPOdO6KJQ";

exports.loginView = (req, res) => res.render('login');

const passwordRegex = /^(?=.*\d).{8,}$/;

exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    let imagePath = "";
    let imageUrl;

    if (password != confirmPassword) {
      return res.json({ success: false, error: 'Passwords do not match' });
    }

    if (!passwordRegex.test(password)) {
      return res.json({ success: false, error: 'Password must be at least 8 characters long and contain a number.' });
    }

    if (req.files === null) {
      imagePath = "noAuthenticated.png";
    } else {
      imageUrl = req.files.imageUrl;
      imagePath = uuid.v1() + imageUrl.name;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUserEmail = await User.findOne({ where: { email: email } });
    if (existingUserEmail) {
      return res.json({ success: false, error: 'A user with the email ' + email + ' already exists.' });
    }

    const existingUserName = await User.findOne({ where: { name: name } });
    if (existingUserName) {
      return res.json({ success: false, error: 'El nick ' + name + ' ya está en uso.' });
    } else if (name.length() < 6) {
      return res.json({ success: false, error: 'Debe tener al menos 6 caracteres ' + name + ' is already in use.' });
    }

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      avatarUrl: imagePath,
    });

    if (imageUrl) {
      imageUrl.mv("./public/avatars/" + imagePath);
    }

    res.json({ success: true, message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};




exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });
  const validado = user && await bcrypt.compare(password, user.password);

  if (validado) {
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: "4h" });

    req.session.isLoggedIn = true;
    res.cookie("token", token);
    return res.redirect("/chat");
  }

  res.render("login", { error: validado ? 'contraseña incorrecta' : 'credenciales invalidas' });
};


exports.logout = (req, res) => {
  if (req.cookies.token) {
    res.cookie("token", "", { expires: new Date(0) });
  }

  req.session.destroy(() => {
    res.render("login");
  });
};


