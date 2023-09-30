const { User } = require("../models");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const fs = require('fs');

const jwt = require("jsonwebtoken");
const secretKey = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTg3OTYzMCwiaWF0IjoxNjg5ODc5NjMwfQ.EW7Yk6kbmR5s3L1MeyVNoV8x4_T3FZOLPBYPOdO6KJQ";

exports.loginView = (req, res) => res.render('login');


exports.registerView = (req, res) => res.render("register");


exports.signUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  let routeImage = "";
  let imagenPerfil;

  if (password != confirmPassword) {
    return res.render('register', { error: 'Las contraseñas no coinciden' });
  }

  if (req.files === null) {
    routeImage = "img-por-defecto/noAutenticated.png";
  } else {
    imagenPerfil = req.files.imagenPerfil;
    routeImage = uuid.v1() + imagenPerfil.name;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await User.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        User.create({
          name: name,
          email: email,
          password: passwordHash,
          avatarUrl: routeImage,
        }).then(() => {
          if (avatarUrl) {
            avatarUrl.mv("./public/avatars/" + routeImage);
          }
          res.render("login");
        });
      } else {
        res.render('register', { error: 'Ya hay un usuario con el email: ' + email });
      }
    });
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


