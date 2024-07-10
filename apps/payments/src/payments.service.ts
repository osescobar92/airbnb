import { CreateChargeDto, NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../../notifications/src/notifications.service';
import Stripe from 'stripe';    
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
    private readonly stripe = new Stripe(
        this.configService.get('STRIPE_SECRET_KEY'),
        { apiVersion: '2024-06-20' }
    );

    constructor(
        private readonly configService: ConfigService,
        @Inject(NOTIFICATIONS_SERVICE) 
        private readonly notificationsService: ClientProxy
    ) {}

    async createCharge({amount, email}: PaymentsCreateChargeDto) {
        const paymentsIntents = await this.stripe.paymentIntents.create({
            amount: amount * 100,
            confirm: true,
            currency: 'usd',
            payment_method: 'pm_card_visa',
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        });

        this.notificationsService.emit('notify_email', {
            email,
            text: `Your payment of $${amount} has completed successfully.`
        })

        return paymentsIntents;
    }
}
