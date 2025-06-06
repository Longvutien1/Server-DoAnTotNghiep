import User from "../models/user"
import jwt from 'jsonwebtoken'


export const signUp = async (req, res) => {
    const { email, name, password } = req.body
    try {
        const exisUser = await User.findOne({ email }).exec();
        if (exisUser) {
            return res.status(400).json({
                message: "User đã tồn tại"
            })
        }
        const user = await User({ email, password, name }).save()
        res.json({
            user: {
                _id: user._id,
                email: user.email,
                username: user.name
            }
        })
    } catch (error) {
        res.status(400).json({ message: "Lỗi rồi" })
    }
}

export const signIn = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(400).json({ message: "User không tồn tại" });

        }
        if (!user.authenticate(password)) {
            return res.status(400).json({
                message: "Mật khẩu không đúng"
            })
        }
        const token = jwt.sign({ _id: user._id }, "123456", { expiresIn: '1h' })
        res.json({
            token,
            user: user
        })
    } catch (error) {
        res.status(400).json({
            message: "Đăng nhập thất bại"
        })
    }
}

export const userById = async (req, res, next, id) => {
    try {
        const userById = await User.findById(id).exec();
        if (!userById) {
            res.status(400).json({
                message: "Không tìm thấy user"
            })
        }

        req.profile = userById;
        req.profile.password = undefined;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getListUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

        // Tạo token mới giống như khi đăng nhập
        const token = jwt.sign({ _id: user._id }, "123456", { expiresIn: '1h' });

        // Trả về dữ liệu theo định dạng auth: {token, user: {}}
        res.json({
            token,
            user: user
        });
    } catch (error) {
        res.status(400).json({ message: "Không thể sửa" });
    }
}

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, password, _id } = req.body
        const user = await User.findOne({ _id: _id }).exec();

        if (!user.authenticate(oldPassword)) {
            return res.status(400).json({
                message: "Mật khẩu không đúng"
            })
        }
        // Mã hóa mật khẩu mới
        const encryptedPassword = user.encryPassword(password);

        // Cập nhật user với mật khẩu đã mã hóa
        const newUser = await User.findOneAndUpdate(
            { _id: _id },
            { ...req.body, password: encryptedPassword },
            { new: true }
        );

        const token = jwt.sign({ _id: newUser._id }, "123456", { expiresIn: '1h' })
        res.json({
            token,
            user: {
                _id: newUser._id,
                email: newUser.email,
                username: newUser.name,
                image: newUser.image,
                role: newUser.role,
                status: newUser.status,
                contact: newUser.contact,
            }
        })
    } catch (error) {
        res.status(400).json({ message: "Không thể sửa" });
    }
}