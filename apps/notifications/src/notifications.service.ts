import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {

    async notifyEmail({ email, text}: NotifyEmailDto) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'adrianna.mraz@ethereal.email',
                pass: 'MUxK4RtKSR3BZjYcQ2'
            }
        });

        await transporter.sendMail({
            from: 'adrianna.mraz@ethereal.email',
            to: email,
            subject: 'Sleepr Notification',
            text,
        });
    }

}
