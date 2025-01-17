import { Request, Response } from 'express';
import db from '../models';
import { generateToken } from '../helpers/jwt';
import sendEmail from '../helpers/email';
import { generateOTP } from '../helpers/handleOtp';

export const handleSendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }
  const otp = generateOTP();

  try {
    const user = await db.User.findOne({ where: { email } });
    const isNewUser = !(user?.full_name && user?.email);

    if (user) {
      user.otp = otp;
      await user.save();
    } else {
      await db.User.create({
        email,
        otp,
      });
    }

    const recipientName = user?.full_name || 'User';
    const organizationName = 'Socialize@Hiteshi';

    const emailData = {
      receiver: email,
      subject: 'Your OTP Code',
      html: `
        <html>
          <body>
            <p>Hello ${recipientName},</p>
            <p>We have received a request to verify your identity for <strong>${organizationName}</strong>. Please use the OTP below to complete your action:</p>
            <div style="font-size: 20px; font-weight: bold;">
              <p>OTP: ${otp}</p>
            </div>
            <p>This OTP is valid for 10 minutes and can only be used once. If you did not request this, please ignore this email.</p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <br>
            <p>Best Regards,<br><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxFIGZTCDVxnV5EcAxwEik-tGmTdim5vyyAw&s" alt="Socialize Hiteshi Logo" style="width: 15px; height: auto; vertical-align: middle;">${organizationName}<br>
             Crystal IT Park, 8th Floor<br>
          </body>
        </html>
      `,
    };

    const isEmailSent = await sendEmail(emailData);

    if (!isEmailSent) {
      return res.status(500).send({ message: 'Failed to send OTP email' });
    }

    res.status(200).send({
      message: 'OTP sent successfully',
      isNewUser: isNewUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to process OTP request' });
  }
};

export const handleOtpVerification = async (req: Request, res: Response) => {
  const { email, otp, username, full_name } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const num_otp = Number(otp);
    if (user.otp !== num_otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (!user.username && (!username || !full_name)) {
      return res.status(400).json({
        message: 'Username and Full Name are required for new users',
      });
    }

    if (username || full_name) {
      user.username = username || user.username;
      user.full_name = full_name || user.full_name;
      user.profile_picture = null;
      user.other_data = {
        cover_picture: '',
        location: '',
        job_title: '',
        university: '',
        bio: '',
        friends: 0,
        following: 0,
        posts: 0,
      };

      await db.FollowerList.create({
        userId: user.id,
        followers: [],
      });

      await db.FollowingList.create({
        userId: user.id,
        following: [],
      });
    }

    user.otp = null;
    await user.save();

    const token = generateToken(email);

    return res.status(200).json({
      message: 'OTP verified successfully',
      token,
    });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
