const { User, Contact, Message } = require("../models");
const { Op } = require('sequelize');


exports.chatView = async (req, res) => {

    if (!req.user) {
        return res.redirect("/auth");
    }

    const { id } = req.user;

    const contacts = await Contact.findAll({
        where: { userId: id },
        include: User,
    });

    const user = await User.findByPk(id);
    console.log(user)

    res.render('chat', { Contacts: contacts });
}

exports.getMessages = async (req, res) => {

    const { friendId } = req.body;
    const { id } = req.user;

    const friend = await User.findByPk(friendId);

    const messages = await Message.findAll({
        where: {
            [Op.or]: [
                { senderId: id, receiverId: friendId },
                { senderId: friendId, receiverId: id },
            ],
        },
        include: [
            {
                model: User,
                as: 'sender',
            },
            {
                model: User,
                as: 'receiver',
            },
        ],
        order: [['date', 'ASC']],
    });

    console.log(messages)

    const contacts = await Contact.findAll({
        where: { userId: id },
        include: User,
    });


    res.render('chat', { Messages: messages, Contacts: contacts, Friend: friend,req });


}


exports.setMessages = async (req, res) => {
    try {
      const { friendId, message } = req.body;
      const { id } = req.user;
  
      const friend = await User.findByPk(friendId);

      const newMessage = await Message.create({
        senderId: id,
        receiverId: friendId,
        edited: false,
        description: message,
        date: new Date(),
      });
  
      res.json({ success: true, message: 'Mensaje creado con éxito', data: newMessage });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error al crear el mensaje', data: null });
    }
  };
  