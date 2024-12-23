import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { google } from 'googleapis';
import logger from './logger';
import { config } from '../config/';

export type SendEmailPayload = {
  receiver: string;
  subject: string;
  text?: string;
  html?: string;
};

const OAuth2 = google.auth.OAuth2;

const createTransporter = async (): Promise<
  Transporter<SMTPTransport.SentMessageInfo>
> => {
  const oauth2Client = new OAuth2(
    config.EMAIL_CLIENT_ID,
    config.EMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: config.EMAIL_REFRESH_TOKEN,
  });

  const accessToken = await oauth2Client.getAccessToken();

  if (!accessToken.token) {
    throw new Error('Failed to retrieve access token');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.USER_EMAIL,
      accessToken: accessToken.token,
      clientId: config.EMAIL_CLIENT_ID,
      clientSecret: config.EMAIL_CLIENT_SECRET,
      refreshToken: config.EMAIL_REFRESH_TOKEN,
    },
  });
};

export const sendEmail = async (data: SendEmailPayload): Promise<boolean> => {
  if (!data.text && !data.html) {
    logger.error('Either text or HTML content must be provided.');
    return false;
  }

  try {
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: `${config.MAIL_DISPLAY_NAME} <${config.MAIL_FROM}>`,
      to: data.receiver,
      subject: data.subject,
      html: data.html,
      text: data.text,
    });

    logger.info(`Email sent successfully to ${data.receiver}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send email: ${error}`);
    return false;
  }
};

export default sendEmail;
