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


    const contacts = await Contact.findAll({
        where: { userId: id },
        include: User,
    });


    res.json({success:true, Messages: messages.reverse(), Contacts: contacts, Friend: friend, myId: id });


}


// En tu controlador (chatController.js, por ejemplo)

exports.setMessage = async (req, res) => {
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

        // Buscar los usuarios asociados a los IDs
        const sender = await User.findByPk(id);
        const receiver = await User.findByPk(friendId);

        res.json({
            success: true,
            data: {
                message: newMessage,
                sender: { name: sender.name, id: sender.id},
                receiver: { name: receiver.name, id: receiver.id},
                myId: id
            },
        });
    } catch (error) {
        res.json({ success: false, error: 'Error al enviar el mensaje', data: null });
    }
};
